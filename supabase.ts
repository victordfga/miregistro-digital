import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Check your .env.local file.');
}

export let supabase: any;

try {
  // Intentar inicializar el cliente de Supabase
  supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
} catch (error) {
  console.error('Supabase.ts: Error al crear el cliente:', error);
  // Cliente fallback mínimo para evitar que la aplicación se bloquee (pantalla en blanco)
  // si las credenciales en .env.local no son válidas todavía.
  supabase = {
    auth: {
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signOut: async () => { }
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null }) }) })
    })
  };
}
