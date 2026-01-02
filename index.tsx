
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("Critical Failure: Root element #root not found in DOM.");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("React Mounting Error:", err);
    rootElement.innerHTML = `
      <div style="color: #ef4444; padding: 40px; font-family: sans-serif; background: #0c0c0e; height: 100vh;">
        <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 1rem;">Failed to initialize application</h1>
        <pre style="background: #18181b; padding: 20px; border-radius: 8px; font-size: 0.875rem; color: #d4d4d8; overflow: auto;">${err instanceof Error ? err.message : String(err)}</pre>
        <p style="margin-top: 1rem; color: #71717a;">Check the browser console for more details.</p>
      </div>
    `;
  }
}
