import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  supabase,
  isSupabaseConfigured,
  setSupabaseCredentials,
  initializeSupabaseClient,
  checkSupabaseConfig,
} from '../supabase/client';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, pass: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  logout: () => Promise<void>;
  updateSupabaseConnection: (url: string, key: string) => boolean;
}

// Traductor de mensajes de autenticación al español
export function translateSupabaseAuthError(errorMessage: string): string {
  const msg = errorMessage.toLowerCase();
  if (
    msg.includes('invalid login credentials') ||
    msg.includes('invalid credentials') ||
    msg.includes('invalid_grant')
  ) {
    return 'Correo o contraseña incorrectos en Supabase Authentication. Solo los usuarios registrados en tu proyecto pueden acceder.';
  }
  if (msg.includes('email not confirmed')) {
    return 'Tu correo electrónico no ha sido confirmado aún en Supabase. En Authentication > Users puedes marcar "Auto Confirm User" o confirmar el usuario.';
  }
  if (msg.includes('user already registered') || msg.includes('user already exists')) {
    return 'Este correo electrónico ya está registrado en tu proyecto de Supabase.';
  }
  if (msg.includes('password should be at least')) {
    return 'La contraseña debe tener al menos 6 caracteres.';
  }
  if (msg.includes('rate limit')) {
    return 'Demasiados intentos. Por favor espera unos momentos antes de reintentar.';
  }
  if (msg.includes('fetch') || msg.includes('network') || msg.includes('connection')) {
    return 'No se pudo conectar al servidor de Supabase. Verifica tu Project URL y Anon Key.';
  }
  return errorMessage || 'Error al autenticar con Supabase Authentication.';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('deknovacore_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Descartar credenciales locales anteriores para forzar solo usuarios reales de Supabase
        if (
          parsed.uid &&
          (parsed.uid.startsWith('admin-local-') || parsed.uid.startsWith('admin-dek-'))
        ) {
          localStorage.removeItem('deknovacore_auth_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(() => checkSupabaseConfig().isConfigured);

  // Escuchar cambios de sesión en Supabase Auth
  useEffect(() => {
    const client = initializeSupabaseClient();
    const config = checkSupabaseConfig();
    setIsConnected(config.isConfigured);

    if (client && config.isConfigured) {
      // Obtener sesión actual
      client.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const adminUser: AdminUser = {
            uid: session.user.id,
            email: session.user.email || '',
            displayName:
              session.user.user_metadata?.display_name ||
              session.user.email?.split('@')[0] ||
              'Administrador',
            role: 'superadmin',
          };
          setUser(adminUser);
          localStorage.setItem('deknovacore_auth_user', JSON.stringify(adminUser));
        } else {
          // Si no hay sesión válida en Supabase, limpiar
          setUser(null);
          localStorage.removeItem('deknovacore_auth_user');
        }
        setIsLoading(false);
      });

      // Suscribirse a cambios de autenticación
      const {
        data: { subscription },
      } = client.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const adminUser: AdminUser = {
            uid: session.user.id,
            email: session.user.email || '',
            displayName:
              session.user.user_metadata?.display_name ||
              session.user.email?.split('@')[0] ||
              'Administrador',
            role: 'superadmin',
          };
          setUser(adminUser);
          localStorage.setItem('deknovacore_auth_user', JSON.stringify(adminUser));
        } else {
          setUser(null);
          localStorage.removeItem('deknovacore_auth_user');
        }
        setIsLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Si Supabase no está configurado, asegurar que no haya sesiones fantasma
      setUser(null);
      localStorage.removeItem('deknovacore_auth_user');
      setIsLoading(false);
    }
  }, []);

  const updateSupabaseConnection = (url: string, key: string): boolean => {
    const success = setSupabaseCredentials(url, key);
    const config = checkSupabaseConfig();
    setIsConnected(config.isConfigured);
    return success;
  };

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const client = initializeSupabaseClient();
    const config = checkSupabaseConfig();

    if (!client || !config.isConfigured) {
      setIsLoading(false);
      return {
        success: false,
        error:
          'Supabase no está conectado todavía. Ingresa tu Project URL y Anon Key abajo para autenticarte con el usuario que creaste en Authentication.',
      };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password: pass,
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: translateSupabaseAuthError(error.message) };
      }

      if (data.user) {
        const adminUser: AdminUser = {
          uid: data.user.id,
          email: data.user.email || email.trim(),
          displayName:
            data.user.user_metadata?.display_name ||
            email.trim().split('@')[0] ||
            'Administrador',
          role: 'superadmin',
        };
        setUser(adminUser);
        localStorage.setItem('deknovacore_auth_user', JSON.stringify(adminUser));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'No se pudo obtener la sesión de usuario en Supabase.' };
    } catch (err: any) {
      setIsLoading(false);
      return {
        success: false,
        error: err.message || 'Error de conexión con Supabase Authentication.',
      };
    }
  };

  const register = async (
    email: string,
    pass: string,
    name?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    const client = initializeSupabaseClient();
    const config = checkSupabaseConfig();

    if (!client || !config.isConfigured) {
      setIsLoading(false);
      return {
        success: false,
        error:
          'Supabase no está conectado todavía. Ingresa tu Project URL y Anon Key primero.',
      };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password: pass,
        options: {
          data: {
            display_name: name?.trim() || email.trim().split('@')[0] || 'Administrador',
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { success: false, error: translateSupabaseAuthError(error.message) };
      }

      if (data.user) {
        const adminUser: AdminUser = {
          uid: data.user.id,
          email: data.user.email || email.trim(),
          displayName: name?.trim() || email.trim().split('@')[0] || 'Administrador',
          role: 'superadmin',
        };
        setUser(adminUser);
        localStorage.setItem('deknovacore_auth_user', JSON.stringify(adminUser));
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return { success: false, error: 'No se pudo registrar el usuario en Supabase.' };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Error al registrar en Supabase Auth.' };
    }
  };

  const resetPassword = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    const client = initializeSupabaseClient();
    const config = checkSupabaseConfig();

    if (!client || !config.isConfigured) {
      return {
        success: false,
        error: 'Supabase no está conectado todavía.',
      };
    }

    try {
      const { error } = await client.auth.resetPasswordForEmail(email.trim());
      if (error) {
        return { success: false, error: translateSupabaseAuthError(error.message) };
      }
      return {
        success: true,
        message: 'Se ha enviado un correo con el enlace para restablecer tu contraseña.',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Error al solicitar restablecimiento de contraseña.',
      };
    }
  };

  const logout = async () => {
    const client = initializeSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Logout error:', err);
      }
    }
    setUser(null);
    localStorage.removeItem('deknovacore_auth_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isSupabaseConnected: isConnected,
        login,
        register,
        resetPassword,
        logout,
        updateSupabaseConnection,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
