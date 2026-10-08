import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  LogIn,
  Database,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ExternalLink,
  ShieldCheck,
  Settings,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBusiness } from '../../contexts/BusinessContext';
import {
  checkSupabaseConfig,
  getStoredSupabaseUrl,
  getStoredSupabaseAnonKey,
} from '../../supabase/client';
import { DEKLogo } from '../common/DEKLogo';

export const AdminLoginView: React.FC = () => {
  const { login, resetPassword, isSupabaseConnected, updateSupabaseConnection } = useAuth();
  const { goToLanding } = useBusiness();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [mode, setMode] = useState<'login' | 'forgot'>('login');

  // Estado para la configuración de Supabase (si aún no está configurado o si desea cambiarlo)
  const currentConfig = checkSupabaseConfig();
  const [showConfigPanel, setShowConfigPanel] = useState<boolean>(!currentConfig.isConfigured);
  const [supabaseUrlInput, setSupabaseUrlInput] = useState<string>(getStoredSupabaseUrl());
  const [supabaseKeyInput, setSupabaseKeyInput] = useState<string>(getStoredSupabaseAnonKey());
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUrl = supabaseUrlInput.trim();
    const cleanKey = supabaseKeyInput.trim();

    if (!cleanUrl || !cleanKey) {
      setErrorMessage('Por favor ingresa tanto el Project URL como el Anon Key de tu proyecto de Supabase.');
      return;
    }

    if (!cleanUrl.startsWith('http')) {
      setErrorMessage('El Project URL debe comenzar con https:// (ejemplo: https://xyz.supabase.co).');
      return;
    }

    const success = updateSupabaseConnection(cleanUrl, cleanKey);
    if (success) {
      setConfigSuccessMsg('¡Proyecto de Supabase conectado con éxito! Ahora ingresa con el usuario que creaste en Authentication.');
      setShowConfigPanel(false);
      setTimeout(() => setConfigSuccessMsg(null), 5000);
    } else {
      setErrorMessage('No se pudo inicializar el cliente de Supabase con los datos proporcionados.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!isSupabaseConnected) {
      setErrorMessage(
        'Primero debes ingresar tu Project URL y Anon Key de Supabase para poder autenticarte con tu usuario.'
      );
      setShowConfigPanel(true);
      return;
    }

    if (!email.trim() || !password) {
      setErrorMessage('Por favor ingresa tu correo y contraseña registrados en Supabase Authentication.');
      return;
    }

    setLoading(true);

    if (mode === 'forgot') {
      const res = await resetPassword(email);
      setLoading(false);
      if (res.success) {
        setSuccessMessage(res.message || 'Se ha enviado un correo con instrucciones de restablecimiento.');
      } else {
        setErrorMessage(res.error || 'Error al solicitar restablecimiento de contraseña.');
      }
      return;
    }

    // Login estricto contra Supabase Authentication
    const res = await login(email, password);
    setLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Error al iniciar sesión con Supabase.');
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden selection:bg-cyan-400 selection:text-slate-950 bg-cosmic-grid">
      {/* Glows decorativos */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 ambient-glow-blue rounded-full blur-3xl pointer-events-none opacity-40" />

      {/* Botón Volver al Sitio */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={goToLanding}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#080D18] hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur transition-all cursor-pointer shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Volver al Sitio</span>
        </button>
      </div>

      {/* Indicador de estado de Supabase arriba a la derecha */}
      <div className="absolute top-6 right-6 z-20">
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold backdrop-blur ${
            isSupabaseConnected
              ? 'bg-[#080D18] border-emerald-500/40 text-emerald-300'
              : 'bg-[#080D18] border-amber-500/40 text-amber-300'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          <Database className="w-3.5 h-3.5" />
          <span className="hidden sm:inline font-mono">
            {isSupabaseConnected ? 'Supabase Conectado' : 'Requiere URL de Supabase'}
          </span>
        </div>
      </div>

      {/* Tarjeta de Acceso Seguro */}
      <div className="w-full max-w-md bg-[#080D18] border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative z-10 my-8 shadow-black/80">
        {/* Cabecera */}
        <div className="text-center space-y-3 mb-6">
          <div className="flex justify-center mb-2">
            <DEKLogo size="md" variant="symbol" animated={true} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-['Outfit']">
            Panel de Administrador
          </h2>
          <p className="text-xs text-slate-400">
            Acceso exclusivo mediante usuario de Supabase Authentication
          </p>
        </div>

        {/* Panel de Conexión de Supabase (si no está configurado o si se expande) */}
        {showConfigPanel ? (
          <form
            onSubmit={handleSaveSupabaseConfig}
            className="mb-6 p-4 rounded-2xl bg-[#0f1722] border border-sky-500/40 space-y-3.5 text-xs animate-fade-in"
          >
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Database className="w-4 h-4 text-sky-400" />
                Conectar tu Proyecto de Supabase
              </span>
              {isSupabaseConnected && (
                <button
                  type="button"
                  onClick={() => setShowConfigPanel(false)}
                  className="text-[11px] text-slate-400 hover:text-white"
                >
                  Cerrar
                </button>
              )}
            </div>

            <p className="text-[11px] text-sky-200 leading-relaxed">
              Para que la app consulte el usuario que creaste en tu Authentication, ingresa los datos de tu proyecto (los encuentras en Supabase &gt; <strong>Project Settings &gt; API</strong>):
            </p>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Project URL:
              </label>
              <input
                type="url"
                required
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrlInput}
                onChange={(e) => setSupabaseUrlInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#16222f] border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Anon / Public API Key:
              </label>
              <textarea
                rows={2}
                required
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKeyInput}
                onChange={(e) => setSupabaseKeyInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#16222f] border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 font-mono text-[11px]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow transition-all cursor-pointer"
            >
              Guardar y Conectar Supabase
            </button>
          </form>
        ) : (
          <div className="mb-4 flex items-center justify-between px-3 py-2 rounded-xl bg-[#0f1722] border border-slate-700 text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> Supabase conectado
            </span>
            <button
              type="button"
              onClick={() => setShowConfigPanel(true)}
              className="text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer font-semibold"
            >
              <Settings className="w-3 h-3" /> Configuración
            </button>
          </div>
        )}

        {configSuccessMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 flex items-start gap-2 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{configSuccessMsg}</span>
          </div>
        )}

        {/* Formulario de Login Único y Estricto */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-sky-200 font-semibold mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              Correo Electrónico (Registrado en Authentication):
            </label>
            <input
              type="email"
              required
              placeholder="tu-correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1722] border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block text-sky-200 font-semibold mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-sky-400" />
                Contraseña:
              </span>
              {mode === 'login' && isSupabaseConnected && (
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-sky-400 hover:text-sky-300 cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f1722] border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 flex items-start gap-2 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs"
          >
            {loading ? (
              <span>Verificando credenciales en Supabase...</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Ingresar al Panel de Control</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Enviar Enlace de Recuperación</span>
              </>
            )}
          </button>

          {mode === 'forgot' && (
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-sky-400 hover:text-sky-300 font-semibold cursor-pointer"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          )}
        </form>

        <div className="mt-6 pt-4 border-t border-slate-700/80 text-center">
          <p className="text-[11px] text-slate-400">
            Solo los usuarios creados en tu sección <strong className="text-white">Authentication &gt; Users</strong> de Supabase pueden acceder a este panel.
          </p>
        </div>
      </div>
    </div>
  );
};
