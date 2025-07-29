// Message types for communication between UI and main thread
export interface PluginMessage {
  type: string;
  payload?: any;
}

export interface PromptSubmittedMessage extends PluginMessage {
  type: 'PROMPT_SUBMITTED';
  payload: {
    prompt: string;
  };
}

export interface FetchFromBackendMessage extends PluginMessage {
  type: 'FETCH_FROM_BACKEND';
  payload: {
    prompt: string;
  };
}

export interface BackendResponseReceivedMessage extends PluginMessage {
  type: 'BACKEND_RESPONSE_RECEIVED';
  payload: {
    success: boolean;
    data?: any;
    error?: string;
  };
}

// UI Component structure from backend
export interface UIComponent {
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

// Backend API response
export interface BackendResponse {
  success: boolean;
  data?: {
    components: UIComponent[];
    code?: string;
  };
  error?: string;
}

// Plugin state
export interface PluginState {
  isLoading: boolean;
  error: string | null;
  lastGeneratedDesign: UIComponent[] | null;
} 