"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const client_1 = __importDefault(require("react-dom/client"));
const App = () => {
    const [prompt, setPrompt] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [lastResponse, setLastResponse] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        // Listen for messages from the main thread
        window.onmessage = (event) => {
            const message = event.data.pluginMessage;
            if (message.type === 'BACKEND_RESPONSE_RECEIVED') {
                setIsLoading(false);
                setLastResponse(message.payload);
                if (!message.payload.success) {
                    setError(message.payload.error || 'An error occurred');
                }
                else {
                    setError(null);
                }
            }
        };
    }, []);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!prompt.trim())
            return;
        setIsLoading(true);
        setError(null);
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
                }, children: (0, jsx_runtime_1.jsxs)("p", { style: { margin: '0', fontSize: '12px', color: '#D32F2F' }, children: ["Error: ", error] }) })), (lastResponse === null || lastResponse === void 0 ? void 0 : lastResponse.success) && ((0, jsx_runtime_1.jsx)("div", { style: {
                    padding: '8px',
                    backgroundColor: '#E8F5E8',
                    border: '1px solid #A5D6A7',
                    borderRadius: '4px',
                    marginBottom: '16px'
                }, children: (0, jsx_runtime_1.jsx)("p", { style: { margin: '0', fontSize: '12px', color: '#2E7D32' }, children: "Design generated successfully! Check your Figma canvas." }) })), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '16px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }, children: "Example Prompts" }), (0, jsx_runtime_1.jsx)("div", { style: { display: 'flex', flexDirection: 'column', gap: '4px' }, children: [
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
