import React from 'react';
import {
  Building2,
  ExternalLink,
  Plus,
  QrCode,
  Sparkles,
  ArrowUpRight,
  Globe,
  Palette,
  CheckCircle2,
  Settings,
  Link2,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';

interface AdminDashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenCreateBusiness: () => void;
  onOpenQR: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigate,
  onOpenCreateBusiness,
  onOpenQR,
}) => {
  const { businesses, activeBusiness, openBusinessWebsite, serviceRequests, orders } = useBusiness();

  const sitesWithUrlCount = businesses.filter(
    (b) => b.websiteUrl && b.websiteUrl.trim()
  ).length;
  const activeSitesCount = businesses.filter((b) => b.isActive).length;

  const stats = [
    {
      label: 'Sitios Web Creados',
      value: businesses.length,
      icon: Building2,
      color: 'text-sky-400 bg-sky-950/80 border-sky-800/60',
      action: () => onNavigate('businesses'),
    },
    {
      label: 'Solicitudes de Clientes',
      value: serviceRequests.length,
      icon: Globe,
      color: 'text-emerald-400 bg-emerald-950/80 border-emerald-800/60',
      action: () => onNavigate('orders'),
    },
    {
      label: 'Pedidos de Tiendas',
      value: orders.length,
      icon: CheckCircle2,
      color: 'text-teal-400 bg-teal-950/80 border-teal-800/60',
      action: () => onNavigate('orders'),
    },
    {
      label: 'Plantillas Listas',
      value: '5 Disponibles',
      icon: Palette,
      color: 'text-purple-400 bg-purple-950/80 border-purple-800/60',
      action: () => onNavigate('templates'),
    },
  ];

  const getTargetUrl = (biz: { websiteUrl?: string; slug: string }) => {
    if (biz.websiteUrl && biz.websiteUrl.trim()) {
      const trimmed = biz.websiteUrl.trim();
      return trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    }
    return biz.slug.startsWith('http') ? biz.slug : `https://${biz.slug}.vercel.app`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-r from-[#16222f] via-[#1a2938] to-[#111a24] border border-slate-700/80 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-300 text-[11px] font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Portafolio de Sitios Web — D. E. K NovaCore</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            {activeBusiness ? `Gestionando: ${activeBusiness.name}` : 'Panel de Control de Sitios Web'}
          </h2>
          <p className="text-xs sm:text-sm text-sky-200 leading-relaxed font-normal">
            Administra los sitios web creados para tus clientes, actualiza enlaces oficiales, logotipos, imágenes de portada y muestra tus creaciones en vivo.
          </p>
        </div>

        {activeBusiness && (
          <div className="flex flex-wrap items-center gap-2.5 relative z-10">
            <button
              onClick={() => openBusinessWebsite(activeBusiness)}
              className="py-2.5 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
              title="Abrir sitio web oficial en una nueva pestaña"
            >
              <Globe className="w-4 h-4" />
              <span>Visitar Sitio Web</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenQR}
              className="py-2.5 px-3.5 bg-[#0f1722] hover:bg-slate-800 text-sky-200 border border-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="Código QR del sitio web"
            >
              <QrCode className="w-4 h-4 text-sky-400" />
              <span>QR</span>
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              onClick={st.action}
              className="p-5 bg-[#16222f] dark:bg-[#111a24] rounded-2xl border border-slate-700/80 shadow-md hover:border-sky-500/50 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="space-y-1">
                <span className="text-xs text-sky-200 font-bold truncate block max-w-[150px]">
                  {st.label}
                </span>
                <span className="text-2xl font-black text-white">
                  {st.value}
                </span>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${st.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="bg-[#16222f] dark:bg-[#111a24] rounded-2xl border border-slate-700/80 p-5 shadow-md space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
          Acciones Rápidas
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={onOpenCreateBusiness}
            className="p-3.5 rounded-xl border border-slate-700 bg-[#0f1722] hover:bg-slate-800 hover:border-sky-500/50 transition-colors flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-400 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Nuevo Sitio Web / Negocio
              </div>
              <div className="text-[11px] text-sky-200 font-medium">Registrar nuevo cliente o proyecto</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('templates')}
            className="p-3.5 rounded-xl border border-slate-700 bg-[#0f1722] hover:bg-slate-800 hover:border-sky-500/50 transition-colors flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-purple-950/80 border border-purple-800/60 text-purple-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Galería de Plantillas
              </div>
              <div className="text-[11px] text-sky-200 font-medium">Restaurante, moda, pastelería, etc.</div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="p-3.5 rounded-xl border border-slate-700 bg-[#0f1722] hover:bg-slate-800 hover:border-sky-500/50 transition-colors flex items-center gap-3 text-left cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Configuración & Supabase
              </div>
              <div className="text-[11px] text-sky-200 font-medium">Base de datos PostgreSQL y variables</div>
            </div>
          </button>
        </div>
      </div>

      {/* Created Websites Portfolio Table */}
      <div className="bg-[#16222f] dark:bg-[#111a24] rounded-2xl border border-slate-700/80 p-5 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">
              Portafolio de Sitios Web Creados
            </h3>
            <p className="text-xs text-sky-200 font-medium">
              Sitios web registrados en la plataforma y sus enlaces directos
            </p>
          </div>
          <button
            onClick={() => onNavigate('businesses')}
            className="text-xs text-sky-400 font-bold hover:underline cursor-pointer"
          >
            Administrar todos ({businesses.length})
          </button>
        </div>

        {businesses.length === 0 ? (
          <div className="py-12 text-center text-xs text-sky-300/80 bg-[#0f1722] rounded-xl border border-dashed border-slate-700 space-y-3">
            <Building2 className="w-9 h-9 text-sky-400 mx-auto" />
            <div className="space-y-1">
              <p className="font-semibold text-white text-sm">
                No hay sitios web creados todavía
              </p>
              <p className="text-[11px] text-sky-300 max-w-sm mx-auto">
                Registra tu primer cliente o local para que aparezca en el portafolio de la web y redirija a sus visitantes.
              </p>
            </div>
            <button
              onClick={onOpenCreateBusiness}
              className="inline-flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Primer Sitio Web</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0f1722] text-sky-300 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Sitio / Negocio</th>
                  <th className="py-2.5 px-3">Plantilla</th>
                  <th className="py-2.5 px-3">Enlace Web Oficial</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/70">
                {businesses.map((biz, idx) => {
                  const targetUrl = getTargetUrl(biz);
                  const displayUrl = (biz.websiteUrl || `${biz.slug}.vercel.app`)
                    .replace(/^https?:\/\//i, '')
                    .replace(/\/$/, '');

                  return (
                    <tr key={`${biz.id}-${idx}`} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 flex items-center gap-2.5">
                        <img
                          src={biz.logoUrl}
                          alt={biz.name}
                          className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white truncate max-w-[200px]">
                            {biz.name}
                          </div>
                          <div className="text-[11px] text-sky-200 truncate max-w-[200px] font-medium">
                            {biz.address || biz.tagline || 'Sin dirección'}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white uppercase tracking-wide shadow-sm"
                          style={{ backgroundColor: biz.primaryColor || '#253745' }}
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
                      </td>

                      <td className="py-3 px-3">
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-mono text-[11px] font-bold group cursor-pointer"
                          title={`Abrir ${targetUrl} en nueva pestaña`}
                        >
                          <Globe className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[180px]">{displayUrl}</span>
                          <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 shrink-0" />
                        </a>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            biz.isActive
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {biz.isActive ? 'En Línea' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 hover:text-white border border-sky-500/40 text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                            title={`Visitar sitio web oficial de ${biz.name}`}
                          >
                            <span>Visitar</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <button
                            onClick={() => onNavigate('businesses')}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-200 text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Editar
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
