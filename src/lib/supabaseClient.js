// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

/**
 * 🔐 Cliente Supabase para ARKAI LXP
 * Configurado para Horizon (SSR-safe) + persistencia local + refresh automático.
 */

// URL y ANON KEY del proyecto
const supabaseUrl =
  import.meta?.env?.VITE_SUPABASE_URL ||
  'https://uzviszqevkddoszrxwen.supabase.co';

const supabaseAnonKey =
  import.meta?.env?.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6dmlzenFldmtkZG9zenJ4d2VuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTU0OTAsImV4cCI6MjA3NjIzMTQ5MH0.2PJ8AyaV7fqDUbcEVF3z_fLGUI-1wBKHwuy9n9cWQoY';

// Aviso si faltan variables (sin romper el build)
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Variables VITE_SUPABASE_* no detectadas. Usando valores de fallback.');
}

// Evitar reinicialización durante hot reload (modo dev)
const KEY = '__arkai_supabase__';
if (typeof window !== 'undefined' && !window[KEY]) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ CRITICAL: Falta URL o Anon Key de Supabase. La app no puede continuar.');
  } else {
    window[KEY] = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: localStorage, // Fuerza almacenamiento persistente local
      },
    });

    console.log('✅ Supabase Client inicializado correctamente.');
  }
}

// Exportar cliente único
export const supabase = typeof window !== 'undefined' ? window[KEY] : null;
export default supabase;

// --- Diagnóstico opcional (solo dev) ---
if (import.meta.env.MODE !== 'production') {
  console.groupCollapsed('🔍 Supabase Diagnostics');
  console.log('🌐 URL:', supabaseUrl);
  console.log('🔑 ANON Key:', supabaseAnonKey ? '✅ OK' : '❌ Missing');
  console.log('🧠 persistSession:', true);
  console.log('♻️ autoRefreshToken:', true);
  console.log('🔎 detectSessionInUrl:', true);
  console.log('📦 storage:', 'localStorage');
  console.groupEnd();
}