import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = document.getElementById('root');

try {
  const reactRoot = createRoot(root);
  reactRoot.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} catch (error) {
  console.error('Error rendering app:', error);
  root.innerHTML = '<div style="color: red;">Failed to load the application. Check the console for more details.</div>';
}