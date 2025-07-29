"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = __importDefault(require("react-dom/client"));
// Backend service for UI thread
class BackendService {
    constructor() {
        this.baseUrl = 'http://localhost:8000';
    }
    generateDesign(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(`${this.baseUrl}/api/v1/generate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: prompt,
                        options: {
                            includeCode: true,
                            format: 'figma'
                        }
                    }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = yield response.json();
                return {
                    status: 'success',
                    data: data
                };
            }
            catch (error) {
                console.error('Backend service error:', error);
                return {
                    status: 'error',
                    data: {
                        error: {
                            message: error instanceof Error ? error.message : 'Unknown error occurred'
                        }
                    }
                };
            }
        });
    }
    // For development/testing, return a sample response
    generateSampleDesign(prompt) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Generating sample design for prompt:', prompt);
            // Simulate network delay
            yield new Promise(resolve => setTimeout(resolve, 1000));
            return {
                status: 'success',
                data: {
                    result: {
                        code: JSON.stringify({
                            components: [
                                {
                                    type: 'frame',
                                    name: 'Sample UI',
                                    width: 400,
                                    height: 300,
                                    x: 100,
                                    y: 100,
                                    fills: [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }],
                                    strokes: [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }],
                                    strokeWeight: 1,
                                    cornerRadius: 8,
                                    layoutMode: 'VERTICAL',
                                    primaryAxisSizingMode: 'AUTO',
                                    counterAxisSizingMode: 'AUTO',
                                    paddingLeft: 24,
                                    paddingRight: 24,
                                    paddingTop: 24,
                                    paddingBottom: 24,
                                    itemSpacing: 16,
                                    children: [
                                        {
                                            type: 'text',
                                            name: 'Title',
                                            characters: 'Generated UI',
                                            fontSize: 24,
                                            fontName: { family: 'Inter', style: 'Bold' },
                                            textAlignHorizontal: 'CENTER',
                                            fills: [{ type: 'SOLID', color: { r: 0.1, g: 0.1, b: 0.1 } }]
                                        },
                                        {
                                            type: 'text',
                                            name: 'Description',
                                            characters: `Generated from: "${prompt}"`,
                                            fontSize: 14,
                                            fontName: { family: 'Inter', style: 'Regular' },
                                            textAlignHorizontal: 'CENTER',
                                            fills: [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.6 } }]
                                        }
                                    ]
                                }
                            ]
                        })
                    }
                }
            };
        });
    }
}
const App = () => {
    const [prompt, setPrompt] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [statusMessage, setStatusMessage] = (0, react_1.useState)('');
    const backendService = new BackendService();
    (0, react_1.useEffect)(() => {
        // Listen for messages from the main thread
        window.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
            const message = event.data.pluginMessage;
            if (message.type === 'UPDATE_UI_STATUS') {
                const statusMsg = message;
                const { status, message: msg } = statusMsg.payload;
                setIsLoading(status === 'loading');
                setStatusMessage(msg);
                if (status === 'error') {
                    setError(msg);
                }
                else {
                    setError(null);
                }
            }
            if (message.type === 'FETCH_FROM_BACKEND') {
                const fetchMsg = message;
                const { body } = fetchMsg.payload;
                console.log('UI thread received fetch request:', body);
                try {
                    // For now, use sample response. Replace with real backend call when ready
                    const response = yield backendService.generateSampleDesign(body.prompt);
                    // Send the response back to the main thread
                    parent.postMessage({
                        pluginMessage: {
                            type: 'BACKEND_RESPONSE_RECEIVED',
                            payload: response
                        }
                    }, '*');
                }
                catch (error) {
                    console.error('Error in backend communication:', error);
                    // Send error response back to main thread
                    parent.postMessage({
                        pluginMessage: {
                            type: 'BACKEND_RESPONSE_RECEIVED',
                            payload: {
                                status: 'error',
                                data: {
                                    error: {
                                        message: error instanceof Error ? error.message : 'Backend communication failed'
                                    }
                                }
                            }
                        }
                    }, '*');
                }
            }
        });
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prompt.trim())
            return;
        setIsLoading(true);
        setError(null);
        setStatusMessage('');
        // Send prompt to main thread
        parent.postMessage({
            pluginMessage: {
                type: 'PROMPT_SUBMITTED',
                payload: { prompt: prompt.trim() }
            }
        }, '*');
    };
    const handleExamplePrompt = (examplePrompt) => {
        setPrompt(examplePrompt);
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { padding: '16px', fontFamily: 'Inter, sans-serif' }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { marginBottom: '16px' }, children: [(0, jsx_runtime_1.jsx)("h2", { style: { margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }, children: "Prompt2Figma" }), (0, jsx_runtime_1.jsx)("p", { style: { margin: '0', fontSize: '12px', color: '#666' }, children: "Generate UI designs from natural language prompts" })] }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, style: { marginBottom: '16px' }, children: [(0, jsx_runtime_1.jsx)("textarea", { value: prompt, onChange: (e) => setPrompt(e.target.value), placeholder: "Describe the UI you want to create... (e.g., 'A login form with email and password fields')", style: {
                            width: '100%',
                            minHeight: '80px',
                            padding: '8px',
                            border: '1px solid #e1e1e1',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            marginBottom: '8px'
                        }, disabled: isLoading }), (0, jsx_runtime_1.jsx)("button", { type: "submit", disabled: isLoading || !prompt.trim(), style: {
                            width: '100%',
                            padding: '8px 16px',
                            backgroundColor: isLoading ? '#ccc' : '#18A0FB',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '500',
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }, children: isLoading ? 'Generating...' : 'Generate Design' })] }), error && ((0, jsx_runtime_1.jsx)("div", { style: {
                    padding: '8px',
                    backgroundColor: '#FFE6E6',
                    border: '1px solid #FFB3B3',
                    borderRadius: '4px',
                    marginBottom: '16px'
                }, children: (0, jsx_runtime_1.jsxs)("p", { style: { margin: '0', fontSize: '12px', color: '#D32F2F' }, children: ["Error: ", error] }) })), statusMessage && !error && ((0, jsx_runtime_1.jsx)("div", { style: {
                    padding: '8px',
                    backgroundColor: '#E8F5E8',
                    border: '1px solid #A5D6A7',
                    borderRadius: '4px',
                    marginBottom: '16px'
                }, children: (0, jsx_runtime_1.jsx)("p", { style: { margin: '0', fontSize: '12px', color: '#2E7D32' }, children: statusMessage }) })), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '16px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }, children: "Example Prompts" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexDirection: 'column', gap: '4px' }, children: [
                            'A login form with email and password fields',
                            'A navigation bar with logo and menu items',
                            'A product card with image, title, and price',
                            'A dashboard with charts and metrics',
                            'A mobile app header with back button and title'
                        ].map((example, index) => ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleExamplePrompt(example), style: {
                                padding: '6px 8px',
                                backgroundColor: 'transparent',
                                border: '1px solid #e1e1e1',
                                borderRadius: '4px',
                                fontSize: '11px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                color: '#333'
                            }, children: example }, index))) })] })] }));
};
// Render the app
const root = client_1.default.createRoot(document.getElementById('root'));
root.render((0, jsx_runtime_1.jsx)(App, {}));
