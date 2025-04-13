import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'

// Log the base URL to help with debugging
console.log('Base URL:', import.meta.env.BASE_URL);

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
