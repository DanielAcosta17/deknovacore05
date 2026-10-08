import React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  Layers,
  UtensilsCrossed,
  Globe,
  MessageSquare,
  Sliders,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const Services: React.FC = () => {
  const services = [
    {
      icon: Layers,
      title: '1. Catálogos Digitales',
      subtitle: 'Para todo tipo de comercios y productos',
      description:
        'Muestra tus productos con fotos en alta definición, precios vigentes, promociones con descuento, descripciones detalladas, etiquetas y categorías dinámicas.',
      highlights: ['Buscador instantáneo', 'Filtros por categoría', 'Etiquetas de oferta y destacados'],
      accentColor: 'from-blue-600 to-cyan-500',
    },
    {
      icon: UtensilsCrossed,
      title: '2. Menús Digitales QR',
      subtitle: 'Restaurantes, cafeterías y gastronomía',
      description:
        'Ideal para restaurantes, cafeterías, pizzerías y gastro-negocios. Permite a los comensales escanear el QR en la mesa, elegir sus platos y ordenar directamente por WhatsApp.',
      highlights: ['Generador de código QR', 'Notas especiales de cocina', 'Sección de bebidas y postres'],
      accentColor: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Globe,
      title: '3. Sitios Web Profesionales',
      subtitle: 'Presencia digital completa y personalizada',
      description:
        'Sitios web corporativos y comerciales adaptados a la identidad visual de tu marca: paleta de colores, logotipo, portada, tipografía y dominio amigable.',
      highlights: ['100% Responsive en iPhone y Android', 'Optimizado para SEO y Google', 'Carga ultra rápida'],
      accentColor: 'from-blue-500 to-indigo-500',
    },
    {
      icon: MessageSquare,
      title: '4. Contacto & WhatsApp Directo',
      subtitle: 'Conexión inmediata con tus clientes',
      description:
        'Botones de contacto estratégicos: WhatsApp oficial con pedido pre-armado, llamadas directas, enlaces a Instagram, Facebook, TikTok y horarios de atención.',
      highlights: ['Mensaje de pedido pre-formateado', 'Sin intermediarios ni comisiones', 'Geolocalización'],
      accentColor: 'from-emerald-500 to-cyan-400',
    },
    {
      icon: Sliders,
      title: '5. Gestión Sencilla e Intuitiva',
      subtitle: 'Tú tienes el control total de tu catálogo',
      description:
        'Panel administrativo intuitivo para actualizar precios, activar o pausar productos agotados, subir fotos desde tu teléfono y gestionar categorías en segundos sin saber programar.',
      highlights: ['Editor sin código', 'Subida de fotos con 1 clic', 'Reporte de pedidos recibidos'],
      accentColor: 'from-cyan-400 to-blue-600',
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
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
    <section id="servicios" className="py-20 lg:py-28 bg-[#080D18] border-y border-white/[0.06] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -right-40 w-96 h-96 ambient-glow-blue rounded-full pointer-events-none blur-3xl opacity-50" />
      <div className="absolute bottom-0 -left-40 w-96 h-96 ambient-glow-cyan rounded-full pointer-events-none blur-3xl opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            Nuestros Servicios Principales
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
            Todo lo que tu negocio necesita para triunfar en la era digital
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Diseñamos soluciones directas, rápidas y efectivas que convierten visitantes en clientes recurrentes.
          </p>
        </div>

        {/* Bento Grid with Motion Stagger */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className={`p-7 bg-[#05070B] rounded-2xl border border-slate-800/80 shadow-xl hover:border-cyan-500/40 hover:shadow-cyan-500/10 transition-all flex flex-col justify-between group ${
                  idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  {/* Icon badge with gradient border */}
                  <div className="w-12 h-12 rounded-xl bg-[#080D18] border border-blue-900/50 flex items-center justify-center text-cyan-400 group-hover:scale-105 group-hover:border-cyan-500/50 transition-all shadow-md">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-cyan-400 font-medium mt-0.5">
                      {srv.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-white/[0.06] space-y-2.5">
                  {srv.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
