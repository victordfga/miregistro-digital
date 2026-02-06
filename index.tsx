import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ============================================================================
// MANEJO DE RECUPERACIÓN DE CONTRASEÑA
// ============================================================================
// Supabase envía enlaces como: site.com/#access_token=...&type=recovery
// El cliente de Supabase detectará automáticamente estos tokens y emitirá
// el evento PASSWORD_RECOVERY. NO debemos modificar el hash antes de que
// Supabase lo procese.
// ============================================================================

const hash = window.location.hash;

// Detectar si es un enlace de recuperación de Supabase
const isRecoveryLink = hash.includes('access_token=') && hash.includes('type=recovery');

if (isRecoveryLink) {
  console.log('[Recovery] Enlace de recuperación detectado');
  console.log('[Recovery] Supabase procesará los tokens automáticamente');
  // Guardamos un flag para saber que estamos en flujo de recuperación
  sessionStorage.setItem('pending_password_recovery', 'true');
}

// Montar React - Supabase procesará el hash automáticamente
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