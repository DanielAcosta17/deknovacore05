import React from 'react';
import {
  Sparkles,
  MessageCircle,
  Mail,
  MapPin,
  Heart,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Code2,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { DEKLogo } from './DEKLogo';

interface FooterProps {
  onOpenOrderModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrderModal }) => {
  const { businesses, goToLanding, goToAdmin } = useBusiness();

  const businessTypes = [
    'Pastelerías',
    'Restaurantes',
    'Tiendas de ropa',
    'Ferreterías',
    'Barberías',
    'Salones de belleza',
    'Tiendas de accesorios',
    'Supermercados',
    'Emprendimientos',
    'Tiendas de tecnología',
    'Cafeterías',
    'Negocios de comida',
    'Tiendas de regalos',
  ];

  return (
    <footer className="bg-[#05070B] text-slate-300 border-t border-white/[0.08] transition-colors relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/3 w-96 h-96 ambient-glow-blue rounded-full pointer-events-none blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-5">
            <div
              onClick={goToLanding}
              className="cursor-pointer inline-block group select-none transition-opacity hover:opacity-95"
            >
              <DEKLogo size="md" variant="horizontal" animated={true} showSubtitle={true} />
            </div>

            <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-sm">
              Potenciamos pequeños y medianos negocios con catálogos digitales interactivos, menús con código QR y sitios web profesionales preparados para vender directamente por WhatsApp.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-[11px] text-slate-300">
              <span className="inline-flex items-center gap-1.5 bg-[#080D18] px-3 py-1.5 rounded-lg border border-slate-800/80 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Supabase PostgreSQL
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#080D18] px-3 py-1.5 rounded-lg border border-slate-800/80 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp Orders
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#080D18] px-3 py-1.5 rounded-lg border border-slate-800/80 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> QR Integrado
              </span>
            </div>
          </div>

          {/* Col 2: Negocios de Ejemplo */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-cyan-400">
              Portafolio de Sitios Web
            </h4>
            {businesses.length === 0 ? (
              <p className="text-slate-500 italic">Próximamente catálogos en vivo.</p>
            ) : (
              <ul className="space-y-2.5">
                {businesses.map((b, idx) => {
                  const targetUrl = b.websiteUrl && b.websiteUrl.trim()
                    ? (b.websiteUrl.startsWith('http') ? b.websiteUrl.trim() : `https://${b.websiteUrl.trim()}`)
                    : (b.slug.startsWith('http') ? b.slug : `https://${b.slug}.vercel.app`);

                  return (
                    <li key={`${b.id}-${idx}`}>
                      <a
                        href={targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 text-slate-300 hover:underline cursor-pointer group"
                        title={`Visitar sitio web oficial: ${targetUrl}`}
                      >
                        <span className="group-hover:translate-x-0.5 transition-transform">{b.name}</span>
                        <ExternalLink className="w-3 h-3 text-cyan-400 opacity-70 group-hover:opacity-100" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Col 3: Rubros Adaptables */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-cyan-400">
              Sectores que Atendemos
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {businessTypes.slice(0, 9).map((type) => (
                <span
                  key={type}
                  className="px-2.5 py-1 rounded-md bg-[#080D18] text-slate-300 border border-slate-800/80 text-[11px]"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Col 4: Plataforma & Soporte */}
          <div className="space-y-3.5 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] font-mono text-cyan-400">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-slate-300">
              <li>
                <button
                  onClick={() => onOpenOrderModal && onOpenOrderModal()}
                  className="hover:text-cyan-300 transition-colors font-bold text-cyan-400 flex items-center gap-1.5 cursor-pointer font-['Outfit']"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-current" /> Hacer Pedido para mi Negocio
                </button>
              </li>
              <li>
                <a
                  href="#servicios"
                  className="hover:text-cyan-300 transition-colors block"
                >
                  Servicios y Catálogos
                </a>
              </li>
              <li>
                <a
                  href="#como-funciona"
                  className="hover:text-cyan-300 transition-colors block"
                >
                  Cómo funciona el flujo
                </a>
              </li>
              <li>
                <a
                  href="#plantillas"
                  className="hover:text-cyan-300 transition-colors block"
                >
                  Galería de Plantillas
                </a>
              </li>
              <li>
                <a
                  href="#precios"
                  className="hover:text-cyan-300 transition-colors block"
                >
                  Planes y Tarifas
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/50760244779?text=Hola%20D.%20E.%20K%20NovaCore,%20quiero%20hacer%20un%20pedido%20para%20mi%20negocio"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 text-emerald-400"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp Directo (+507 6024-4779)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()}</span>
            <span className="font-bold text-slate-300 font-['Outfit']">D.E.K NovaCore</span>
            <span>· Todos los derechos reservados.</span>
            {/* Acceso Oculto al Panel Admin */}
            <span
              onClick={goToAdmin}
              title="Acceso de Gestión (Ctrl+Shift+A)"
              className="ml-1 opacity-20 hover:opacity-100 cursor-pointer text-slate-500 hover:text-cyan-400 select-none text-[10px] transition-opacity"
            >
              ●
            </span>
          </div>
          <div className="text-[11px] text-cyan-400/90 font-mono tracking-wider">
            TU NEGOCIO EN EL MUNDO DIGITAL
          </div>
        </div>
      </div>
    </footer>
  );
};
