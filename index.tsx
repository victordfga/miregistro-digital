import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ============================================================================
// DETECCIÓN DE RECUPERACIÓN DE CONTRASEÑA
// ============================================================================
// En lugar de interceptar y procesar manualmente, detectamos el enlace y
// dejamos que Supabase lo procese automáticamente cuando se inicialice.
// Solo guardamos un flag para saber que debemos navegar a update-password.
// ============================================================================

const hash = window.location.hash;

// Detectar si es un enlace de recuperación de Supabase
const isRecoveryLink = hash.includes('access_token=') && hash.includes('type=recovery');

if (isRecoveryLink) {
  console.log('[Recovery] Enlace de recuperación detectado en hash');
  // Guardar flag - la navegación la hará AuthContext cuando detecte PASSWORD_RECOVERY
  sessionStorage.setItem('recovery_detected', 'true');
}

// Montar React - dejar que Supabase procese el hash automáticamente
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