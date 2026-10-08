import React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  Check,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  MessageCircle,
  Clock,
  Layers,
  Crown,
} from 'lucide-react';

interface PricingProps {
  onSelectPlan?: (planName: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const plans = [
    {
      name: 'Plan Básico Emprendedor',
      badge: 'Ideal para iniciar',
      price: '$15',
      period: '/mes',
      subtext: 'Facturación mensual · Sin comisiones',
      description: 'Perfecto para pequeños negocios que quieren mostrar su catálogo y recibir pedidos.',
      features: [
        '1 Negocio con catálogo digital o menú QR',
        'Hasta 50 productos con fotos HD',
        'Botón directo de pedidos por WhatsApp',
        'Código QR para imprimir y compartir',
        'Panel de administración móvil y web',
        'Soporte técnico por WhatsApp',
      ],
      cta: 'Hacer Pedido de este Plan',
      popular: false,
      accentGlow: 'from-blue-600/10 via-transparent to-transparent',
    },
    {
      name: 'Plan Pro Recomendado',
      badge: 'El Más Popular',
      price: '$29',
      period: '/mes',
      subtext: 'El preferido por negocios en crecimiento',
      description: 'Para restaurantes, pastelerías y tiendas en crecimiento con alto volumen.',
      features: [
        'Hasta 3 Negocios o Sucursales',
        'Productos y categorías ilimitadas',
        'Gestión de promociones y descuentos',
        'Carrito de compras interactivo',
        'Sincronización Cloud con Supabase (PostgreSQL)',
        'Generador de QR en alta resolución',
        'Dominio amigable y SEO optimizado',
      ],
      cta: 'Hacer Pedido de este Plan',
      popular: true,
      accentGlow: 'from-cyan-500/20 via-blue-600/15 to-transparent',
    },
    {
      name: 'Plan Full Suite Empresarial',
      badge: 'Empresarial',
      price: '$49',
      period: '/mes',
      subtext: 'Máxima potencia para marcas consolidadas',
      description: 'Para negocios consolidados o franquicias que buscan máxima potencia y pedidos.',
      features: [
        'Negocios ilimitados desde 1 solo panel',
        'Historial de pedidos y métricas en tiempo real',
        'Módulo de pedidos directos a tu WhatsApp',
        'Asesoría de diseño y carga de menú inicial',
        'Base de datos PostgreSQL en Supabase',
        'Soporte prioritario VIP 24/7',
      ],
      cta: 'Hacer Pedido de este Plan',
      popular: false,
      accentGlow: 'from-blue-500/10 via-transparent to-transparent',
    },
  ];

  // Motion container variants for smooth stagger
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 32 },
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
    <section id="precios" className="py-20 lg:py-28 bg-[#05070B] relative overflow-hidden bg-cosmic-grid">
      {/* Background ambient lighting - subtle and controlled */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] ambient-glow-blue rounded-full pointer-events-none blur-3xl opacity-40" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] ambient-glow-cyan rounded-full pointer-events-none blur-3xl opacity-25" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#080D18] border border-blue-900/40 text-xs font-semibold text-cyan-400 font-mono shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>PLANES TRANSPARENTES Y ACCESIBLES</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Outfit']">
            Invierte en la digitalización de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-cyan-400">
              tu negocio
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Sin comisiones ocultas sobre tus ventas. Todo lo que vendes por WhatsApp es 100% tuyo.
            Elige el plan ideal y comienza hoy mismo.
          </p>
        </div>

        {/* Pricing Cards Grid with Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
        >
          {plans.map((p, idx) => {
            const isPopular = p.popular;

            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 group ${
                  isPopular
                    ? 'pricing-card-popular pricing-card-hover md:-translate-y-2'
                    : 'pricing-card-standard pricing-card-hover'
                }`}
              >
                {/* Popular Highlight Badge */}
                {isPopular ? (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-slate-950 text-[11px] font-black uppercase tracking-wider rounded-full shadow-lg shadow-cyan-500/25 font-['Outfit'] z-20">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <Crown className="w-3.5 h-3.5 fill-current" />
                    <span>{p.badge}</span>
                  </div>
                ) : (
                  <div className="inline-flex self-start mb-3 px-3 py-1 rounded-full bg-[#05070B] border border-white/[0.08] text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                    {p.badge}
                  </div>
                )}

                {/* Top Section: Plan Name & Description */}
                <div>
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3
                        className={`text-xl sm:text-2xl font-bold font-['Outfit'] ${
                          isPopular ? 'text-white' : 'text-slate-100 group-hover:text-white'
                        }`}
                      >
                        {p.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                      {p.description}
                    </p>
                  </div>

                  {/* Pricing Stat Display */}
                  <div className="my-6 pt-5 pb-4 border-y border-white/[0.06]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-cyan-400 font-mono">$</span>
                      <span className="text-5xl sm:text-6xl font-black text-white font-['Outfit'] tracking-tight">
                        {p.price.replace('$', '')}
                      </span>
                      <span className="text-xs sm:text-sm text-slate-400 font-mono font-medium ml-1">
                        {p.period}
                      </span>
                    </div>
                    <p className="text-[11px] text-cyan-400/90 font-mono mt-1.5 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{p.subtext}</span>
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3.5 text-xs sm:text-[13px]">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block">
                      Incluye todo esto:
                    </span>
                    {p.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-slate-300 font-normal">
                        <div
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-sm ${
                            isPopular
                              ? 'bg-cyan-500/15 border border-cyan-400/50 text-cyan-300'
                              : 'bg-[#05070B] border border-blue-900/50 text-cyan-400'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action CTA Button */}
                <div className="pt-8 mt-6 border-t border-white/[0.06]">
                  <button
                    onClick={() => onSelectPlan && onSelectPlan(p.name)}
                    className={`w-full py-4 px-5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer font-['Outfit'] group/btn ${
                      isPopular
                        ? 'btn-sheen bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 font-black shadow-xl shadow-cyan-500/25 active:scale-[0.98]'
                        : 'bg-[#05070B] hover:bg-[#080D18] text-slate-200 hover:text-white border border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98]'
                    }`}
                  >
                    <Sparkles
                      className={`w-4 h-4 ${
                        isPopular ? 'text-slate-950 fill-current' : 'text-cyan-400'
                      }`}
                    />
                    <span>{p.cta}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                  <p className="text-[10px] text-center text-slate-500 mt-2.5 font-mono">
                    Activación rápida con soporte personalizado
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Guarantees & Trust Signals Footer */}
        <div className="mt-14 pt-10 border-t border-white/[0.06] grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#080D18]/40 border border-white/[0.04]">
            <div className="w-9 h-9 rounded-xl bg-[#05070B] border border-blue-900/40 text-cyan-400 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white font-['Outfit']">0% Comisiones</span>
            <span className="text-[11px] text-slate-400">Todo lo que vendes es tuyo</span>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#080D18]/40 border border-white/[0.04]">
            <div className="w-9 h-9 rounded-xl bg-[#05070B] border border-emerald-900/40 text-emerald-400 flex items-center justify-center shadow-sm">
              <MessageCircle className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white font-['Outfit']">WhatsApp Directo</span>
            <span className="text-[11px] text-slate-400">Sin apps ni descargas extra</span>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#080D18]/40 border border-white/[0.04]">
            <div className="w-9 h-9 rounded-xl bg-[#05070B] border border-blue-900/40 text-cyan-400 flex items-center justify-center shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white font-['Outfit']">Activación Inmediata</span>
            <span className="text-[11px] text-slate-400">Listo en menos de 24 horas</span>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-[#080D18]/40 border border-white/[0.04]">
            <div className="w-9 h-9 rounded-xl bg-[#05070B] border border-cyan-900/40 text-cyan-400 flex items-center justify-center shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-white font-['Outfit']">Soporte Continuo</span>
            <span className="text-[11px] text-slate-400">Acompañamiento en cada paso</span>
          </div>
        </div>
      </div>
    </section>
  );
};
