import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseEnvStatus {
  isConfigured: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
  missingKeys: string[];
}

const env = import.meta.env;

// Limpia y normaliza la URL de Supabase eliminando sufijos como /rest/v1
export function sanitizeSupabaseUrl(url: string): string {
  if (!url) return '';
  let clean = url.trim().replace(/\/+$/, '');
  clean = clean.replace(/\/rest\/v1\/?$/i, '');
  clean = clean.replace(/\/auth\/v1\/?$/i, '');
  return clean.replace(/\/+$/, '');
}

// Extraer credenciales de Supabase de .env o de localStorage
export function getStoredSupabaseUrl(): string {
  const fromEnv = sanitizeSupabaseUrl(env.VITE_SUPABASE_URL || '');
  const fromStorage = typeof window !== 'undefined' ? sanitizeSupabaseUrl(localStorage.getItem('deknovacore_supabase_url') || '') : '';
  return fromEnv || fromStorage || 'https://kxfolfrqvoudiosbfeyc.supabase.co';
}

export function getStoredSupabaseAnonKey(): string {
  const fromEnv = (env.VITE_SUPABASE_ANON_KEY || '').trim();
  const fromStorage = typeof window !== 'undefined' ? (localStorage.getItem('deknovacore_supabase_anon_key') || '').trim() : '';
  return fromEnv || fromStorage || 'sb_publishable_mtvP3Izfg3Wbv5YGW3D7hw_i22wL5w3';
}

export let supabaseUrl = getStoredSupabaseUrl();
export let supabaseAnonKey = getStoredSupabaseAnonKey();

/**
 * Comprueba el estado de conexión de Supabase
 */
export function checkSupabaseConfig(): SupabaseEnvStatus {
  const url = getStoredSupabaseUrl();
  const key = getStoredSupabaseAnonKey();

  const missingKeys: string[] = [];
  if (!url) missingKeys.push('VITE_SUPABASE_URL');
  if (!key) missingKeys.push('VITE_SUPABASE_ANON_KEY');

  const isConfigured = Boolean(
    url &&
    key &&
    url.startsWith('http') &&
    key.length > 15
  );

  return {
    isConfigured,
    supabaseUrl: url,
    supabaseAnonKey: key,
    missingKeys,
  };
}

export let supabaseStatus = checkSupabaseConfig();
export let isSupabaseConfigured = supabaseStatus.isConfigured;

// Cliente de Supabase inicializado de forma segura
export let supabase: SupabaseClient | null = null;

export function initializeSupabaseClient(): SupabaseClient | null {
  supabaseUrl = getStoredSupabaseUrl();
  supabaseAnonKey = getStoredSupabaseAnonKey();
  supabaseStatus = checkSupabaseConfig();
  isSupabaseConfigured = supabaseStatus.isConfigured;

  if (isSupabaseConfigured) {
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      console.info('[D. E. K NovaCore] Supabase Client inicializado exitosamente con el proyecto:', supabaseUrl);
      return supabase;
    } catch (error) {
      console.warn('[D. E. K NovaCore] Error al inicializar Supabase Client:', error);
      supabase = null;
      return null;
    }
  } else {
    supabase = null;
    return null;
  }
}

// Inicializar de inmediato si hay credenciales
initializeSupabaseClient();

export function setSupabaseCredentials(url: string, key: string): boolean {
  try {
    const cleanUrl = sanitizeSupabaseUrl(url);
    const cleanKey = key.trim();
    localStorage.setItem('deknovacore_supabase_url', cleanUrl);
    localStorage.setItem('deknovacore_supabase_anon_key', cleanKey);
    const client = initializeSupabaseClient();
    return Boolean(client);
  } catch (err) {
    console.error('Error guardando credenciales de Supabase:', err);
    return false;
  }
}

export function clearSupabaseCredentials(): void {
  localStorage.removeItem('deknovacore_supabase_url');
  localStorage.removeItem('deknovacore_supabase_anon_key');
  initializeSupabaseClient();
}

export default supabase;
