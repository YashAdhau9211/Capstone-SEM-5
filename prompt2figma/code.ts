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

interface BackendResponsePayload {
  status: 'success' | 'error';
  data?: any;
  error?: {
    message: string;
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
  console.log('Main thread received message:', message);

  switch (message.type) {
    case 'PROMPT_SUBMITTED':
      await handlePromptSubmitted(message as PromptSubmittedMessage);
      break;
      
    case 'BACKEND_RESPONSE_RECEIVED':
      await handleBackendResponse(message.payload as BackendResponsePayload);
      break;
      
    default:
      console.warn('Unknown message type received in main thread:', message.type);
  }
};

/**
 * Handles the PROMPT_SUBMITTED message from the UI thread.
 * Its ONLY job is to delegate the network call back to the UI thread.
 */
async function handlePromptSubmitted(message: PromptSubmittedMessage): Promise<void> {
  const { prompt } = message.payload;
  
  console.log('Main thread received prompt. Delegating to UI for network request.');
  
  // Tell the UI to update its status to "loading".
  figma.ui.postMessage({
    type: 'UPDATE_UI_STATUS',
    payload: { status: 'loading', message: 'Generating...' }
  });

  // "Boomerang" the request back to the UI thread to perform the fetch.
  figma.ui.postMessage({
    type: 'FETCH_FROM_BACKEND',
    payload: {
      endpoint: '/api/v1/generate', // The backend API endpoint
      body: { prompt: prompt }
    }
  });
}

/**
 * Handles the BACKEND_RESPONSE_RECEIVED message from the UI thread.
 * Its ONLY job is to parse the response and render to the canvas.
 */
async function handleBackendResponse(payload: BackendResponsePayload): Promise<void> {
  if (payload.status === 'error') {
    console.error('Backend returned an error:', payload.data);
    figma.ui.postMessage({
      type: 'UPDATE_UI_STATUS',
      payload: { status: 'error', message: payload.data?.error?.message || 'An unknown error occurred.' }
    });
    return;
  }
  
  try {
    // The backend's successful response is in payload.data.
    // The actual JSON for rendering is inside payload.data.result.code
    // Let's assume the final generated code is the result we need to render.
    // This part may need adjustment based on the final backend response shape.
    const resultObject = payload.data.result; // The result from Celery
    const generatedCode = JSON.parse(resultObject.code); // The JSON from the validator
    
    // The `components` array for your renderer should be inside this object.
    const componentsToRender = generatedCode.components; 
    
    if (!componentsToRender || !Array.isArray(componentsToRender)) {
      throw new Error('Invalid data structure from backend: `components` array not found.');
    }
    
    console.log('Main thread received components. Starting render...');
    const nodes = await canvasRenderer.renderComponents(componentsToRender);
    
    if (nodes.length > 0) {
      // Add nodes to current page
      for (const node of nodes) {
        figma.currentPage.appendChild(node);
      }
      
      // Select and zoom to the generated nodes
      figma.currentPage.selection = nodes;
      figma.viewport.scrollAndZoomIntoView(nodes);
      
      console.log(`Successfully rendered ${nodes.length} nodes.`);
    }

    // Tell the UI that we are done.
    figma.ui.postMessage({
      type: 'UPDATE_UI_STATUS',
      payload: { status: 'idle', message: 'Generation complete!' }
    });
    
  } catch (error) {
    console.error('Error rendering components on canvas:', error);
    figma.ui.postMessage({
      type: 'UPDATE_UI_STATUS',
      payload: { status: 'error', message: error instanceof Error ? error.message : 'Failed to render design.' }
    });
  }
}

// Keep the plugin running
console.log('Prompt2Figma plugin initialized');