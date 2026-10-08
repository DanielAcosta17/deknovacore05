import React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  Palette,
  UploadCloud,
  FolderPlus,
  PackagePlus,
  Share2,
} from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: Palette,
      title: 'Elige tu Plantilla y Colores',
      desc: 'Selecciona entre gastronomía, pastelería, moda, ferretería o comercio general y personaliza tu paleta de marca.',
    },
    {
      step: '02',
      icon: UploadCloud,
      title: 'Sube tu Logo y Portada',
      desc: 'Coloca tu imagen corporativa, horarios de atención, dirección física y tu número de WhatsApp para pedidos.',
    },
    {
      step: '03',
      icon: FolderPlus,
      title: 'Crea tus Categorías',
      desc: 'Organiza tu catálogo o menú en secciones claras como Entradas, Platos Fuertes, Bebidas, Calzado o Herramientas.',
    },
    {
      step: '04',
      icon: PackagePlus,
      title: 'Agrega tus Productos',
      desc: 'Carga fotos atractivas, descripciones, precios reales, precios de oferta y marca los productos más destacados.',
    },
    {
      step: '05',
      icon: Share2,
      title: '¡Publica y Vende!',
      desc: 'Obtén tu enlace personalizado y código QR para compartir en redes sociales, vitrinas y mesas de tu local.',
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
    <section id="como-funciona" className="py-20 lg:py-28 bg-[#05070B] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            Fácil, Rápido y Sin Programación
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
            ¿Cómo funciona D.E.K NovaCore?
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            En menos de 10 minutos tu negocio tendrá un catálogo o menú digital listo para recibir pedidos directos.
          </p>
        </div>

        {/* Steps Grid with Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative"
        >
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-[#080D18] p-6 rounded-2xl border border-slate-800/80 shadow-xl flex flex-col justify-between group hover:border-cyan-500/40 hover:shadow-cyan-500/10 transition-all duration-300"
              >
                {/* Step badge */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-xl bg-[#05070B] text-cyan-400 border border-blue-900/40 flex items-center justify-center font-black text-sm group-hover:scale-105 group-hover:border-cyan-400/50 transition-all shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-2xl font-black font-['Outfit'] text-slate-700 group-hover:text-cyan-400/40 transition-colors">
                    {s.step}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-2 font-['Outfit'] group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-normal">
                    {s.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
