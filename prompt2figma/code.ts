// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.

// Type definitions for our plugin
interface PluginMessage {
  type: string;
  payload?: any;
}

interface PromptSubmittedMessage extends PluginMessage {
  type: 'PROMPT_SUBMITTED';
  payload: {
    prompt: string;
  };
}

interface FetchFromBackendMessage extends PluginMessage {
  type: 'FETCH_FROM_BACKEND';
  payload: {
    prompt: string;
  };
}

interface UIComponent {
  type: 'frame' | 'rectangle' | 'text' | 'ellipse' | 'line' | 'vector' | 'component' | 'instance';
  name: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fills?: Paint[];
  strokes?: Paint[];
  strokeWeight?: number;
  cornerRadius?: number;
  characters?: string;
  fontSize?: number;
  fontName?: FontName;
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  layoutMode?: 'HORIZONTAL' | 'VERTICAL' | 'NONE';
  primaryAxisSizingMode?: 'FIXED' | 'AUTO';
  counterAxisSizingMode?: 'FIXED' | 'AUTO';
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
  children?: UIComponent[];
}

// Canvas Renderer Class
class CanvasRenderer {
  private static instance: CanvasRenderer;
  
  private constructor() {}
  
  static getInstance(): CanvasRenderer {
    if (!CanvasRenderer.instance) {
      CanvasRenderer.instance = new CanvasRenderer();
    }
    return CanvasRenderer.instance;
  }

  async renderComponents(components: UIComponent[]): Promise<SceneNode[]> {
    const nodes: SceneNode[] = [];
    
    for (const component of components) {
      try {
        const node = await this.createNode(component);
        if (node) {
          nodes.push(node);
        }
      } catch (error) {
        console.error(`Error creating node for ${component.name}:`, error);
      }
    }
    
    return nodes;
  }

  private async createNode(component: UIComponent): Promise<SceneNode | null> {
    let node: SceneNode;

    switch (component.type) {
      case 'frame':
        node = figma.createFrame();
        this.applyFrameProperties(node, component);
        break;
        
      case 'rectangle':
        node = figma.createRectangle();
        this.applyShapeProperties(node, component);
        break;
        
      case 'ellipse':
        node = figma.createEllipse();
        this.applyShapeProperties(node, component);
        break;
        
      case 'text':
        node = figma.createText();
        this.applyTextProperties(node, component);
        break;
        
      case 'line':
        node = figma.createLine();
        this.applyLineProperties(node, component);
        break;
        
      default:
        console.warn(`Unsupported component type: ${component.type}`);
        return null;
    }

    // Apply common properties
    this.applyCommonProperties(node, component);
    
    // Handle children recursively
    if (component.children && component.children.length > 0) {
      for (const child of component.children) {
        const childNode = await this.createNode(child);
        if (childNode && 'appendChild' in node) {
          (node as FrameNode).appendChild(childNode);
        }
      }
    }

    return node;
  }

  private applyCommonProperties(node: SceneNode, component: UIComponent): void {
    if (component.name) {
      node.name = component.name;
    }
    
    if (component.x !== undefined) {
      node.x = component.x;
    }
    
    if (component.y !== undefined) {
      node.y = component.y;
    }
  }

  private applyFrameProperties(frame: FrameNode, component: UIComponent): void {
    if (component.width !== undefined) {
      frame.resize(component.width, frame.height);
    }
    
    if (component.height !== undefined) {
      frame.resize(frame.width, component.height);
    }
    
    if (component.fills) {
      frame.fills = component.fills;
    }
    
    if (component.strokes) {
      frame.strokes = component.strokes;
    }
    
    if (component.strokeWeight !== undefined) {
      frame.strokeWeight = component.strokeWeight;
    }
    
    if (component.cornerRadius !== undefined) {
      frame.cornerRadius = component.cornerRadius;
    }
    
    // Apply Auto Layout properties
    if (component.layoutMode) {
      frame.layoutMode = component.layoutMode;
    }
    
    if (component.primaryAxisSizingMode) {
      frame.primaryAxisSizingMode = component.primaryAxisSizingMode;
    }
    
    if (component.counterAxisSizingMode) {
      frame.counterAxisSizingMode = component.counterAxisSizingMode;
    }
    
    if (component.paddingLeft !== undefined) {
      frame.paddingLeft = component.paddingLeft;
    }
    
    if (component.paddingRight !== undefined) {
      frame.paddingRight = component.paddingRight;
    }
    
    if (component.paddingTop !== undefined) {
      frame.paddingTop = component.paddingTop;
    }
    
    if (component.paddingBottom !== undefined) {
      frame.paddingBottom = component.paddingBottom;
    }
    
    if (component.itemSpacing !== undefined) {
      frame.itemSpacing = component.itemSpacing;
    }
  }

  private applyShapeProperties(shape: RectangleNode | EllipseNode, component: UIComponent): void {
    if (component.width !== undefined) {
      shape.resize(component.width, shape.height);
    }
    
    if (component.height !== undefined) {
      shape.resize(shape.width, component.height);
    }
    
    if (component.fills) {
      shape.fills = component.fills;
    }
    
    if (component.strokes) {
      shape.strokes = component.strokes;
    }
    
    if (component.strokeWeight !== undefined) {
      shape.strokeWeight = component.strokeWeight;
    }
    
    if (component.cornerRadius !== undefined && 'cornerRadius' in shape) {
      (shape as RectangleNode).cornerRadius = component.cornerRadius;
    }
  }

  private applyTextProperties(text: TextNode, component: UIComponent): void {
    if (component.characters) {
      text.characters = component.characters;
    }
    
    if (component.fontSize !== undefined) {
      text.fontSize = component.fontSize;
    }
    
    if (component.fontName) {
      text.fontName = component.fontName;
    }
    
    if (component.textAlignHorizontal) {
      text.textAlignHorizontal = component.textAlignHorizontal;
    }
    
    if (component.textAlignVertical) {
      text.textAlignVertical = component.textAlignVertical;
    }
    
    if (component.fills) {
      text.fills = component.fills;
    }
  }

  private applyLineProperties(line: LineNode, component: UIComponent): void {
    if (component.strokes) {
      line.strokes = component.strokes;
    }
    
    if (component.strokeWeight !== undefined) {
      line.strokeWeight = component.strokeWeight;
    }
  }
}

// Initialize services
const canvasRenderer = CanvasRenderer.getInstance();

// Show the plugin UI
figma.showUI(__html__, { width: 400, height: 600 });

// Handle messages from the UI
figma.ui.onmessage = async (message: PluginMessage) => {
  console.log('Received message:', message);

  switch (message.type) {
    case 'PROMPT_SUBMITTED':
      await handlePromptSubmitted(message as PromptSubmittedMessage);
      break;
      
    case 'FETCH_FROM_BACKEND':
      await handleFetchFromBackend(message as FetchFromBackendMessage);
      break;
      
    default:
      console.warn('Unknown message type:', message.type);
  }
};

/**
 * Handles when a prompt is submitted from the UI
 */
async function handlePromptSubmitted(message: PromptSubmittedMessage): Promise<void> {
  const { prompt } = message.payload;
  
  console.log('Processing prompt:', prompt);
  
  // Delegate to UI thread for backend communication
  figma.ui.postMessage({
    type: 'FETCH_FROM_BACKEND',
    payload: { prompt }
  });
}

/**
 * Handles the backend response and renders to canvas
 */
async function handleBackendResponse(response: any): Promise<void> {
  try {
    if (!response.success) {
      console.error('Backend request failed:', response.error);
      figma.ui.postMessage({
        type: 'BACKEND_RESPONSE_RECEIVED',
        payload: {
          success: false,
          error: response.error || 'Backend request failed'
        }
      });
      return;
    }

    const { components } = response.data;
    
    if (!components || !Array.isArray(components)) {
      throw new Error('Invalid response format: missing components array');
    }

    console.log('Rendering components:', components);

    // Render components to canvas
    const nodes = await canvasRenderer.renderComponents(components);
    
    if (nodes.length > 0) {
      // Add nodes to current page
      for (const node of nodes) {
        figma.currentPage.appendChild(node);
      }
      
      // Select and zoom to the generated nodes
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
      
      console.log(`Successfully rendered ${nodes.length} nodes`);
    }

    // Send success response back to UI
    figma.ui.postMessage({
      type: 'BACKEND_RESPONSE_RECEIVED',
      payload: {
        success: true,
        data: response.data
      }
    });

  } catch (error) {
    console.error('Error rendering components:', error);
    figma.ui.postMessage({
      type: 'BACKEND_RESPONSE_RECEIVED',
      payload: {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    });
  }
}

/**
 * Handles backend communication (this would normally be done in UI thread)
 * For now, we'll simulate the backend response with a sample component
 */
async function handleFetchFromBackend(message: FetchFromBackendMessage): Promise<void> {
  const { prompt } = message.payload;
  
  console.log('Fetching from backend for prompt:', prompt);
  
  try {
    // In a real implementation, this would be done in the UI thread
    // For now, we'll create a sample response to test the rendering
    const sampleResponse = {
      success: true,
      data: {
        components: [
          {
            type: 'frame' as const,
            name: 'Login Form',
            width: 400,
            height: 300,
            x: 100,
            y: 100,
            fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
            strokes: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }],
            strokeWeight: 1,
            cornerRadius: 8,
            layoutMode: 'VERTICAL' as const,
            primaryAxisSizingMode: 'AUTO' as const,
            counterAxisSizingMode: 'AUTO' as const,
            paddingLeft: 24,
            paddingRight: 24,
            paddingTop: 24,
            paddingBottom: 24,
            itemSpacing: 16,
            children: [
              {
                type: 'text' as const,
                name: 'Title',
                characters: 'Login',
                fontSize: 24,
                fontName: { family: 'Inter', style: 'Bold' },
                textAlignHorizontal: 'CENTER' as const,
                fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]
              },
              {
                type: 'frame' as const,
                name: 'Email Field',
                width: 352,
                height: 48,
                fills: [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }],
                strokes: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }],
                strokeWeight: 1,
                cornerRadius: 4,
                children: [
                  {
                    type: 'text' as const,
                    name: 'Email Placeholder',
                    characters: 'Enter your email',
                    fontSize: 14,
                    fontName: { family: 'Inter', style: 'Regular' },
                    fills: [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }],
                    x: 12,
                    y: 14
                  }
                ]
              },
              {
                type: 'frame' as const,
                name: 'Password Field',
                width: 352,
                height: 48,
                fills: [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.98 } }],
                strokeWeight: 1,
                cornerRadius: 4,
                children: [
                  {
                    type: 'text' as const,
                    name: 'Password Placeholder',
                    characters: 'Enter your password',
                    fontSize: 14,
                    fontName: { family: 'Inter', style: 'Regular' },
                    fills: [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }],
                    x: 12,
                    y: 14
                  }
                ]
              },
              {
                type: 'frame' as const,
                name: 'Login Button',
                width: 352,
                height: 48,
                fills: [{ type: 'SOLID', color: { r: 0.094, g: 0.627, b: 0.984 } }],
                cornerRadius: 4,
                children: [
                  {
                    type: 'text' as const,
                    name: 'Button Text',
                    characters: 'Login',
                    fontSize: 16,
                    fontName: { family: 'Inter', style: 'Medium' },
                    textAlignHorizontal: 'CENTER' as const,
                    textAlignVertical: 'CENTER' as const,
                    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
                    x: 176,
                    y: 14
                  }
                ]
              }
            ]
          }
        ]
      }
    };

    // Process the response
    await handleBackendResponse(sampleResponse);
    
  } catch (error) {
    console.error('Error in backend communication:', error);
    figma.ui.postMessage({
      type: 'BACKEND_RESPONSE_RECEIVED',
      payload: {
        success: false,
        error: error instanceof Error ? error.message : 'Backend communication failed'
      }
    });
  }
}

// Keep the plugin running
console.log('Prompt2Figma plugin initialized');
