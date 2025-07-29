export const config = {
  // Backend configuration
  backend: {
    baseUrl: 'http://localhost:8000',
    timeout: 30000, // 30 seconds
    retries: 3,
  },
  
  // Plugin configuration
  plugin: {
    name: 'Prompt2Figma',
    version: '1.0.0',
    ui: {
      width: 400,
      height: 600,
    },
  },
  
  // Development settings
  development: {
    enableDebugLogging: true,
    mockBackend: true, // Set to false to use real backend
    samplePrompts: [
      'A login form with email and password fields',
      'A navigation bar with logo and menu items',
      'A product card with image, title, and price',
      'A dashboard with charts and metrics',
      'A mobile app header with back button and title',
    ],
  },
  
  // Figma API settings
  figma: {
    supportedNodeTypes: [
      'frame',
      'rectangle',
      'ellipse',
      'text',
      'line',
    ],
    defaultFont: {
      family: 'Inter',
      style: 'Regular',
    },
    defaultColors: {
      primary: { r: 0.094, g: 0.627, b: 0.984 },
      secondary: { r: 0.6, g: 0.6, b: 0.6 },
      background: { r: 1, g: 1, b: 1 },
      text: { r: 0.1, g: 0.1, b: 0.1 },
    },
  },
}; 