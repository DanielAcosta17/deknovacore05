import React, { useState } from 'react';
import {
  Database,
  ShieldCheck,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  CheckCircle2,
  CloudUpload,
  Store,
  DollarSign,
  Phone,
  Truck,
  Clock,
  Megaphone,
  Trash2,
  Code2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { supabaseStatus, isSupabaseConfigured } from '../../supabase/client';
import { useBusiness } from '../../contexts/BusinessContext';

export const SettingsView: React.FC = () => {
  const {
    activeBusiness,
    updateBusiness,
    purgeAllData,
    syncAllToSupabase,
    lastSupabaseSyncTime,
    appSettings,
    updateAppSettings,
  } = useBusiness();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [resetDone, setResetDone] = useState(false);
  const [isPurging, setIsPurging] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Business settings state
  const [currency, setCurrency] = useState(activeBusiness?.currency || '$');
  const [whatsapp, setWhatsapp] = useState(activeBusiness?.whatsapp || '');
  const [deliveryCost, setDeliveryCost] = useState(activeBusiness?.deliveryCost?.toString() || '0');
  const [deliveryAvailable, setDeliveryAvailable] = useState(activeBusiness?.deliveryAvailable ?? true);
  const [schedule, setSchedule] = useState(activeBusiness?.schedule || '');
  const [featuredNotice, setFeaturedNotice] = useState(activeBusiness?.featuredNotice || '');
  const [isSavingBiz, setIsSavingBiz] = useState(false);
  const [saveBizFeedback, setSaveBizFeedback] = useState<string | null>(null);

  // Global platform settings state
  const [ownerWhatsApp, setOwnerWhatsApp] = useState(appSettings?.ownerWhatsApp || '50760244779');
  const [platformName, setPlatformName] = useState(appSettings?.platformName || 'D. E. K NovaCore');
  const [isSavingGlobal, setIsSavingGlobal] = useState(false);
  const [saveGlobalFeedback, setSaveGlobalFeedback] = useState<string | null>(null);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'business' | 'global' | 'supabase'>('business');

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(label);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncAllToSupabase();
      setSyncFeedback(res.message);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 6000);
    }
  };

  const handleSaveBizSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBusiness) return;
    setIsSavingBiz(true);
    try {
      await updateBusiness({
        ...activeBusiness,
        currency,
        whatsapp,
        deliveryCost: parseFloat(deliveryCost) || 0,
        deliveryAvailable,
        schedule,
        featuredNotice,
      });
      setSaveBizFeedback('Configuración del negocio guardada exitosamente.');
      setTimeout(() => setSaveBizFeedback(null), 4000);
    } finally {
      setIsSavingBiz(false);
    }
  };

  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGlobal(true);
    try {
      await updateAppSettings({
        ownerWhatsApp: ownerWhatsApp.trim(),
        platformName: platformName.trim(),
      });
      setSaveGlobalFeedback('Configuración general y número de WhatsApp de pedidos guardados.');
      setTimeout(() => setSaveGlobalFeedback(null), 4000);
    } finally {
      setIsSavingGlobal(false);
    }
  };

  const handleConfirmReset = async () => {
    setIsPurging(true);
    try {
      await purgeAllData();
      setIsResetModalOpen(false);
      setResetDone(true);
      setTimeout(() => setResetDone(false), 4000);
    } finally {
      setIsPurging(false);
    }
  };

  const envTemplate = `# Variables de entorno para Supabase (en archivo .env)
VITE_SUPABASE_URL="${supabaseStatus.supabaseUrl || 'https://tu-proyecto-id.supabase.co'}"
VITE_SUPABASE_ANON_KEY="${supabaseStatus.supabaseAnonKey || 'tu-anon-key-aqui'}"
VITE_OWNER_WHATSAPP="${ownerWhatsApp}"`;

  const sqlQuickCopy = `-- Ejecuta este script en Supabase SQL Editor:
-- Archivo completo disponible en /supabase-schema.sql
-- 1. Visita: https://supabase.com/dashboard/project/_/sql
-- 2. Pega el contenido de supabase-schema.sql y presiona RUN.`;

  return (
    <div className="space-y-6 max-w-4xl text-xs">
      <div>
        <h2 className="text-xl font-bold text-white">
          Configuración del Sistema & Supabase
        </h2>
        <p className="text-sky-200 mt-0.5">
          Gestiona los números de recepción de pedidos, parámetros comerciales y la base de datos PostgreSQL en Supabase.
        </p>
      </div>

      {/* Selector de pestañas */}
      <div className="flex border-b border-slate-700 bg-[#16222f] p-1.5 rounded-2xl gap-2">
        <button
          onClick={() => setActiveTab('business')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'business'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'text-sky-200 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Negocio Actual ({activeBusiness?.name || 'Selecciona'})</span>
        </button>

        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'global'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'text-sky-200 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Recepción de Pedidos (Mi Número)</span>
        </button>

        <button
          onClick={() => setActiveTab('supabase')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'supabase'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'text-sky-200 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Base de Datos Supabase (SQL)</span>
        </button>
      </div>

      {/* PESTAÑA 1: Negocio Actual */}
      {activeTab === 'business' && activeBusiness && (
        <form
          onSubmit={handleSaveBizSettings}
          className="bg-[#16222f] dark:bg-[#111a24] border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-5"
        >
          <div className="border-b border-slate-700/80 pb-3">
            <h3 className="font-bold text-sm text-white">
              Parámetros de {activeBusiness.name}
            </h3>
            <p className="text-[11px] text-sky-200">
              Personaliza la moneda, costo de envío y número para pedidos de esta tienda específica.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-sky-200 mb-1 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-sky-400" /> Símbolo de Moneda:
              </label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                placeholder="$, USD, B/., €"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-[#0f1722] text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block font-bold text-sky-200 mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-sky-400" /> WhatsApp para Pedidos de esta Tienda:
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="Ej: +507 6024-4779"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-[#0f1722] text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block font-bold text-sky-200 mb-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-sky-400" /> Costo Fijo de Envío ({currency}):
              </label>
              <input
                type="number"
                step="0.01"
                value={deliveryCost}
                onChange={(e) => setDeliveryCost(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-[#0f1722] text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              <input
                type="checkbox"
                id="deliv"
                checked={deliveryAvailable}
                onChange={(e) => setDeliveryAvailable(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 bg-slate-900 border-slate-700 focus:ring-sky-400 cursor-pointer"
              />
              <label htmlFor="deliv" className="font-bold text-white text-xs cursor-pointer">
                Habilitar opción de entrega a domicilio (Delivery)
              </label>
            </div>
          </div>

          <div>
            <label className="block font-bold text-sky-200 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> Horario de Atención:
            </label>
            <input
              type="text"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
              placeholder="Ej: Lunes a Sábado: 8:00 AM - 7:00 PM"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-[#0f1722] text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>

          <div>
            <label className="block font-bold text-sky-200 mb-1 flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-sky-400" /> Aviso Destacado o Promoción:
            </label>
            <input
              type="text"
              value={featuredNotice}
              onChange={(e) => setFeaturedNotice(e.target.value)}
              placeholder="Ej: 🚀 ¡Envíos gratis por compras superiores a $30!"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-[#0f1722] text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
            />
          </div>

          {saveBizFeedback && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveBizFeedback}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingBiz}
              className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSavingBiz ? 'Guardando...' : 'Guardar Cambios del Negocio'}
            </button>
          </div>
        </form>
      )}

      {/* PESTAÑA 2: Configuración Global (Recepción de Pedidos de Clientes) */}
      {activeTab === 'global' && (
        <form
          onSubmit={handleSaveGlobalSettings}
          className="bg-[#16222f] dark:bg-[#111a24] border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-5"
        >
          <div className="border-b border-slate-700/80 pb-3">
            <h3 className="font-bold text-sm text-white">
              Número de WhatsApp para Recepción de Pedidos
            </h3>
            <p className="text-[11px] text-sky-200">
              Aquí configuras tu número personal o de ventas al cual te llegarán todos los pedidos que los clientes hagan cuando soliciten un catálogo para su negocio.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-bold text-sky-200 mb-1 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-emerald-400" />
                Mi Número de WhatsApp (Con código de país, sin espacios ni signos):
              </label>
              <input
                type="text"
                required
                value={ownerWhatsApp}
                onChange={(e) => setOwnerWhatsApp(e.target.value)}
                placeholder="Ej: 50760244779"
                className="w-full px-3.5 py-2.5 text-xs font-mono font-bold rounded-xl border border-slate-700 bg-[#0f1722] text-emerald-300 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Ejemplo para Panamá: <span className="text-sky-300 font-mono">50760244779</span>. Cuando un cliente presione &quot;Hacer Pedido para mi Negocio&quot;, el mensaje se dirigirá automáticamente a este número.
              </p>
            </div>

            <div>
              <label className="block font-bold text-sky-200 mb-1 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-sky-400" />
                Nombre de la Plataforma:
              </label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                placeholder="D. E. K NovaCore"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700 bg-[#0f1722] text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
              />
            </div>
          </div>

          {saveGlobalFeedback && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 rounded-xl font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveGlobalFeedback}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingGlobal}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isSavingGlobal ? 'Guardando...' : 'Guardar Mi Número para Pedidos'}
            </button>
          </div>
        </form>
      )}

      {/* PESTAÑA 3: Supabase PostgreSQL & SQL Script */}
      {activeTab === 'supabase' && (
        <div className="space-y-5">
          {/* Estado de Supabase */}
          <div className="bg-[#16222f] dark:bg-[#111a24] border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
                    isSupabaseConfigured
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Estado de Supabase PostgreSQL
                  </h3>
                  <p className="text-[11px] text-sky-200">
                    {isSupabaseConfigured
                      ? 'Conectado a la base de datos de Supabase.'
                      : 'Ejecutando en Modo Local-First interactivo.'}
                  </p>
                </div>
              </div>

              <div
                className={`px-3 py-1.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${
                  isSupabaseConfigured
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950 text-amber-300 border-amber-800'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{isSupabaseConfigured ? 'Supabase Activo' : 'Modo Local Listo'}</span>
              </div>
            </div>

            {/* Sincronización Manual */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-700/80">
              <div className="text-[11px] text-sky-300">
                {lastSupabaseSyncTime
                  ? `Última sincronización: ${lastSupabaseSyncTime}`
                  : 'Listo para sincronizar.'}
              </div>

              <button
                onClick={handleSyncAll}
                disabled={isSyncing}
                className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Sincronizando...' : 'Sincronizar a Supabase'}</span>
              </button>
            </div>

            {syncFeedback && (
              <div className="p-3 bg-sky-950/80 border border-sky-800 text-sky-200 rounded-xl text-xs font-semibold">
                {syncFeedback}
              </div>
            )}
          </div>

          {/* Guía Paso a Paso para Supabase */}
          <div className="bg-[#16222f] dark:bg-[#111a24] border border-slate-700/80 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">
                  Instrucciones para Ingresar en Supabase
                </h3>
                <p className="text-[11px] text-sky-200">
                  Todo lo que tienes que hacer en tu cuenta de Supabase en 3 sencillos pasos:
                </p>
              </div>

              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Abrir Supabase</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 bg-[#0f1722] rounded-xl border border-slate-700/70 space-y-1">
                <span className="font-bold text-white text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  Crear Proyecto en Supabase
                </span>
                <p className="text-[11px] text-slate-300 pl-7">
                  Inicia sesión en <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-sky-400 underline">supabase.com</a> y crea un nuevo proyecto llamado &quot;dek-novacore&quot;.
                </p>
              </div>

              <div className="p-3.5 bg-[#0f1722] rounded-xl border border-slate-700/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                      2
                    </span>
                    Ejecutar el SQL en Supabase SQL Editor
                  </span>
                  <button
                    onClick={() => {
                      copyToClipboard(sqlQuickCopy, 'sql');
                      // Leer y copiar el archivo completo
                      fetch('/supabase-schema.sql')
                        .then((res) => res.text())
                        .then((txt) => copyToClipboard(txt, 'sql'))
                        .catch(() => copyToClipboard(sqlQuickCopy, 'sql'));
                    }}
                    className="px-3 py-1 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'sql' ? '¡SQL Copiado!' : 'Copiar Archivo SQL Completo'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 pl-7">
                  Ve a la barra lateral de Supabase &gt; haz clic en el ícono de <span className="text-sky-400 font-semibold">SQL Editor</span> &gt; presiona <span className="text-sky-400 font-semibold">New Query</span> &gt; pega el script que tienes guardado en el archivo raíz <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">supabase-schema.sql</code> y haz clic en <span className="text-emerald-400 font-bold">RUN</span>.
                </p>
              </div>

              <div className="p-3.5 bg-[#0f1722] rounded-xl border border-slate-700/70 space-y-2">
                <span className="font-bold text-white text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 flex items-center justify-center text-[10px] font-black">
                    3
                  </span>
                  Configurar Variables en el archivo .env
                </span>
                <p className="text-[11px] text-slate-300 pl-7">
                  En Supabase ve a <span className="text-sky-400 font-semibold">Project Settings &gt; API</span> y copia tu URL y tu <span className="font-mono text-emerald-300">anon public key</span> en el archivo <code className="text-amber-300 bg-slate-900 px-1 py-0.5 rounded font-mono">.env</code>:
                </p>
                <div className="pl-7">
                  <pre className="p-3 bg-black/60 rounded-xl border border-slate-800 text-emerald-400 font-mono text-[11px] whitespace-pre-wrap">
                    {envTemplate}
                  </pre>
                  <button
                    onClick={() => copyToClipboard(envTemplate, 'env')}
                    className="mt-2 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copiar plantilla .env</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Zona de peligro / Limpieza */}
          <div className="bg-[#16222f] dark:bg-[#111a24] border border-rose-900/50 rounded-2xl p-6 shadow-md space-y-3">
            <h3 className="font-bold text-sm text-rose-300 flex items-center gap-2">
              <Trash2 className="w-4 h-4 text-rose-400" />
              Zona de Purga / Limpiar Base de Datos
            </h3>
            <p className="text-[11px] text-slate-300">
              Elimina todos los datos de prueba y deja la plataforma completamente en 0.
            </p>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-600/40 rounded-xl font-bold transition-all cursor-pointer"
            >
              Limpiar Base de Datos
            </button>
          </div>
        </div>
      )}

      {/* Modal de confirmación para purga */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#16222f] p-6 rounded-2xl border border-rose-800/80 max-w-sm w-full space-y-4 text-center">
            <h4 className="font-bold text-white text-base">¿Limpiar toda la plataforma?</h4>
            <p className="text-xs text-rose-200">
              Se eliminarán todos los negocios, productos, categorías y pedidos registrados.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setIsResetModalOpen(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmReset}
                disabled={isPurging}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {isPurging ? 'Limpiando...' : 'Confirmar y Limpiar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
