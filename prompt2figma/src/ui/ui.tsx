import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { PluginMessage, BackendResponse } from '../types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResponse, setLastResponse] = useState<BackendResponse | null>(null);

  useEffect(() => {
    // Listen for messages from the main thread
    window.onmessage = (event) => {
      const message: PluginMessage = event.data.pluginMessage;
      
      if (message.type === 'BACKEND_RESPONSE_RECEIVED') {
        setIsLoading(false);
        setLastResponse(message.payload);
        
        if (!message.payload.success) {
          setError(message.payload.error || 'An error occurred');
        } else {
          setError(null);
        }
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    // Send prompt to main thread
    parent.postMessage(
      {
        pluginMessage: {
          type: 'PROMPT_SUBMITTED',
          payload: { prompt: prompt.trim() }
        }
      },
      '*'
    );
  };

  const handleExamplePrompt = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <div style={{ padding: '16px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
          Prompt2Figma
        </h2>
        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
          Generate UI designs from natural language prompts
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: '16px' }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the UI you want to create... (e.g., 'A login form with email and password fields')"
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '8px',
            border: '1px solid #e1e1e1',
            borderRadius: '4px',
            fontSize: '12px',
            fontFamily: 'inherit',
            resize: 'vertical',
            marginBottom: '8px'
          }}
          disabled={isLoading}
        />
        
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          style={{
            width: '100%',
            padding: '8px 16px',
            backgroundColor: isLoading ? '#ccc' : '#18A0FB',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Generating...' : 'Generate Design'}
        </button>
      </form>

      {error && (
        <div style={{
          padding: '8px',
          backgroundColor: '#FFE6E6',
          border: '1px solid #FFB3B3',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#D32F2F' }}>
            Error: {error}
          </p>
        </div>
      )}

      {lastResponse?.success && (
        <div style={{
          padding: '8px',
          backgroundColor: '#E8F5E8',
          border: '1px solid #A5D6A7',
          borderRadius: '4px',
          marginBottom: '16px'
        }}>
          <p style={{ margin: '0', fontSize: '12px', color: '#2E7D32' }}>
            Design generated successfully! Check your Figma canvas.
          </p>
        </div>
      )}

      <div style={{ marginTop: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '500' }}>
          Example Prompts
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[
            'A login form with email and password fields',
            'A navigation bar with logo and menu items',
            'A product card with image, title, and price',
            'A dashboard with charts and metrics',
            'A mobile app header with back button and title'
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => handleExamplePrompt(example)}
              style={{
                padding: '6px 8px',
                backgroundColor: 'transparent',
                border: '1px solid #e1e1e1',
                borderRadius: '4px',
                fontSize: '11px',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#333'
              }}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />); 