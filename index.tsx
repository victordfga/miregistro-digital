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

const hash = window.location.hash;

// Detectar si es un enlace de recuperación de Supabase
if (hash && (hash.includes('access_token=') || hash.includes('type=recovery'))) {
  console.log('[Recovery Interceptor] Detectado enlace de recuperación de Supabase');

  // Guardar el hash completo en sessionStorage para que Supabase lo procese
  sessionStorage.setItem('supabase_recovery_hash', hash);

  // Limpiar la URL y redirigir a la ruta de actualización de contraseña
  // Esto permite que HashRouter funcione correctamente
  window.location.replace(window.location.origin + window.location.pathname + '#/update-password');

  // Detener la ejecución aquí - el navegador recargará con la nueva URL
} else {
  // Flujo normal: montar la aplicación React
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
}