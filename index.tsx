import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// No manual hash manipulation needed with BrowserRouter
// Supabase will handle hash fragments from the recovery link natively.

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);