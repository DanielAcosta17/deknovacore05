import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  LayoutDashboard,
  Store,
  ChevronDown,
  ShoppingBag,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useBusiness } from '../../contexts/BusinessContext';
import { useCart } from '../../contexts/CartContext';
import { DEKLogo } from './DEKLogo';

interface NavbarProps {
  onOpenOrderModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenOrderModal }) => {
  const { theme, toggleTheme } = useTheme();
  const {
    businesses,
    activeView,
    goToLanding,
    goToAdmin,
    goToPublicStore,
    currentPublicSlug,
  } = useBusiness();
  const { totalItems, openCart } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [examplesDropdownOpen, setExamplesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const handleLogoClick = () => {
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        goToAdmin();
        return 0;
      }
      setTimeout(() => setLogoClickCount(0), 1200);
      return next;
    });
    goToLanding();
  };

  const getBusinessUrl = (biz: { websiteUrl?: string; slug: string }) => {
    if (biz.websiteUrl && biz.websiteUrl.trim()) {
      const trimmed = biz.websiteUrl.trim();
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    }
    return biz.slug.startsWith('http') ? biz.slug : `https://${biz.slug}.vercel.app`;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    if (activeView !== 'landing') {
      goToLanding();
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#05070B]/90 backdrop-blur-xl shadow-xl shadow-black/50 border-b border-blue-900/30 py-3'
          : 'bg-[#05070B]/75 backdrop-blur-md border-b border-white/[0.06] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo Branding */}
        <div
          onClick={handleLogoClick}
          title="D.E.K NovaCore (Triple clic para acceso administrativo)"
          className="cursor-pointer group select-none transition-opacity hover:opacity-95"
        >
          <DEKLogo size="sm" variant="horizontal" animated showSubtitle={true} />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-slate-300">
          <button
            onClick={() => handleNavClick('inicio')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Inicio</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavClick('servicios')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Servicios</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavClick('como-funciona')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Cómo funciona</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavClick('plantillas')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Plantillas</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavClick('precios')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Precios</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
          </button>
          <button
            onClick={() => handleNavClick('contacto')}
            className="hover:text-cyan-300 transition-colors cursor-pointer py-1 relative group"
          >
            <span>Contacto</span>
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 group-hover:w-full transition-all duration-300" />
          </button>

          {/* Quick Examples Dropdown */}
          <div className="relative">
            <button
              onClick={() => setExamplesDropdownOpen(!examplesDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#080D18] text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-sm"
            >
              <Store className="w-3.5 h-3.5 text-cyan-400" />
              <span>Ver Sitios Demo</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {examplesDropdownOpen && (
              <div
                onMouseLeave={() => setExamplesDropdownOpen(false)}
                className="absolute top-full right-0 mt-2 w-72 bg-[#080D18] rounded-xl shadow-2xl border border-blue-900/40 py-2.5 z-50 animate-fade-in backdrop-blur-xl"
              >
                <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center justify-between">
                  <span>Sitios Públicos en Vivo</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                {businesses.length === 0 ? (
                  <div className="px-3.5 py-3 text-center text-xs text-slate-400">
                    Aún no hay negocios creados. Accede al administrador para agregar tu primer catálogo.
                  </div>
                ) : (
                  <div className="mt-1 divide-y divide-white/[0.04]">
                    {businesses.map((biz, idx) => {
                      const targetUrl = getBusinessUrl(biz);
                      return (
                        <a
                          key={`${biz.id}-${idx}`}
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => setExamplesDropdownOpen(false)}
                          className="w-full text-left px-3.5 py-2.5 text-xs flex items-center justify-between gap-3 hover:bg-blue-950/40 transition-colors cursor-pointer group"
                          title={`Visitar sitio web oficial: ${targetUrl}`}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <img
                              src={biz.logoUrl}
                              alt={biz.name}
                              className="w-6 h-6 rounded-md object-cover border border-slate-700/80 shrink-0"
                            />
                            <div className="truncate">
                              <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                                {biz.name}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono truncate">
                                {biz.websiteUrl ? biz.websiteUrl.replace(/^https?:\/\//i, '') : `${biz.slug}.vercel.app`}
                              </div>
                            </div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Cambiar tema claro u oscuro"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-300" />}
          </button>

          {/* Cart Icon (if visiting a store or has items) */}
          {(activeView === 'public_store' || totalItems > 0) && (
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl bg-[#080D18] text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
              title="Abrir Carrito"
            >
              <ShoppingBag className="w-4 h-4 text-cyan-400" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 text-slate-950 text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </button>
          )}

          {/* Primary CTA "Hacer Pedido para tu Negocio" */}
          <button
            onClick={() => {
              if (onOpenOrderModal) {
                onOpenOrderModal();
              }
            }}
            className="btn-sheen px-4 py-2 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
            <span className="hidden sm:inline">Hacer Pedido para mi Negocio</span>
            <span className="sm:hidden">Hacer Pedido</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-cyan-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080D18]/95 backdrop-blur-xl border-b border-slate-800/80 px-5 py-4 space-y-3 animate-fade-in text-xs font-medium">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-white/[0.08]">
            <button
              onClick={() => handleNavClick('inicio')}
              className="p-2.5 text-left text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-white/[0.04]"
            >
              Inicio
            </button>
            <button
              onClick={() => handleNavClick('servicios')}
              className="p-2.5 text-left text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-white/[0.04]"
            >
              Servicios
            </button>
            <button
              onClick={() => handleNavClick('como-funciona')}
              className="p-2.5 text-left text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-white/[0.04]"
            >
              Cómo funciona
            </button>
            <button
              onClick={() => handleNavClick('plantillas')}
              className="p-2.5 text-left text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-white/[0.04]"
            >
              Plantillas
            </button>
            <button
              onClick={() => handleNavClick('precios')}
              className="p-2.5 text-left text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-white/[0.04]"
            >
              Precios
            </button>
            <button
              onClick={() => handleNavClick('contacto')}
              className="p-2.5 text-left text-slate-300 hover:text-cyan-300 rounded-lg hover:bg-white/[0.04]"
            >
              Contacto
            </button>
          </div>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
              Sitios Web de Clientes:
            </div>
            {businesses.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No hay negocios registrados aún.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {businesses.map((biz, idx) => {
                  const targetUrl = getBusinessUrl(biz);
                  return (
                    <a
                      key={`${biz.id}-${idx}`}
                      href={targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2.5 rounded-lg bg-[#05070B] hover:bg-blue-950/40 text-white border border-slate-800 text-left flex items-center justify-between gap-2 truncate cursor-pointer transition-colors"
                      title={`Visitar sitio web oficial: ${targetUrl}`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={biz.logoUrl} alt="" className="w-5 h-5 rounded object-cover shrink-0" />
                        <span className="truncate text-xs font-semibold">{biz.name}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                if (onOpenOrderModal) {
                  onOpenOrderModal();
                }
                setMobileMenuOpen(false);
              }}
              className="btn-sheen w-full py-3 px-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
              Hacer Pedido para mi Negocio
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

