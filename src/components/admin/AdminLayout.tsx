import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Palette,
  Settings,
  ChevronDown,
  ExternalLink,
  QrCode,
  Sun,
  Moon,
  LogOut,
  Menu,
  X,
  ArrowLeft,
  Layers,
  Globe,
  ShoppingBag,
  Database,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AdminDashboardView } from './AdminDashboardView';
import { BusinessManagerView } from './BusinessManagerView';
import { TemplatesGalleryView } from './TemplatesGalleryView';
import { SettingsView } from './SettingsView';
import { OrdersManagerView } from './OrdersManagerView';
import { AdminLoginView } from './AdminLoginView';
import { QRCodeModal } from '../common/QRCodeModal';
import { DEKLogo } from '../common/DEKLogo';

export const AdminLayout: React.FC = () => {
  const {
    businesses,
    selectedBusinessId,
    setSelectedBusinessId,
    activeBusiness,
    goToLanding,
    openBusinessWebsite,
    serviceRequests,
    orders,
  } = useBusiness();
  const { user, isAuthenticated, isLoading, logout, isSupabaseConnected } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isBusinessCreateTriggered, setIsBusinessCreateTriggered] = useState<boolean>(false);

  // Pantalla de carga mientras se verifica la sesión
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#05070B] flex flex-col items-center justify-center p-4 text-center text-white bg-cosmic-grid">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-sm font-bold text-white tracking-wide font-['Outfit']">
          Verificando sesión administrativa...
        </h3>
        <p className="text-xs text-cyan-400 font-mono mt-1">
          D.E.K NovaCore — Panel de Control
        </p>
      </div>
    );
  }

  // Si no está autenticado o no hay usuario, solicitar credenciales
  if (!isAuthenticated || !user) {
    return <AdminLoginView />;
  }

  const pendingRequestsCount = serviceRequests.filter((r) => r.status === 'pending').length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const totalPending = pendingRequestsCount + pendingOrdersCount;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard / Resumen', icon: LayoutDashboard },
    {
      id: 'orders',
      label: 'Pedidos y Solicitudes',
      icon: ShoppingBag,
      badge: totalPending > 0 ? totalPending : undefined,
    },
    { id: 'businesses', label: 'Mis Negocios & Sitios', icon: Building2 },
    { id: 'templates', label: 'Galería de Plantillas', icon: Palette },
    { id: 'settings', label: 'Configuración & Supabase', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 flex flex-col transition-colors selection:bg-cyan-400 selection:text-slate-950">
      {/* Top Header */}
      <header className="bg-[#080D18] border-b border-white/[0.08] sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={goToLanding}
            className="cursor-pointer flex items-center gap-2.5 select-none transition-opacity hover:opacity-95"
          >
            <DEKLogo size="xs" variant="horizontal" showSubtitle={false} />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#05070B] text-cyan-400 border border-blue-900/40 uppercase">
              Admin
            </span>
          </div>
        </div>

        {/* Center: Active Business Switcher Dropdown */}
        <div className="flex items-center gap-2">
          <span className="hidden lg:inline text-xs font-semibold text-slate-400">
            Negocio Activo:
          </span>
          <div className="relative">
            <select
              value={selectedBusinessId}
              onChange={(e) => setSelectedBusinessId(e.target.value)}
              className="text-xs font-bold py-2 pl-3 pr-8 rounded-xl bg-[#05070B] border border-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer appearance-none shadow-sm max-w-[200px] sm:max-w-xs truncate"
            >
              {businesses.map((b, idx) => (
                <option key={`${b.id}-${idx}`} value={b.id} className="bg-[#080D18] text-white">
                  {b.name} ({b.template})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {activeBusiness && (
            <button
              onClick={() => openBusinessWebsite(activeBusiness)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 text-xs font-bold rounded-xl shadow transition-all cursor-pointer font-['Outfit']"
              title={`Visitar sitio web oficial: ${activeBusiness.websiteUrl || activeBusiness.slug}`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Visitar Sitio Web</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {activeBusiness && (
            <button
              onClick={() => setIsQRModalOpen(true)}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#0B1220] rounded-xl transition-colors cursor-pointer"
              title="Código QR del sitio web"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
            </button>
          )}

          <button
            onClick={() => setActiveTab('settings')}
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#05070B] text-slate-300 border border-slate-800 text-[11px] font-semibold hover:border-cyan-500/50 cursor-pointer font-mono"
            title="Conexión Supabase PostgreSQL"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Supabase</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#0B1220] transition-colors cursor-pointer"
            title="Cambiar tema"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          <div className="h-5 w-px bg-slate-800 hidden sm:block" />

          {/* User badge & Logout */}
          <div className="flex items-center gap-1.5">
            <div className="hidden lg:flex flex-col text-right">
              <span className="text-[11px] font-bold text-white truncate max-w-[130px]">
                {user.displayName || user.email}
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold uppercase tracking-wider">
                {isSupabaseConnected ? 'Supabase Auth' : 'Admin'}
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-900/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>

            <button
              onClick={goToLanding}
              className="p-2 rounded-xl text-sky-200 hover:text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Ir a página de inicio pública"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Web</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#080D18] border-r border-white/[0.08] flex flex-col justify-between pt-16 md:pt-0 transform transition-transform duration-200 md:static md:translate-x-0 ${
            mobileSidebarOpen ? 'translate-x-0 shadow-2xl shadow-black' : '-translate-x-full'
          }`}
        >
          {/* Navigation Items */}
          <div className="p-4 space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 font-mono px-3 py-2 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Menú Principal</span>
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                      : 'bg-[#0B1220] text-slate-300 border border-slate-800/80 hover:bg-[#0f172a] hover:text-white hover:border-cyan-500/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-slate-950 text-white'
                          : 'bg-cyan-400 text-slate-950'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer: Active Business Card & Admin Profile */}
          <div className="p-4 space-y-2.5 border-t border-white/[0.08]">
            {activeBusiness && (
              <div className="p-3 rounded-xl bg-[#0B1220] border border-slate-800/80 flex items-center gap-2.5">
                <img
                  src={activeBusiness.logoUrl}
                  alt={activeBusiness.name}
                  className="w-9 h-9 rounded-lg object-cover border border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate font-['Outfit']">
                    {activeBusiness.name}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-semibold truncate font-mono">
                    /#negocio/{activeBusiness.slug}
                  </div>
                </div>
              </div>
            )}

            {/* Current user card with logout */}
            <div className="p-2.5 rounded-xl bg-[#0B1220] border border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-white truncate">
                    {user.email}
                  </div>
                  <div className="text-[9px] text-cyan-400 font-mono">
                    Administrador
                  </div>
                </div>
              </div>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </aside>

        {/* Overlay backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
          />
        )}

        {/* Dynamic Content Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <AdminDashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenCreateBusiness={() => {
                setActiveTab('businesses');
                setIsBusinessCreateTriggered(true);
              }}
              onOpenQR={() => setIsQRModalOpen(true)}
            />
          )}

          {activeTab === 'orders' && <OrdersManagerView />}

          {activeTab === 'businesses' && (
            <BusinessManagerView
              isCreateOpenInitially={isBusinessCreateTriggered}
            />
          )}

          {activeTab === 'templates' && <TemplatesGalleryView />}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* QR Modal for active business */}
      {activeBusiness && (
        <QRCodeModal
          business={activeBusiness}
          isOpen={isQRModalOpen}
          onClose={() => setIsQRModalOpen(false)}
        />
      )}
    </div>
  );
};
