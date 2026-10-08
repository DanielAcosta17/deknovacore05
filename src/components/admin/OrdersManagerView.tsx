import React, { useState } from 'react';
import {
  ShoppingBag,
  MessageCircle,
  Clock,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  ExternalLink,
  XCircle,
  Trash2,
  Sparkles,
  Store,
  Layers,
  FileText,
} from 'lucide-react';
import { useBusiness } from '../../contexts/BusinessContext';
import { Order, ServiceRequest } from '../../types';

export const OrdersManagerView: React.FC = () => {
  const {
    orders,
    serviceRequests,
    activeBusiness,
    updateOrderStatus,
    deleteOrder,
    updateServiceRequestStatus,
    deleteServiceRequest,
  } = useBusiness();

  const [activeTab, setActiveTab] = useState<'service_requests' | 'store_orders'>('service_requests');
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const bizOrders = orders.filter((o) => !activeBusiness || o.businessId === activeBusiness?.id);
  const currency = activeBusiness?.currency || '$';

  const getOrderStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Completado
          </span>
        );
      case 'contacted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> Contactado
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Pendiente
          </span>
        );
    }
  };

  const getRequestStatusBadge = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Aprobado / En Desarrollo
          </span>
        );
      case 'contacted':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1">
            <MessageCircle className="w-3 h-3" /> En Contacto
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
            <XCircle className="w-3 h-3" /> Cancelado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Nueva Solicitud
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white">
            Pedidos y Solicitudes de Clientes
          </h2>
          <p className="text-xs text-sky-200">
            Gestiona tanto las solicitudes de clientes que piden un catálogo para su negocio como los pedidos de productos en tus tiendas.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 text-xs font-semibold">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sincronizado con Supabase PostgreSQL</span>
        </div>
      </div>

      {/* Selector de Pestañas */}
      <div className="flex border-b border-slate-700 bg-[#16222f] p-1.5 rounded-2xl gap-2">
        <button
          onClick={() => setActiveTab('service_requests')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'service_requests'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'text-sky-200 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Solicitudes de Negocios ({serviceRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('store_orders')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'store_orders'
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'text-sky-200 hover:text-white hover:bg-slate-800'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Pedidos de Productos ({bizOrders.length})</span>
        </button>
      </div>

      {/* PESTAÑA 1: Solicitudes de Clientes para su Negocio */}
      {activeTab === 'service_requests' && (
        <div className="space-y-4">
          {serviceRequests.length === 0 ? (
            <div className="p-12 bg-[#16222f] dark:bg-[#111a24] rounded-2xl border border-slate-700/80 text-center space-y-3 shadow-md">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 mx-auto">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">
                No hay solicitudes de negocios aún
              </h3>
              <p className="text-xs text-sky-200 max-w-sm mx-auto">
                Cuando un cliente haga clic en &quot;Hacer Pedido para mi Negocio&quot; en la página principal, su pedido se guardará aquí en la base de datos y se enviará a tu WhatsApp.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {serviceRequests.map((req) => {
                const cleanPhone = req.phone.replace(/\D/g, '');
                const waChatUrl = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(
                  req.contactName
                )},%20te%20escribimos%20de%20D.%20E.%20K%20NovaCore%20sobre%20tu%20pedido%20de%20cat%C3%A1logo%20para%20tu%20negocio%20"${encodeURIComponent(
                  req.businessName
                )}"%20(${encodeURIComponent(req.plan)}).`;

                return (
                  <div
                    key={req.id}
                    className="bg-[#16222f] dark:bg-[#111a24] rounded-2xl border border-slate-700/80 p-5 shadow-md space-y-4 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sky-400">
                          #{req.id.slice(-6).toUpperCase()}
                        </span>
                        {getRequestStatusBadge(req.status)}
                        <span className="px-2 py-0.5 bg-slate-800 text-sky-300 rounded-md font-semibold text-[11px]">
                          {req.plan}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-sky-300 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(req.createdAt).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => setRequestToDelete(req.id)}
                          title="Eliminar solicitud"
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Datos del Negocio */}
                      <div className="p-3 bg-[#0f1722] rounded-xl border border-slate-700/60 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Negocio del Cliente
                        </span>
                        <div className="font-bold text-white text-sm flex items-center gap-1.5">
                          <Store className="w-4 h-4 text-sky-400 shrink-0" />
                          {req.businessName}
                        </div>
                        <div className="text-[11px] text-sky-300 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-slate-400 shrink-0" />
                          {req.businessType}
                        </div>
                      </div>

                      {/* Datos del Contacto */}
                      <div className="p-3 bg-[#0f1722] rounded-xl border border-slate-700/60 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Datos de Contacto
                        </span>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          {req.contactName}
                        </div>
                        <div className="text-[11px] text-sky-200 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          {req.phone}
                        </div>
                        {req.city && (
                          <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            {req.city}
                          </div>
                        )}
                      </div>

                      {/* Acciones Rápidas */}
                      <div className="p-3 bg-[#0f1722] rounded-xl border border-slate-700/60 space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Contactar por WhatsApp
                        </span>
                        <a
                          href={waChatUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>Escribir al Cliente</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {req.notes && (
                      <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-start gap-2 text-sky-200 text-xs">
                        <FileText className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-white">Notas del cliente:</span>{' '}
                          {req.notes}
                        </div>
                      </div>
                    )}

                    {/* Selector de estado */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/80">
                      <span className="text-slate-400 text-xs">Cambiar Estado:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => updateServiceRequestStatus(req.id, 'pending')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            req.status === 'pending'
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Pendiente
                        </button>
                        <button
                          onClick={() => updateServiceRequestStatus(req.id, 'contacted')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            req.status === 'contacted'
                              ? 'bg-blue-500 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Contactado
                        </button>
                        <button
                          onClick={() => updateServiceRequestStatus(req.id, 'approved')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            req.status === 'approved'
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Aprobado
                        </button>
                        <button
                          onClick={() => updateServiceRequestStatus(req.id, 'cancelled')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            req.status === 'cancelled'
                              ? 'bg-rose-500 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Cancelado
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PESTAÑA 2: Pedidos de Carrito de Productos */}
      {activeTab === 'store_orders' && (
        <div className="space-y-4">
          {bizOrders.length === 0 ? (
            <div className="p-12 bg-[#16222f] dark:bg-[#111a24] rounded-2xl border border-slate-700/80 text-center space-y-3 shadow-md">
              <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-sky-400 mx-auto">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-white text-base">
                No hay pedidos de productos registrados
              </h3>
              <p className="text-xs text-sky-200 max-w-sm mx-auto">
                Cuando los visitantes agreguen productos al carrito y envíen el pedido por WhatsApp desde tu catálogo, quedarán registrados aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bizOrders.map((order) => {
                const cleanPhone = order.customerPhone.replace(/\D/g, '');
                const customerChatUrl = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(
                  order.customerName
                )},%20te%20contactamos%20sobre%20tu%20pedido%20reciente%20(${currency}${order.totalAmount.toFixed(2)}).`;

                return (
                  <div
                    key={order.id}
                    className="bg-[#16222f] dark:bg-[#111a24] rounded-2xl border border-slate-700/80 p-5 shadow-md space-y-4 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">
                          #{order.id.slice(-6).toUpperCase()}
                        </span>
                        {getOrderStatusBadge(order.status)}
                      </div>

                      <div className="flex items-center gap-3 text-sky-300 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(order.createdAt).toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => setOrderToDelete(order.id)}
                          title="Eliminar pedido"
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Cliente */}
                      <div className="p-3 bg-[#0f1722] rounded-xl border border-slate-700/60 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Cliente
                        </span>
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-sky-200 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          {order.customerPhone}
                        </div>
                        {order.deliveryAddress && (
                          <div className="text-[11px] text-slate-300 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            {order.deliveryAddress}
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div className="p-3 bg-[#0f1722] rounded-xl border border-slate-700/60 space-y-1 md:col-span-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Productos Solicitados ({order.items.length})
                          </span>
                          <span className="font-bold text-emerald-400 text-sm">
                            Total: {currency}{order.totalAmount.toFixed(2)}
                          </span>
                        </div>
                        <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-xs py-0.5 border-b border-slate-800 last:border-0"
                            >
                              <span className="text-white">
                                {item.quantity}x {item.productName}
                              </span>
                              <span className="text-sky-300 font-medium">
                                {currency}{item.subtotal.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Selector de estado */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-700/80">
                      <div className="flex items-center gap-2">
                        <a
                          href={customerChatUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>Contactar por WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => updateOrderStatus(order.id, order.businessId, 'pending')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            order.status === 'pending'
                              ? 'bg-amber-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Pendiente
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, order.businessId, 'contacted')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            order.status === 'contacted'
                              ? 'bg-blue-500 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Contactado
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, order.businessId, 'completed')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            order.status === 'completed'
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Completado
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, order.businessId, 'cancelled')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                            order.status === 'cancelled'
                              ? 'bg-rose-500 text-white font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          Cancelado
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal de confirmación para eliminar solicitud */}
      {requestToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#16222f] p-6 rounded-2xl border border-slate-700 max-w-sm w-full space-y-4 text-center">
            <h4 className="font-bold text-white text-base">¿Eliminar solicitud?</h4>
            <p className="text-xs text-sky-200">
              Esta acción eliminará la solicitud permanentemente de la base de datos Supabase.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setRequestToDelete(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  await deleteServiceRequest(requestToDelete);
                  setRequestToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar pedido de producto */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="bg-[#16222f] p-6 rounded-2xl border border-slate-700 max-w-sm w-full space-y-4 text-center">
            <h4 className="font-bold text-white text-base">¿Eliminar pedido?</h4>
            <p className="text-xs text-sky-200">
              Esta acción eliminará el pedido de la base de datos Supabase.
            </p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (activeBusiness) {
                    await deleteOrder(orderToDelete, activeBusiness.id);
                  }
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
