# Prompt2Figma Plugin

An AI-powered Figma plugin that generates UI designs from natural language prompts. This plugin bridges the gap between design and development by enabling users to create production-ready UI components directly in Figma using simple text descriptions.

## 🎯 Project Vision

Prompt2Figma transforms the design-to-development workflow by:

- **Eliminating Manual Translation**: No more painstaking pixel-to-code conversion
- **Accelerating Iteration**: Generate and modify designs instantly with natural language
- **Ensuring Consistency**: AI-generated components follow design system patterns
- **Reducing Costs**: Cut development time by up to 40%

## 🏗️ Architecture

The plugin consists of two main components:

### 1. Frontend (Figma Plugin)
- **React UI**: Modern interface for prompt input and feedback
- **Canvas Renderer**: Converts JSON components to Figma layers
- **Message Passing**: Secure communication between UI and main threads
- **TypeScript**: Full type safety and modern development experience

### 2. Backend (MCP Server)
- **Python FastAPI**: High-performance API server
- **Celery**: Asynchronous task processing
- **AI Models**: Llama 3.1 and Code Llama via Ollama
- **Multi-step Pipeline**: Prompt → JSON → Code → Validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Figma Desktop App
- Python 3.8+ (for backend)

### Installation

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Build the Plugin**
   ```bash
   npm run build
   ```

3. **Development Mode**
   ```bash
   npm run dev
   ```

4. **Load in Figma**
   - Open Figma Desktop App
   - Go to Plugins → Development → Import plugin from manifest
   - Select the `manifest.json` file in this project

## 📁 Project Structure

```
prompt2figma/
├── src/
│   ├── types/           # TypeScript type definitions
│   ├── ui/              # React UI components
│   └── utils/           # Utility classes
├── dist/                # Built UI files
├── code.ts              # Main plugin logic
├── ui.html              # UI container
├── manifest.json        # Figma plugin manifest
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Build configuration
└── README.md           # This file
```

## 🔧 Development

### Available Scripts

- `npm run build` - Build both UI and plugin code
- `npm run dev` - Start development mode with file watching
- `npm run watch` - Watch for changes and rebuild automatically
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run clean` - Clean build artifacts

### Development Workflow

1. **Start Development Mode**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit UI components in `src/ui/`
   - Modify plugin logic in `code.ts`
   - Update types in `src/types/`

3. **Test in Figma**
   - Reload the plugin in Figma
   - Test with different prompts
   - Check console for debugging info

## 🔌 Backend Integration

### Current Setup
The plugin is currently configured with a sample response for testing. To connect to your MCP backend:

1. **Update Backend URL**
   ```typescript
   // In src/utils/backendService.ts
   private baseUrl: string = 'http://localhost:8000';
   ```

2. **Expected API Endpoint**
   ```
   POST /api/v1/generate
   Content-Type: application/json
   
   {
     "prompt": "string",
     "options": {
       "includeCode": true,
       "format": "figma"
     }
   }
   ```

3. **Expected Response Format**
   ```json
   {
     "success": true,
     "data": {
       "components": [
         {
           "type": "frame",
           "name": "Component Name",
           "width": 400,
           "height": 300,
           "children": [...]
         }
       ],
       "code": "optional React code"
     }
   }
   ```

## 🎨 UI Component Structure

The plugin supports the following Figma node types:

- **Frame**: Container with Auto Layout support
- **Rectangle**: Basic shapes with fills and strokes
- **Ellipse**: Circular shapes
- **Text**: Typography with font properties
- **Line**: Simple line elements

Each component supports:
- Positioning (x, y coordinates)
- Sizing (width, height)
- Styling (fills, strokes, corner radius)
- Layout (Auto Layout properties)
- Nesting (parent-child relationships)

## 🔒 Security & Permissions

The plugin requires:
- **Network Access**: For backend communication
- **Document Access**: To create and modify Figma layers
- **UI Thread**: For React interface rendering

## 🐛 Troubleshooting

### Common Issues

1. **Plugin Not Loading**
   - Check `manifest.json` syntax
   - Ensure all files are built (`npm run build`)
   - Verify Figma plugin permissions

2. **UI Not Rendering**
   - Check browser console for errors
   - Verify `ui.html` references correct build file
   - Ensure React dependencies are installed

3. **Backend Connection Issues**
   - Verify backend server is running
   - Check network permissions in manifest
   - Test API endpoint directly

4. **Canvas Rendering Errors**
   - Check component structure in JSON
   - Verify all required properties are present
   - Review Figma API compatibility

### Debug Mode

Enable detailed logging by checking the browser console in Figma:
1. Open Figma Desktop
2. Right-click plugin window
3. Select "Inspect Element"
4. Check Console tab for debug messages

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Figma Plugin API documentation
3. Open an issue on GitHub

---

**Note**: This plugin is designed to work with your custom MCP backend server. Make sure your backend is properly configured and running before testing the full functionality.
