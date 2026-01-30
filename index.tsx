import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ============================================================================
// INTERCEPTOR DE RECUPERACIÓN DE CONTRASEÑA (ANTES DE REACT/HASHROUTER)
// ============================================================================
// Supabase envía enlaces como: site.com/#access_token=...&type=recovery
// HashRouter espera: site.com/#/ruta
// Esto causa un conflicto. Debemos interceptar ANTES de que React se monte.
// ============================================================================

const fullUrl = window.location.href;
const hash = window.location.hash;
const search = window.location.search;

console.log('[Recovery Interceptor] URL completa:', fullUrl);

// Detectar tokens de Supabase en CUALQUIER parte de la URL
const hasRecoveryTokens =
  fullUrl.includes('access_token=') ||
  fullUrl.includes('type=recovery') ||
  hash.includes('access_token=') ||
  hash.includes('type=recovery') ||
  search.includes('access_token=') ||
  search.includes('type=recovery');

// Detectar si es un enlace de recuperación de Supabase
if (hasRecoveryTokens) {
  console.log('[Recovery Interceptor] ¡DETECTADO enlace de recuperación!');

  // Guardar la URL completa para procesamiento posterior
  sessionStorage.setItem('supabase_recovery_url', fullUrl);
  sessionStorage.setItem('supabase_recovery_hash', hash || search);

  // Cambiar el hash ANTES de montar React para que HashRouter lo detecte correctamente
  window.history.replaceState(null, '', window.location.origin + window.location.pathname + '#/update-password');

  console.log('[Recovery Interceptor] Hash cambiado a #/update-password, montando React...');
}

// SIEMPRE montar React - el componente UpdatePassword manejará la restauración de sesión
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