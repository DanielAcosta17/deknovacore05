import React from 'react';
import {
  MessageCircle,
  Mail,
  Clock,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface ContactSectionProps {
  onOpenOrderModal?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenOrderModal }) => {
  return (
    <section id="contacto" className="py-16 lg:py-24 bg-[#111a24] border-t border-slate-700/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
            Canales de Contacto Directo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            ¿Listo para impulsar el catálogo o menú de tu negocio?
          </h2>
          <p className="text-sm sm:text-base text-sky-200 leading-relaxed">
            Comunícate con nuestro equipo en cualquier momento. Estamos listos para responder tus preguntas y activar tu plataforma digital.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: WhatsApp */}
          <a
            href="https://wa.me/50760244779?text=Hola%20D.%20E.%20K%20NovaCore,%20quiero%20m%C3%A1s%20informaci%C3%B3n"
            target="_blank"
            rel="noreferrer"
            className="group p-6 rounded-3xl bg-[#16222f] border border-slate-700/80 hover:border-emerald-500/60 transition-all duration-200 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                WhatsApp Oficial
              </h3>
              <p className="text-xs text-sky-200 mb-4">
                Atención rápida y personalizada directamente con nuestro equipo.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <span className="text-sm font-bold text-emerald-400">
                +507 6024-4779
              </span>
              <span className="text-xs text-emerald-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Abrir chat <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>

          {/* Card 2: Email */}
          <a
            href="mailto:danielacostaperez17@gmail.com"
            className="group p-6 rounded-3xl bg-[#16222f] border border-slate-700/80 hover:border-sky-500/60 transition-all duration-200 hover:-translate-y-1 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sky-950/80 border border-sky-800 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Correo Electrónico
              </h3>
              <p className="text-xs text-sky-200 mb-4">
                Escríbenos para propuestas formales, cotizaciones corporativas o alianzas.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-700/80 flex items-center justify-between">
              <span className="text-xs font-bold text-sky-300 truncate max-w-[190px]">
                danielacostaperez17@gmail.com
              </span>
              <span className="text-xs text-sky-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                Escribir <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </a>

          {/* Card 3: Support Schedule */}
          <div className="p-6 rounded-3xl bg-[#16222f] border border-slate-700/80 shadow-lg flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-950/80 border border-amber-800 text-amber-400 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Horario de Soporte
              </h3>
              <p className="text-xs text-sky-200 mb-4">
                Atención continua para asistirte en cada etapa del lanzamiento de tu catálogo.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-700/80 space-y-1">
              <div className="text-xs font-bold text-white">
                Lunes a Sábado: 8:00 AM - 7:00 PM
              </div>
              <div className="text-[11px] text-amber-300">
                Soporte técnico y emergencias disponible
              </div>
            </div>
          </div>
        </div>

        {/* Action Banner using the top buttons action */}
        {onOpenOrderModal && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-sky-950/60 via-[#16222f] to-emerald-950/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xl">
            <div className="space-y-1 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Gestión Centralizada</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                ¿Deseas solicitar tu sitio web o menú digital ahora?
              </h3>
              <p className="text-xs sm:text-sm text-sky-200">
                Haz clic en el botón para abrir el formulario oficial de pedido y coordinar los detalles con nosotros.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenOrderModal}
              className="px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-extrabold rounded-xl shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-current text-slate-950" />
              <span>Solicitar Mi Sitio Web / Menú</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
