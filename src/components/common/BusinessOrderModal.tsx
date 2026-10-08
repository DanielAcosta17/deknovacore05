import React, { useState } from 'react';
import {
  X,
  MessageCircle,
  Sparkles,
  Store,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  FileText,
  Layers,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';

interface BusinessOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPlan?: string;
}

export const BusinessOrderModal: React.FC<BusinessOrderModalProps> = ({
  isOpen,
  onClose,
  defaultPlan = 'Plan Pro',
}) => {
  const { createServiceRequest, appSettings } = useBusiness();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('Restaurante / Menú QR');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim() || !contactName.trim() || !phone.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Guardar la solicitud en la base de datos Supabase
      const req = await createServiceRequest({
        businessName: businessName.trim(),
        businessType,
        contactName: contactName.trim(),
        phone: phone.trim(),
        plan: selectedPlan,
        city: city.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      setSubmittedId(req.id);
      setIsSubmitted(true);

      // 2. Construir mensaje profesional de WhatsApp
      let msg = `Hola *D. E. K NovaCore*, quiero hacer un pedido para mi negocio:\n\n`;
      msg += `🏷️ *Negocio:* ${businessName.trim()}\n`;
      msg += `📂 *Rubro / Tipo:* ${businessType}\n`;
      msg += `⭐ *Plan Deseado:* ${selectedPlan}\n`;
      msg += `👤 *Contacto:* ${contactName.trim()}\n`;
      msg += `📱 *Teléfono:* ${phone.trim()}\n`;
      if (city.trim()) msg += `📍 *Ciudad/Ubicación:* ${city.trim()}\n`;
      if (notes.trim()) msg += `📝 *Detalles o Notas:* ${notes.trim()}\n`;
      msg += `\n_Ref de Pedido en Base de Datos: #${req.id.slice(-6).toUpperCase()}_\n`;
      msg += `_Enviado desde la plataforma oficial de D. E. K NovaCore_`;

      // 3. Enviar al WhatsApp del dueño/administrador
      const ownerNumber = (appSettings.ownerWhatsApp || '50760244779').replace(/\D/g, '');
      const encodedMsg = encodeURIComponent(msg);
      const waUrl = `https://wa.me/${ownerNumber}?text=${encodedMsg}`;

      // Abrir en nueva pestaña
      setTimeout(() => {
        window.open(waUrl, '_blank', 'noopener,noreferrer');
      }, 350);
    } catch (err) {
      console.error('Error al registrar pedido de negocio:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setBusinessName('');
    setContactName('');
    setPhone('');
    setCity('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#080D18] rounded-2xl shadow-2xl shadow-black/90 border border-blue-900/40 my-8 overflow-hidden text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.08] bg-[#05070B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-['Outfit']">
                Hacer Pedido para tu Negocio
              </h3>
              <p className="text-xs text-cyan-400 font-medium">
                Solicita tu catálogo digital, menú QR y tienda con WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white font-['Outfit']">
                ¡Pedido de Negocio Registrado!
              </h4>
              <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
                Tu solicitud ha sido guardada en nuestra base de datos con el código{' '}
                <span className="font-mono font-bold text-cyan-400">
                  #{submittedId.slice(-6).toUpperCase()}
                </span>
                . Se ha abierto tu WhatsApp para confirmar los detalles directamente con nuestro equipo.
              </p>
            </div>

            <div className="p-4 bg-[#05070B] rounded-xl border border-slate-800 text-xs text-left space-y-2 text-slate-300 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Negocio:</span>
                <span className="font-bold text-white font-sans">{businessName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Plan:</span>
                <span className="font-bold text-cyan-400 font-sans">{selectedPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contacto:</span>
                <span className="font-semibold text-white font-sans">{contactName} ({phone})</span>
              </div>
            </div>

            <button
              onClick={handleResetAndClose}
              className="btn-sheen w-full py-3 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer font-['Outfit']"
            >
              Cerrar y Volver
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5 font-['Outfit']">
                  <Store className="w-3.5 h-3.5 text-cyan-400" />
                  Nombre de tu Negocio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Pastelería Dulce Arte"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-800 bg-[#05070B] text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5 font-['Outfit']">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Rubro / Tipo de Negocio
                </label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-800 bg-[#05070B] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 cursor-pointer"
                >
                  <option value="Restaurante / Menú QR">Restaurante / Menú QR</option>
                  <option value="Pastelería / Repostería">Pastelería / Repostería</option>
                  <option value="Moda, Ropa y Boutique">Moda, Ropa y Boutique</option>
                  <option value="Ferretería y Materiales">Ferretería y Materiales</option>
                  <option value="Supermercado o Minimarket">Supermercado o Minimarket</option>
                  <option value="Salón de Belleza / Barbería">Salón de Belleza / Barbería</option>
                  <option value="Tecnología y Electrónica">Tecnología y Electrónica</option>
                  <option value="Servicios Profesionales">Servicios Profesionales</option>
                  <option value="Otro tipo de Negocio">Otro tipo de Negocio</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5 font-['Outfit']">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Nombre de Contacto *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Daniel Acosta"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-800 bg-[#05070B] text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5 font-['Outfit']">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  Tu WhatsApp / Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: +507 6123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-800 bg-[#05070B] text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5 font-['Outfit']">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Ciudad / País
                </label>
                <input
                  type="text"
                  placeholder="Ej: Ciudad de Panamá, Panamá"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-800 bg-[#05070B] text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5 font-['Outfit']">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  Plan o Paquete Deseado
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-800 bg-[#05070B] text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 cursor-pointer"
                >
                  <option value="Plan Básico ($15/mes)">Plan Básico ($15/mes)</option>
                  <option value="Plan Pro ($29/mes)">Plan Pro ($29/mes) - Recomendado</option>
                  <option value="Plan Full Suite ($49/mes)">Plan Full Suite ($49/mes)</option>
                  <option value="Desarrollo a la Medida">Desarrollo a la Medida</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5 font-['Outfit']">
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                ¿Qué características especiales necesitas?
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Necesito código QR en acrílico, 50 productos, cálculo de delivery y dominio propio..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-800 bg-[#05070B] text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20"
              />
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-sheen w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-cyan-500/20 transition-all cursor-pointer disabled:opacity-50 font-['Outfit']"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>
                  {isSubmitting ? 'Guardando pedido...' : 'Hacer Pedido y Enviar a WhatsApp'}
                </span>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </button>
              <p className="text-[11px] text-center text-slate-400 mt-2.5 font-mono">
                Tu solicitud se registra de inmediato en la base de datos y se abre el chat directo para coordinar la entrega.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
