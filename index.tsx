import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// INTERCEPTOR DE RECUPERACIÓN DE CONTRASEÑA (ANTES DE REACT)
// ============================================================================
// PROBLEMA: Supabase envía tokens en hash (#access_token=...) pero HashRouter
// también usa hash (#/ruta). Esto causa conflicto.
// SOLUCIÓN: Interceptar ANTES de React, procesar tokens con Supabase, y
// luego cambiar el hash para que HashRouter funcione.
// ============================================================================

const fullUrl = window.location.href;
const hash = window.location.hash;

console.log('[Recovery Interceptor] URL:', fullUrl);

// Detectar si es un enlace de recuperación de Supabase
const isRecoveryLink = hash.includes('access_token=') && hash.includes('type=recovery');

if (isRecoveryLink) {
  console.log('[Recovery Interceptor] ¡Enlace de recuperación detectado!');

  // Extraer tokens del hash
  const accessTokenMatch = hash.match(/access_token=([^&]+)/);
  const refreshTokenMatch = hash.match(/refresh_token=([^&]+)/);

  const accessToken = accessTokenMatch ? accessTokenMatch[1] : null;
  const refreshToken = refreshTokenMatch ? refreshTokenMatch[1] : null;

  console.log('[Recovery Interceptor] Access token:', accessToken ? 'Encontrado' : 'No encontrado');
  console.log('[Recovery Interceptor] Refresh token:', refreshToken ? 'Encontrado' : 'No encontrado');

  if (accessToken) {
    // Guardar tokens para que UpdatePassword los use
    sessionStorage.setItem('recovery_access_token', accessToken);
    if (refreshToken) {
      sessionStorage.setItem('recovery_refresh_token', refreshToken);
    }
    sessionStorage.setItem('recovery_pending', 'true');

    // Cambiar el hash ANTES de montar React para que HashRouter funcione
    window.history.replaceState(null, '', window.location.origin + window.location.pathname + '#/update-password');

    console.log('[Recovery Interceptor] Tokens guardados, redirigiendo a #/update-password');
  }
}

// Montar React
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