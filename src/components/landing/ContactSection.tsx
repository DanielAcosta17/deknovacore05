import React from 'react';
import { motion, type Variants } from 'motion/react';
import {
  MessageCircle,
  Mail,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ContactSectionProps {
  onOpenOrderModal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenOrderModal }) => {
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
    <section id="contacto" className="py-20 lg:py-28 bg-[#080D18] border-t border-white/[0.06] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 ambient-glow-cyan rounded-full pointer-events-none blur-3xl opacity-30" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 font-mono">
            Canales de Contacto Directo
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-['Outfit']">
            ¿Listo para impulsar el catálogo o menú de tu negocio?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Comunícate con nuestro equipo en cualquier momento. Estamos listos para responder tus preguntas y activar tu plataforma digital.
          </p>
        </div>

        {/* Contact Cards Grid with Motion */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {/* Card 1: WhatsApp */}
          <motion.a
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            href="https://wa.me/50760244779?text=Hola%20D.%20E.%20K%20NovaCore,%20quiero%20m%C3%A1s%20informaci%C3%B3n"
            target="_blank"
            rel="noreferrer"
            className="group p-7 rounded-3xl bg-[#05070B] border border-slate-800/80 hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#080D18] border border-emerald-900/50 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-['Outfit'] group-hover:text-emerald-300 transition-colors">
                WhatsApp Oficial
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Atención rápida y personalizada directamente con nuestro equipo de desarrollo.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-400 font-mono">
                +507 6024-4779
              </span>
              <span className="text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 font-['Outfit']">
                Abrir chat <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.a>

          {/* Card 2: Email */}
          <motion.a
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            href="mailto:danielacostaperez17@gmail.com"
            className="group p-7 rounded-3xl bg-[#05070B] border border-slate-800/80 hover:border-cyan-500/50 transition-all shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#080D18] border border-blue-900/50 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-md">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-['Outfit'] group-hover:text-cyan-300 transition-colors">
                Correo Electrónico
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Escríbenos para propuestas formales, cotizaciones corporativas o integraciones especiales.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[190px] font-mono">
                danielacostaperez17@gmail.com
              </span>
              <span className="text-xs text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 font-['Outfit']">
                Escribir <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </motion.a>

          {/* Card 3: Support Schedule */}
          <motion.div
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="p-7 rounded-3xl bg-[#05070B] border border-slate-800/80 shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#080D18] border border-blue-900/40 text-blue-400 flex items-center justify-center mb-5 shadow-md">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1 font-['Outfit']">
                Horario de Soporte
              </h3>
              <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                Atención continua para asistirte en cada etapa del lanzamiento de tu catálogo.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] space-y-1">
              <div className="text-xs font-bold text-white font-mono">
                Lunes a Sábado: 8:00 AM - 7:00 PM
              </div>
              <div className="text-[11px] text-cyan-400/90 font-medium">
                Soporte técnico y emergencias disponible
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Banner using the top buttons action */}
        {onOpenOrderModal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="p-7 sm:p-9 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#05070B] to-cyan-950/40 border border-blue-900/40 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-2xl"
          >
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/20 text-cyan-300 text-xs font-bold mb-1 font-['Outfit']">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                <span>Gestión Centralizada</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                ¿Deseas solicitar tu sitio web o menú digital ahora?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Haz clic en el botón para abrir el formulario oficial de pedido y coordinar los detalles con nosotros.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="btn-sheen px-8 py-3.5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 text-sm font-black rounded-xl shadow-xl shadow-cyan-500/25 transition-all flex items-center gap-2 shrink-0 cursor-pointer font-['Outfit'] active:scale-95"
            >
              <MessageCircle className="w-4 h-4 fill-current text-slate-950" />
              <span>Solicitar Mi Sitio Web / Menú</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
