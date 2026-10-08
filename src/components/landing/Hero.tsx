import React, { useState } from 'react';
import { motion, type Variants } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Store,
  CheckCircle2,
  ExternalLink,
  Zap,
  Globe,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Business } from '../../types';
import { DEKLogo } from '../common/DEKLogo';
import heroShowcaseSrc from '../../assets/images/dek_hero_showcase_1791426332013.jpg';

interface HeroProps {
  onOpenOrderModal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenOrderModal }) => {
  const { businesses } = useBusiness();
  const [showcaseError, setShowcaseError] = useState(false);

  const handleScrollToExamples = () => {
    const el = document.getElementById('ejemplos-en-vivo');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const getTargetUrl = (biz: Business) => {
    if (biz.websiteUrl && biz.websiteUrl.trim()) {
      const trimmed = biz.websiteUrl.trim();
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    }
    return biz.slug.startsWith('http') ? biz.slug : `https://${biz.slug}.vercel.app`;
  };

  const publicShowcaseFallback = '/images/dek_hero_showcase.jpg';

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="inicio" className="relative overflow-hidden pt-8 pb-20 lg:pt-16 lg:pb-28 bg-[#05070B] bg-cosmic-grid">
      {/* Background ambient lighting - controlled and elegant */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] ambient-glow-blue rounded-full pointer-events-none blur-3xl opacity-60" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] ambient-glow-cyan rounded-full pointer-events-none blur-2xl opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* 1. Top Eyebrow Tag with Subtle Glow */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#080D18]/90 border border-blue-900/40 shadow-lg shadow-black/40 text-xs font-medium text-slate-300 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
              <span className="text-white font-bold font-['Outfit']">D.E.K NovaCore</span>
              <span className="text-slate-600">·</span>
              <span className="text-cyan-300">Desarrollo Web & Catálogos Digitales</span>
            </div>
          </motion.div>

          {/* 2. Central Logo & Brand Stature */}
          <motion.div variants={itemVariants} className="mt-8 flex justify-center">
            <DEKLogo size="lg" variant="full" animated={true} showSubtitle={true} />
          </motion.div>

          {/* 3. Main Headline */}
          <motion.div variants={itemVariants} className="text-center mt-8 max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] font-['Outfit']">
              Tu negocio merece{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400 drop-shadow-sm">
                estar en Internet
              </span>
            </h1>

            {/* 4. Descriptive Subtitle */}
            <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
              Diseñamos catálogos digitales interactivos, menús con código QR y sitios web profesionales adaptados a la identidad visual de tu marca. Vende más rápido con pedidos directos a tu WhatsApp.
            </p>

            {/* 5. Action CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  if (onOpenOrderModal) {
                    onOpenOrderModal();
                  }
                }}
                className="btn-sheen w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 text-sm font-black rounded-xl shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer font-['Outfit'] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-current" />
                <span>Hacer Pedido para mi Negocio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={handleScrollToExamples}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#080D18] text-slate-300 hover:text-white hover:bg-[#0B1220] border border-slate-800 hover:border-cyan-500/50 text-sm font-semibold rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer glass-surface-hover active:scale-[0.98]"
              >
                <Store className="w-4 h-4 text-cyan-400" />
                <span>Ver ejemplos en vivo</span>
              </button>
            </div>

            {/* 6. Quick Trust Metrics */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Sin comisiones por ventas
              </span>
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Pedidos directos a WhatsApp
              </span>
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Código QR incluido
              </span>
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" /> Base de datos PostgreSQL
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* 7. Visual Showcase Viewport */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 max-w-5xl mx-auto relative"
        >
          <div className="relative rounded-2xl p-1 bg-gradient-to-b from-blue-500/30 via-slate-800/40 to-cyan-500/20 shadow-2xl shadow-black/80">
            <div className="relative rounded-xl overflow-hidden bg-[#080D18] border border-white/[0.08]">
              {/* Browser/Device Top Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-[#05070B] border-b border-white/[0.06] text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                  <span className="text-[11px] font-mono text-slate-500 ml-2">deknovacore.com · live-catalog</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-cyan-400 font-mono">
                  <span>SSL SECURE</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </div>

              {/* Showcase Banner Asset */}
              <div className="relative aspect-[16/9] w-full overflow-hidden group bg-gradient-to-br from-[#080D18] to-[#05070B]">
                <img
                  src={showcaseError ? publicShowcaseFallback : heroShowcaseSrc}
                  alt="D.E.K NovaCore Showcase de Sitios Web y Catálogos"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700"
                  onError={() => setShowcaseError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-80" />

                {/* Floating highlights over image */}
                <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-[#080D18]/90 backdrop-blur-md border border-white/[0.08]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 text-cyan-400 flex items-center justify-center shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white font-['Outfit']">
                        Plataforma Rápida, Fluida y Personalizada
                      </div>
                      <div className="text-[10px] sm:text-xs text-slate-400">
                        Sitios Web modernos diseñados para convertir visitas en ventas inmediatas
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onOpenOrderModal && onOpenOrderModal()}
                    className="px-3.5 py-1.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-lg shadow transition-all cursor-pointer font-['Outfit'] active:scale-95"
                  >
                    Cotizar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 8. Portfolio Section */}
        <div id="ejemplos-en-vivo" className="mt-20 lg:mt-24 scroll-mt-24">
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
              Portafolio de Sitios Web Creados
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 font-['Outfit']">
              Explora los sitios web en vivo de nuestros clientes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl mx-auto">
              Haz clic en cualquier negocio para ser redirigido directamente a su sitio web oficial.
            </p>
          </div>

          {businesses.length === 0 ? (
            <div className="max-w-xl mx-auto p-8 rounded-2xl bg-[#080D18] border border-slate-800 shadow-xl text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-950/60 border border-blue-800/40 text-cyan-400 flex items-center justify-center shadow-inner">
                <Store className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-white font-['Outfit']">
                  Próximamente Proyectos y Negocios Destacados
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  Aquí se mostrarán los catálogos y sitios web oficiales de nuestros clientes y ejemplos en vivo una vez publicados desde el panel de administración.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {businesses.map((biz, idx) => {
                const targetUrl = getTargetUrl(biz);
                const displayHost = (biz.websiteUrl || `${biz.slug}.vercel.app`)
                  .replace(/^https?:\/\//i, '')
                  .replace(/\/.*$/, '');

                return (
                  <motion.a
                    key={`${biz.id}-${idx}`}
                    href={targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="group cursor-pointer bg-[#080D18] rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all flex flex-col no-underline text-inherit"
                    title={`Visitar sitio web oficial de ${biz.name}: ${targetUrl}`}
                  >
                    {/* Cover image header */}
                    <div className="relative h-44 overflow-hidden bg-slate-900">
                      <img
                        src={biz.coverUrl}
                        alt={biz.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080D18] via-black/30 to-transparent" />

                      {/* Template Badge */}
                      <div className="absolute top-3 left-3">
                        <span
                          className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide rounded-md text-white shadow"
                          style={{ backgroundColor: biz.primaryColor }}
                        >
                          {biz.template === 'restaurant'
                            ? 'Restaurante'
                            : biz.template === 'bakery'
                            ? 'Pastelería'
                            : biz.template === 'fashion'
                            ? 'Tienda de Ropa'
                            : biz.template === 'hardware'
                            ? 'Ferretería'
                            : 'Comercio'}
                        </span>
                      </div>

                      {/* Logo Avatar Floating */}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2.5">
                        <img
                          src={biz.logoUrl}
                          alt={biz.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-md bg-[#05070B]"
                          onError={(e) => {
                            e.currentTarget.src = '/images/dek_logo_emblem.jpg';
                          }}
                        />
                        <div className="text-white">
                          <div className="text-xs font-bold leading-tight drop-shadow truncate max-w-[170px] font-['Outfit']">
                            {biz.name}
                          </div>
                          <div className="text-[10px] text-slate-300 truncate max-w-[170px]">
                            {biz.address}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body description */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-normal">
                        {biz.description}
                      </p>

                      {/* Highlights & View Button */}
                      <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-cyan-400 truncate max-w-[130px] font-mono">
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{displayHost}</span>
                        </div>

                        <span className="text-xs font-bold text-slate-300 group-hover:text-cyan-300 flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-all">
                          <span>Visitar</span>
                          <ExternalLink className="w-3 h-3 text-cyan-400" />
                        </span>
                      </div>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
