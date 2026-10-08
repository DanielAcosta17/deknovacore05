import { supabase, isSupabaseConfigured } from './client';
import { Business, Category, Product, Order, ServiceRequest, AppSettings } from '../types';
import { optimizeImage, OptimizationResult } from '../utils/imageOptimizer';

const LOCAL_STORAGE_KEYS = {
  businesses: 'deknovacore_businesses',
  categories: 'deknovacore_categories',
  products: 'deknovacore_products',
  orders: 'deknovacore_orders',
  serviceRequests: 'deknovacore_service_requests',
  settings: 'deknovacore_app_settings',
};

// Listeners activos para cambios en tiempo real
type Listener<T> = (data: T) => void;
const businessListeners = new Set<Listener<Business[]>>();
const categoryListeners = new Set<Listener<Category[]>>();
const productListeners = new Set<Listener<Product[]>>();
const orderListeners = new Set<Listener<Order[]>>();
const serviceRequestListeners = new Set<Listener<ServiceRequest[]>>();

// Helpers de mapeo Snake_case <-> CamelCase
function mapBusinessFromDb(row: any): Business {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    businessType: row.business_type || 'general',
    tagline: row.tagline || '',
    description: row.description || '',
    logoUrl: row.logo_url || '',
    coverUrl: row.cover_url || '',
    phone: row.phone || '',
    whatsapp: row.whatsapp || '',
    address: row.address || '',
    schedule: row.schedule || '',
    websiteUrl: row.website_url || undefined,
    instagram: row.instagram || undefined,
    facebook: row.facebook || undefined,
    tiktok: row.tiktok || undefined,
    primaryColor: row.primary_color || '#253745',
    secondaryColor: row.secondary_color || '#0ea5e9',
    template: row.template || 'general',
    isActive: row.is_active ?? true,
    currency: row.currency || '$',
    deliveryAvailable: row.delivery_available ?? false,
    deliveryCost: row.delivery_cost ? Number(row.delivery_cost) : 0,
    featuredNotice: row.featured_notice || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function mapBusinessToDb(b: Business): any {
  return {
    id: b.id,
    slug: b.slug,
    name: b.name,
    business_type: b.businessType,
    tagline: b.tagline,
    description: b.description,
    logo_url: b.logoUrl,
    cover_url: b.coverUrl,
    phone: b.phone,
    whatsapp: b.whatsapp,
    address: b.address,
    schedule: b.schedule,
    website_url: b.websiteUrl || '',
    instagram: b.instagram || '',
    facebook: b.facebook || '',
    tiktok: b.tiktok || '',
    primary_color: b.primaryColor,
    secondary_color: b.secondaryColor,
    template: b.template,
    is_active: b.isActive,
    currency: b.currency,
    delivery_available: b.deliveryAvailable || false,
    delivery_cost: b.deliveryCost || 0,
    featured_notice: b.featuredNotice || '',
    updated_at: new Date().toISOString(),
  };
}

function mapCategoryFromDb(row: any): Category {
  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    description: row.description || '',
    icon: row.icon || '',
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active ?? true,
  };
}

function mapCategoryToDb(c: Category): any {
  return {
    id: c.id,
    business_id: c.businessId,
    name: c.name,
    description: c.description || '',
    icon: c.icon || '',
    sort_order: c.sortOrder ?? 0,
    is_active: c.isActive ?? true,
  };
}

function mapProductFromDb(row: any): Product {
  let tags: string[] = [];
  if (Array.isArray(row.tags)) {
    tags = row.tags;
  } else if (typeof row.tags === 'string') {
    try {
      tags = JSON.parse(row.tags);
    } catch {
      tags = [];
    }
  }

  return {
    id: row.id,
    businessId: row.business_id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description || '',
    price: Number(row.price || 0),
    comparePrice: row.compare_price ? Number(row.compare_price) : undefined,
    imageUrl: row.image_url || '',
    tags,
    isFeatured: row.is_featured ?? false,
    isAvailable: row.is_available ?? true,
    sku: row.sku || undefined,
    unit: row.unit || undefined,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function mapProductToDb(p: Product): any {
  return {
    id: p.id,
    business_id: p.businessId,
    category_id: p.categoryId,
    name: p.name,
    description: p.description,
    price: p.price,
    compare_price: p.comparePrice ?? null,
    image_url: p.imageUrl,
    tags: JSON.stringify(p.tags || []),
    is_featured: p.isFeatured ?? false,
    is_available: p.isAvailable ?? true,
    sku: p.sku || '',
    unit: p.unit || '',
    updated_at: new Date().toISOString(),
  };
}

function mapOrderFromDb(row: any): Order {
  let items = [];
  if (Array.isArray(row.items)) {
    items = row.items;
  } else if (typeof row.items === 'string') {
    try {
      items = JSON.parse(row.items);
    } catch {
      items = [];
    }
  }

  return {
    id: row.id,
    businessId: row.business_id,
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    deliveryAddress: row.delivery_address || undefined,
    items,
    totalAmount: Number(row.total_amount || 0),
    status: row.status || 'pending',
    notes: row.notes || undefined,
    channel: row.channel || 'whatsapp',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function mapOrderToDb(o: Order): any {
  return {
    id: o.id,
    business_id: o.businessId,
    customer_name: o.customerName,
    customer_phone: o.customerPhone,
    delivery_address: o.deliveryAddress || '',
    items: JSON.stringify(o.items || []),
    total_amount: o.totalAmount,
    status: o.status,
    notes: o.notes || '',
    channel: o.channel || 'whatsapp',
  };
}

function mapServiceRequestFromDb(row: any): ServiceRequest {
  return {
    id: row.id,
    businessName: row.business_name,
    businessType: row.business_type,
    contactName: row.contact_name,
    phone: row.phone,
    email: row.email || undefined,
    plan: row.plan || 'Plan Pro',
    notes: row.notes || undefined,
    city: row.city || undefined,
    status: row.status || 'pending',
    createdAt: row.created_at || new Date().toISOString(),
  };
}

function mapServiceRequestToDb(s: ServiceRequest): any {
  return {
    id: s.id,
    business_name: s.businessName,
    business_type: s.businessType,
    contact_name: s.contactName,
    phone: s.phone,
    email: s.email || '',
    plan: s.plan || 'Plan Pro',
    notes: s.notes || '',
    city: s.city || '',
    status: s.status || 'pending',
  };
}

// Helper para deduplicar arrays por ID
export function deduplicateById<T extends { id?: string }>(items: T[]): T[] {
  if (!Array.isArray(items)) return items;
  const seen = new Set<string>();
  const result: T[] = [];
  for (const item of items) {
    if (!item) continue;
    if (item.id) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
    }
    result.push(item);
  }
  return result;
}

// Helpers de almacenamiento local (fallback y offline)
function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const clean = deduplicateById(parsed);
      if (clean.length !== parsed.length) {
        setLocal(key, clean);
      }
      return clean as unknown as T;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    const cleanVal = Array.isArray(val) ? deduplicateById(val) : val;
    localStorage.setItem(key, JSON.stringify(cleanVal));
  } catch (e) {
    console.warn('[LocalStorage] Quota exceeded or error saving:', e);
  }
}

export class SupabaseDataService {
  private static realtimeChannelInitialized = false;

  private static initRealtime() {
    if (!supabase || this.realtimeChannelInitialized) return;
    this.realtimeChannelInitialized = true;

    try {
      supabase
        .channel('public-db-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'businesses' }, () => {
          this.getBusinesses().then((bizs) => businessListeners.forEach((fn) => fn(bizs)));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () => {
          this.getCategories().then((cats) => categoryListeners.forEach((fn) => fn(cats)));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
          this.getProducts().then((prods) => productListeners.forEach((fn) => fn(prods)));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
          this.getOrders().then((ords) => orderListeners.forEach((fn) => fn(ords)));
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'service_requests' }, () => {
          this.getServiceRequests().then((reqs) => serviceRequestListeners.forEach((fn) => fn(reqs)));
        })
        .subscribe();
    } catch (err) {
      console.warn('[Supabase Realtime] No se pudo conectar al canal en tiempo real:', err);
    }
  }

  // --- Subscripciones en Tiempo Real ---
  static subscribeBusinesses(callback: Listener<Business[]>): () => void {
    businessListeners.add(callback);
    this.initRealtime();
    this.getBusinesses().then(callback);
    return () => businessListeners.delete(callback);
  }

  static subscribeCategories(callback: Listener<Category[]>): () => void {
    categoryListeners.add(callback);
    this.initRealtime();
    this.getCategories().then(callback);
    return () => categoryListeners.delete(callback);
  }

  static subscribeProducts(callback: Listener<Product[]>): () => void {
    productListeners.add(callback);
    this.initRealtime();
    this.getProducts().then(callback);
    return () => productListeners.delete(callback);
  }

  static subscribeOrders(callback: Listener<Order[]>): () => void {
    orderListeners.add(callback);
    this.initRealtime();
    this.getOrders().then(callback);
    return () => orderListeners.delete(callback);
  }

  static subscribeServiceRequests(callback: Listener<ServiceRequest[]>): () => void {
    serviceRequestListeners.add(callback);
    this.initRealtime();
    this.getServiceRequests().then(callback);
    return () => serviceRequestListeners.delete(callback);
  }

  // --- Negocios (Businesses) ---
  static async getBusinesses(): Promise<Business[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .order('name', { ascending: true });

        if (!error && data) {
          const list = data.map(mapBusinessFromDb);
          setLocal(LOCAL_STORAGE_KEYS.businesses, list);
          return list;
        }
      } catch (e) {
        console.warn('[Supabase] Error al leer negocios:', e);
      }
    }
    return getLocal<Business[]>(LOCAL_STORAGE_KEYS.businesses, []);
  }

  static async saveBusiness(biz: Business): Promise<{ success: boolean; mode: string }> {
    // 1. Guardado local inmediato
    const current = getLocal<Business[]>(LOCAL_STORAGE_KEYS.businesses, []);
    const idx = current.findIndex((b) => b.id === biz.id);
    if (idx >= 0) {
      current[idx] = biz;
    } else {
      current.push(biz);
    }
    setLocal(LOCAL_STORAGE_KEYS.businesses, current);
    businessListeners.forEach((fn) => fn(current));

    // 2. Sincronización en Supabase PostgreSQL
    if (supabase) {
      try {
        const payload = mapBusinessToDb(biz);
        const { error } = await supabase
          .from('businesses')
          .upsert(payload, { onConflict: 'id' });

        if (!error) {
          return { success: true, mode: 'supabase' };
        }
        console.error('[Supabase] Error guardando negocio:', error);
      } catch (err) {
        console.error('[Supabase] Excepción guardando negocio:', err);
      }
    }

    return { success: true, mode: 'local' };
  }

  static async deleteBusiness(id: string): Promise<{ success: boolean; mode: string }> {
    // Local
    let current = getLocal<Business[]>(LOCAL_STORAGE_KEYS.businesses, []);
    current = current.filter((b) => b.id !== id);
    setLocal(LOCAL_STORAGE_KEYS.businesses, current);
    businessListeners.forEach((fn) => fn(current));

    if (supabase) {
      try {
        await supabase.from('businesses').delete().eq('id', id);
        return { success: true, mode: 'supabase' };
      } catch (e) {
        console.warn('[Supabase] Error eliminando negocio:', e);
      }
    }

    return { success: true, mode: 'local' };
  }

  // --- Categorías (Categories) ---
  static async getCategories(businessId?: string): Promise<Category[]> {
    if (supabase) {
      try {
        let query = supabase.from('categories').select('*').order('sort_order', { ascending: true });
        if (businessId) {
          query = query.eq('business_id', businessId);
        }
        const { data, error } = await query;
        if (!error && data) {
          const list = data.map(mapCategoryFromDb);
          if (!businessId) setLocal(LOCAL_STORAGE_KEYS.categories, list);
          return list;
        }
      } catch (e) {
        console.warn('[Supabase] Error al leer categorías:', e);
      }
    }
    const all = getLocal<Category[]>(LOCAL_STORAGE_KEYS.categories, []);
    return businessId ? all.filter((c) => c.businessId === businessId) : all;
  }

  static async saveCategory(cat: Category): Promise<{ success: boolean; mode: string }> {
    const current = getLocal<Category[]>(LOCAL_STORAGE_KEYS.categories, []);
    const idx = current.findIndex((c) => c.id === cat.id);
    if (idx >= 0) {
      current[idx] = cat;
    } else {
      current.push(cat);
    }
    setLocal(LOCAL_STORAGE_KEYS.categories, current);
    categoryListeners.forEach((fn) => fn(current));

    if (supabase) {
      try {
        const payload = mapCategoryToDb(cat);
        const { error } = await supabase.from('categories').upsert(payload, { onConflict: 'id' });
        if (!error) return { success: true, mode: 'supabase' };
      } catch (e) {
        console.error('[Supabase] Error guardando categoría:', e);
      }
    }

    return { success: true, mode: 'local' };
  }

  static async deleteCategory(id: string, businessId?: string): Promise<{ success: boolean; mode: string }> {
    let current = getLocal<Category[]>(LOCAL_STORAGE_KEYS.categories, []);
    current = current.filter((c) => c.id !== id);
    setLocal(LOCAL_STORAGE_KEYS.categories, current);
    categoryListeners.forEach((fn) => fn(current));

    if (supabase) {
      try {
        await supabase.from('categories').delete().eq('id', id);
        return { success: true, mode: 'supabase' };
      } catch (e) {
        console.warn('[Supabase] Error eliminando categoría:', e);
      }
    }

    return { success: true, mode: 'local' };
  }

  // --- Productos (Products) ---
  static async getProducts(businessId?: string): Promise<Product[]> {
    if (supabase) {
      try {
        let query = supabase.from('products').select('*').order('name', { ascending: true });
        if (businessId) {
          query = query.eq('business_id', businessId);
        }
        const { data, error } = await query;
        if (!error && data) {
          const list = data.map(mapProductFromDb);
          if (!businessId) setLocal(LOCAL_STORAGE_KEYS.products, list);
          return list;
        }
      } catch (e) {
        console.warn('[Supabase] Error al leer productos:', e);
      }
    }
    const all = getLocal<Product[]>(LOCAL_STORAGE_KEYS.products, []);
    return businessId ? all.filter((p) => p.businessId === businessId) : all;
  }

  static async saveProduct(prod: Product): Promise<{ success: boolean; mode: string }> {
    const current = getLocal<Product[]>(LOCAL_STORAGE_KEYS.products, []);
    const idx = current.findIndex((p) => p.id === prod.id);
    if (idx >= 0) {
      current[idx] = prod;
    } else {
      current.push(prod);
    }
    setLocal(LOCAL_STORAGE_KEYS.products, current);
    productListeners.forEach((fn) => fn(current));

    if (supabase) {
      try {
        const payload = mapProductToDb(prod);
        const { error } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
        if (!error) return { success: true, mode: 'supabase' };
      } catch (e) {
        console.error('[Supabase] Error guardando producto:', e);
      }
    }

    return { success: true, mode: 'local' };
  }

  static async deleteProduct(id: string, businessId?: string): Promise<{ success: boolean; mode: string }> {
    let current = getLocal<Product[]>(LOCAL_STORAGE_KEYS.products, []);
    current = current.filter((p) => p.id !== id);
    setLocal(LOCAL_STORAGE_KEYS.products, current);
    productListeners.forEach((fn) => fn(current));

    if (supabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
        return { success: true, mode: 'supabase' };
      } catch (e) {
        console.warn('[Supabase] Error eliminando producto:', e);
      }
    }

    return { success: true, mode: 'local' };
  }

  // --- Pedidos (Orders) ---
  static async getOrders(businessId?: string): Promise<Order[]> {
    if (supabase) {
      try {
        let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (businessId) {
          query = query.eq('business_id', businessId);
        }
        const { data, error } = await query;
        if (!error && data) {
          const list = data.map(mapOrderFromDb);
          if (!businessId) setLocal(LOCAL_STORAGE_KEYS.orders, list);
          return list;
        }
      } catch (e) {
        console.warn('[Supabase] Error al leer pedidos:', e);
      }
    }
    const all = getLocal<Order[]>(LOCAL_STORAGE_KEYS.orders, []);
    return businessId ? all.filter((o) => o.businessId === businessId) : all;
  }

  static async saveOrder(ord: Order): Promise<{ success: boolean; mode: string; id: string }> {
    const current = getLocal<Order[]>(LOCAL_STORAGE_KEYS.orders, []);
    const idx = current.findIndex((o) => o.id === ord.id);
    if (idx >= 0) {
      current[idx] = ord;
    } else {
      current.unshift(ord);
    }
    setLocal(LOCAL_STORAGE_KEYS.orders, current);
    orderListeners.forEach((fn) => fn(current));

    if (supabase) {
      try {
        const payload = mapOrderToDb(ord);
        const { error } = await supabase.from('orders').upsert(payload, { onConflict: 'id' });
        if (!error) return { success: true, mode: 'supabase', id: ord.id };
      } catch (e) {
        console.error('[Supabase] Error guardando pedido:', e);
      }
    }

    return { success: true, mode: 'local', id: ord.id };
  }

  static async updateOrderStatus(
    orderId: string,
    businessId: string,
    status: Order['status']
  ): Promise<{ success: boolean; mode: string }> {
    const current = getLocal<Order[]>(LOCAL_STORAGE_KEYS.orders, []);
    const idx = current.findIndex((o) => o.id === orderId);
    if (idx >= 0) {
      current[idx].status = status;
      setLocal(LOCAL_STORAGE_KEYS.orders, current);
      orderListeners.forEach((fn) => fn(current));
    }

    if (supabase) {
      try {
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', orderId);
        if (!error) return { success: true, mode: 'supabase' };
      } catch (e) {
        console.error('[Supabase] Error actualizando estado de pedido:', e);
      }
    }

    return { success: true, mode: 'local' };
  }

  static async deleteOrder(orderId: string, businessId: string): Promise<{ success: boolean; mode: string }> {
    let current = getLocal<Order[]>(LOCAL_STORAGE_KEYS.orders, []);
    current = current.filter((o) => o.id !== orderId);
    setLocal(LOCAL_STORAGE_KEYS.orders, current);
    orderListeners.forEach((fn) => fn(current));

    if (supabase) {
      try {
        await supabase.from('orders').delete().eq('id', orderId);
        return { success: true, mode: 'supabase' };
      } catch (e) {
        console.warn('[Supabase] Error eliminando pedido:', e);
      }
    }

    return { success: true, mode: 'local' };
  }

  // --- Solicitudes de Clientes para su Negocio (Service Requests) ---
  static async getServiceRequests(): Promise<ServiceRequest[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('service_requests')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          const list = data.map(mapServiceRequestFromDb);
          setLocal(LOCAL_STORAGE_KEYS.serviceRequests, list);
          return list;
        }
      } catch (e) {
        console.warn('[Supabase] Error al leer solicitudes de servicios:', e);
      }
    }
    return getLocal<ServiceRequest[]>(LOCAL_STORAGE_KEYS.serviceRequests, []);
  }

  static async saveServiceRequest(
    req: ServiceRequest
  ): Promise<{ success: boolean; mode: string; id: string }> {
    const current = getLocal<ServiceRequest[]>(LOCAL_STORAGE_KEYS.serviceRequests, []);
    const idx = current.findIndex((r) => r.id === req.id);
    if (idx >= 0) {
      current[idx] = req;
    } else {
      current.unshift(req);
    }
    setLocal(LOCAL_STORAGE_KEYS.serviceRequests, current);
    serviceRequestListeners.forEach((fn) => fn(current));

    if (supabase) {
      try {
        const payload = mapServiceRequestToDb(req);
        const { error } = await supabase.from('service_requests').upsert(payload, { onConflict: 'id' });
        if (!error) return { success: true, mode: 'supabase', id: req.id };
      } catch (e) {
        console.error('[Supabase] Error guardando solicitud de servicio:', e);
      }
    }

    return { success: true, mode: 'local', id: req.id };
  }

  static async updateServiceRequestStatus(
    id: string,
    status: ServiceRequest['status']
  ): Promise<{ success: boolean; mode: string }> {
    const current = getLocal<ServiceRequest[]>(LOCAL_STORAGE_KEYS.serviceRequests, []);
    const idx = current.findIndex((r) => r.id === id);
    if (idx >= 0) {
      current[idx].status = status;
      setLocal(LOCAL_STORAGE_KEYS.serviceRequests, current);
      serviceRequestListeners.forEach((fn) => fn(current));
    }

    if (supabase) {
      try {
        const { error } = await supabase
          .from('service_requests')
          .update({ status })
          .eq('id', id);
        if (!error) return { success: true, mode: 'supabase' };
      } catch (e) {
        console.error('[Supabase] Error actualizando estado de solicitud:', e);
      }
    }

    return { success: true, mode: 'local' };
  }

  static async deleteServiceRequest(id: string): Promise<{ success: boolean; mode: string }> {
    let current = getLocal<ServiceRequest[]>(LOCAL_STORAGE_KEYS.serviceRequests, []);
    current = current.filter((r) => r.id !== id);
    setLocal(LOCAL_STORAGE_KEYS.serviceRequests, current);
    serviceRequestListeners.forEach((fn) => fn(current));

    if (supabase) {
      try {
        await supabase.from('service_requests').delete().eq('id', id);
        return { success: true, mode: 'supabase' };
      } catch (e) {
        console.warn('[Supabase] Error eliminando solicitud:', e);
      }
    }

    return { success: true, mode: 'local' };
  }

  // --- Configuración Global ---
  static async getAppSettings(): Promise<AppSettings> {
    const fallback: AppSettings = {
      platformName: 'D. E. K NovaCore',
      ownerWhatsApp: '50760244779',
      supportEmail: 'contacto@deknovacore.com',
      defaultHomePage: 'landing',
      allowCustomerRequests: true,
    };

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('app_settings')
          .select('*')
          .eq('id', 'global_settings')
          .single();

        if (!error && data) {
          const settings: AppSettings = {
            platformName: data.platform_name || fallback.platformName,
            ownerWhatsApp: data.owner_whatsapp || fallback.ownerWhatsApp,
            supportEmail: data.support_email || fallback.supportEmail,
            defaultHomePage: data.default_home_page || fallback.defaultHomePage,
            allowCustomerRequests: data.allow_customer_requests ?? fallback.allowCustomerRequests,
          };
          setLocal(LOCAL_STORAGE_KEYS.settings, settings);
          return settings;
        }
      } catch (e) {
        console.warn('[Supabase] Error al leer configuración:', e);
      }
    }

    return getLocal<AppSettings>(LOCAL_STORAGE_KEYS.settings, fallback);
  }

  static async saveAppSettings(settings: Partial<AppSettings>): Promise<{ success: boolean }> {
    const current = await this.getAppSettings();
    const merged: AppSettings = { ...current, ...settings };
    setLocal(LOCAL_STORAGE_KEYS.settings, merged);

    if (supabase) {
      try {
        await supabase.from('app_settings').upsert({
          id: 'global_settings',
          platform_name: merged.platformName,
          owner_whatsapp: merged.ownerWhatsApp,
          support_email: merged.supportEmail,
          default_home_page: merged.defaultHomePage,
          allow_customer_requests: merged.allowCustomerRequests,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('[Supabase] Error guardando configuración:', e);
      }
    }

    return { success: true };
  }

  // --- Subida y Optimización de Imágenes (Supabase Storage) ---
  static async uploadImageWithDetails(
    file: File,
    path: string,
    preset: 'logo' | 'cover' | 'product' | 'general' = 'general'
  ): Promise<{ url: string; optimization: OptimizationResult }> {
    const optimization = await optimizeImage(file, preset);

    if (supabase) {
      try {
        const cleanPath = path.replace(/^\/+/, '');
        const { error: uploadError } = await supabase.storage
          .from('business-assets')
          .upload(cleanPath, optimization.optimizedFile, {
            upsert: true,
            contentType: 'image/webp',
          });

        if (!uploadError) {
          const { data } = supabase.storage
            .from('business-assets')
            .getPublicUrl(cleanPath);

          if (data?.publicUrl) {
            return {
              url: data.publicUrl,
              optimization,
            };
          }
        } else {
          console.warn('[Supabase Storage] Error al subir, usando dataUrl local:', uploadError);
        }
      } catch (err) {
        console.warn('[Supabase Storage] Excepción al subir a storage:', err);
      }
    }

    // Fallback: Retornar dataUrl comprimido optimizado
    return {
      url: optimization.dataUrl,
      optimization,
    };
  }

  // --- Sincronización y Purga ---
  static async syncAllToSupabase(
    businesses: Business[],
    categories: Category[],
    products: Product[],
    orders: Order[]
  ): Promise<{ syncedCount: number }> {
    if (!supabase) return { syncedCount: 0 };
    let count = 0;

    for (const b of businesses) {
      await supabase.from('businesses').upsert(mapBusinessToDb(b));
      count++;
    }
    for (const c of categories) {
      await supabase.from('categories').upsert(mapCategoryToDb(c));
      count++;
    }
    for (const p of products) {
      await supabase.from('products').upsert(mapProductToDb(p));
      count++;
    }
    for (const o of orders) {
      await supabase.from('orders').upsert(mapOrderToDb(o));
      count++;
    }

    return { syncedCount: count };
  }

  static async purgeAllData(): Promise<{ deletedCount: number }> {
    let count = 0;
    const bizs = getLocal<Business[]>(LOCAL_STORAGE_KEYS.businesses, []);
    count += bizs.length;

    localStorage.removeItem(LOCAL_STORAGE_KEYS.businesses);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.categories);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.products);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.orders);

    businessListeners.forEach((fn) => fn([]));
    categoryListeners.forEach((fn) => fn([]));
    productListeners.forEach((fn) => fn([]));
    orderListeners.forEach((fn) => fn([]));

    if (supabase) {
      try {
        await supabase.from('orders').delete().neq('id', 'dummy_keep');
        await supabase.from('products').delete().neq('id', 'dummy_keep');
        await supabase.from('categories').delete().neq('id', 'dummy_keep');
        await supabase.from('businesses').delete().neq('id', 'dummy_keep');
      } catch (e) {
        console.warn('[Supabase] Error durante purga:', e);
      }
    }

    return { deletedCount: count };
  }

  static resetDemoData(): void {
    // Vacío o listo para nuevos negocios
  }
}

export const supabaseService = SupabaseDataService;
export const DataService = SupabaseDataService;
export default SupabaseDataService;
