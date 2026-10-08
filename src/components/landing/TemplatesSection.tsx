import React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  UtensilsCrossed,
  Cake,
  Shirt,
  Wrench,
  Store,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { AVAILABLE_TEMPLATES } from '../../data/initialData';
import { useBusiness } from '../../contexts/BusinessContext';

export const TemplatesSection: React.FC = () => {
  const { businesses, openBusinessWebsite } = useBusiness();

  const iconMap: Record<string, any> = {
    UtensilsCrossed,
    Cake,
    Sparkles: Shirt,
    Wrench,
    Store,
  };

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
    <section id="plantillas" className="py-20 lg:py-28 bg-[#080D18] border-t border-white/[0.06] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            Arquitectura Modular Adaptable
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
            5 Plantillas Visuales Especializadas
          </h2>
          <p className="text-sm sm:text-base text-slate-300">
            Un motor reactivo ultrarrápido que adapta automáticamente su disposición, tipografías, botones y flujo de pedido según el rubro de tu negocio.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {AVAILABLE_TEMPLATES.map((tmpl) => {
            const Icon = iconMap[tmpl.icon] || Store;
            const matchingBiz = businesses.find((b) => b.template === tmpl.id);

            return (
              <motion.div
                key={tmpl.id}
                variants={cardVariants}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#05070B] rounded-2xl border border-slate-800/80 shadow-xl hover:border-cyan-500/40 hover:shadow-cyan-500/10 transition-all p-7 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md border border-white/10"
                      style={{ backgroundColor: tmpl.previewColor }}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold font-mono bg-[#080D18] text-cyan-400 border border-blue-900/40 uppercase tracking-wide">
                      {tmpl.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-cyan-400 font-semibold mt-0.5">
                      {tmpl.bestFor}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    {tmpl.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    {tmpl.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.06]">
                  {matchingBiz ? (
                    <button
                      onClick={() => openBusinessWebsite(matchingBiz)}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-cyan-500/30 text-cyan-300 bg-blue-950/30 hover:bg-cyan-500/20 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer font-['Outfit']"
                    >
                      <span>Ver ejemplo: {matchingBiz.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  ) : (
                    <div className="text-center text-xs text-slate-500 font-mono">
                      Plantilla lista para vincular a tu negocio
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
