import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business, Category, Product, Order, ServiceRequest, AppSettings } from '../types';
import { DataService } from '../supabase/service';
import { deduplicateById } from '../supabase/service';

interface BusinessContextType {
  businesses: Business[];
  categories: Category[];
  products: Product[];
  orders: Order[];
  serviceRequests: ServiceRequest[];
  selectedBusinessId: string;
  activeBusiness: Business | null;
  isLoading: boolean;
  activeView: 'landing' | 'admin' | 'public_store';
  currentPublicSlug: string | null;

  // Navigation & View switching
  goToLanding: () => void;
  goToAdmin: () => void;
  goToPublicStore: (slug: string) => void;
  openBusinessWebsite: (biz: Business | string) => void;
  setSelectedBusinessId: (id: string) => void;

  // Business CRUD
  createBusiness: (bizData: Partial<Business>) => Promise<Business>;
  updateBusiness: (biz: Business) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  toggleBusinessActive: (id: string) => Promise<void>;
  getBusinessBySlug: (slug: string) => Business | undefined;

  // Product CRUD
  createProduct: (prodData: Partial<Product>) => Promise<Product>;
  updateProduct: (prod: Product) => Promise<void>;
  deleteProduct: (id: string, businessId: string) => Promise<void>;
  toggleProductAvailable: (id: string) => Promise<void>;

  // Category CRUD
  createCategory: (catData: Partial<Category>) => Promise<Category>;
  updateCategory: (cat: Category) => Promise<void>;
  deleteCategory: (id: string, businessId: string) => Promise<void>;

  // Order submission & status management
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, businessId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string, businessId: string) => Promise<void>;

  // Service Requests (clientes solicitando catálogo para su negocio)
  createServiceRequest: (
    reqData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>
  ) => Promise<ServiceRequest>;
  updateServiceRequestStatus: (
    id: string,
    status: ServiceRequest['status']
  ) => Promise<void>;
  deleteServiceRequest: (id: string) => Promise<void>;

  // App Settings
  appSettings: AppSettings;
  updateAppSettings: (settings: Partial<AppSettings>) => Promise<void>;

  // Direct Supabase Sync
  syncAllToSupabase: () => Promise<{ success: boolean; message: string }>;
  syncAllToFirestore: () => Promise<{ success: boolean; message: string }>; // alias for backwards compat
  lastSupabaseSyncTime: string | null;
  lastFirestoreSyncTime: string | null; // alias
  syncNotification: string | null;

  // Default home page setting
  defaultHomePage: 'landing' | 'store';
  setDefaultHomePage: (mode: 'landing' | 'store') => void;

  // Purge / Reset to zero
  purgeAllData: () => Promise<{ success: boolean; deletedCount: number; message: string }>;
  resetData: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

// Utility to extract a clean slug from any format (URL, hash, path, or raw slug)
export const extractCleanSlug = (input: string): string => {
  if (!input) return '';
  let cleaned = input.trim();

  if (/^(?:https?:)?\/\//i.test(cleaned)) {
    try {
      const fullUrl = cleaned.startsWith('//') ? `https:${cleaned}` : cleaned;
      const url = new URL(fullUrl);

      if (url.hash) {
        const hashClean = url.hash.replace(/^#\/?(?:negocio|tienda)?\/?/i, '').split('?')[0];
        if (hashClean && hashClean !== 'admin' && hashClean !== 'inicio') {
          cleaned = hashClean;
        }
      }

      if (/^(?:https?:)?\/\//i.test(cleaned)) {
        const pathClean = url.pathname.replace(/^\/?(?:negocio|tienda)?\/?/i, '').replace(/^\/+|\/+$/g, '');
        if (pathClean && pathClean !== 'admin' && pathClean !== 'inicio') {
          const segments = pathClean.split('/').filter(Boolean);
          cleaned = segments[segments.length - 1] || segments[0] || '';
        } else {
          const hostParts = url.hostname.split('.');
          if (hostParts.length > 2 && hostParts[0] !== 'www') {
            cleaned = hostParts[0];
          } else if (hostParts.length >= 2) {
            cleaned = hostParts[0] === 'www' ? hostParts[1] : hostParts[0];
          }
        }
      }
    } catch {
      cleaned = cleaned.replace(/^(?:https?:)?\/\//i, '');
    }
  }

  if (cleaned.includes('#')) {
    cleaned = cleaned.split('#')[1] || '';
  }
  if (cleaned.includes('?')) {
    cleaned = cleaned.split('?')[0] || '';
  }
  cleaned = cleaned.replace(/^\/?(?:negocio|tienda)\//i, '');
  cleaned = cleaned.replace(/^\/+|\/+$/g, '');

  return cleaned
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
};

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings>({
    platformName: 'D. E. K NovaCore',
    ownerWhatsApp: '50760244779',
    supportEmail: 'contacto@deknovacore.com',
    defaultHomePage: 'landing',
    allowCustomerRequests: true,
  });
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [activeView, setActiveView] = useState<'landing' | 'admin' | 'public_store'>('landing');
  const [currentPublicSlug, setCurrentPublicSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastSupabaseSyncTime, setLastSupabaseSyncTime] = useState<string | null>(null);
  const [syncNotification, setSyncNotification] = useState<string | null>(null);
  const [defaultHomePage, setDefaultHomePageState] = useState<'landing' | 'store'>(() => {
    return (localStorage.getItem('deknovacore_default_home_page') as 'landing' | 'store') || 'landing';
  });

  const setDefaultHomePage = (mode: 'landing' | 'store') => {
    setDefaultHomePageState(mode);
    localStorage.setItem('deknovacore_default_home_page', mode);
    updateAppSettings({ defaultHomePage: mode });
    showSyncToast(`Página de inicio configurada a: ${mode === 'store' ? 'Catálogo del Negocio' : 'Landing Page'}`);
  };

  const showSyncToast = (msg: string) => {
    setSyncNotification(msg);
    setTimeout(() => setSyncNotification(null), 3500);
  };

  // Real-time Supabase synchronization listeners
  useEffect(() => {
    // Limpieza preventiva de duplicados en localStorage al iniciar
    try {
      ['deknovacore_businesses', 'deknovacore_categories', 'deknovacore_products', 'deknovacore_orders', 'deknovacore_service_requests'].forEach((key) => {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const clean = deduplicateById(parsed);
            if (clean.length !== parsed.length) {
              localStorage.setItem(key, JSON.stringify(clean));
            }
          }
        }
      });
    } catch (e) {
      console.warn('LocalStorage cleanup error:', e);
    }

    setIsLoading(true);

    const safetyTimer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    const unsubBiz = DataService.subscribeBusinesses((bizList) => {
      const seen = new Set<string>();
      const cleanList: Business[] = [];
      for (const b of bizList) {
        if (!b || !b.id || seen.has(b.id)) continue;
        seen.add(b.id);
        cleanList.push(b);
      }

      setBusinesses(cleanList);
      setSelectedBusinessId((prev) => {
        if (currentPublicSlug) {
          const match = cleanList.find((b) => b.slug.toLowerCase() === currentPublicSlug.toLowerCase());
          if (match) return match.id;
        }
        if (prev && cleanList.some((b) => b.id === prev)) {
          return prev;
        }
        return cleanList.length > 0 ? cleanList[0].id : '';
      });
      setIsLoading(false);
    });

    const unsubCat = DataService.subscribeCategories((catList) => {
      setCategories(deduplicateById(catList));
    });

    const unsubProd = DataService.subscribeProducts((prodList) => {
      setProducts(deduplicateById(prodList));
    });

    const unsubOrd = DataService.subscribeOrders((ordList) => {
      setOrders(deduplicateById(ordList));
    });

    const unsubReq = DataService.subscribeServiceRequests((reqList) => {
      setServiceRequests(deduplicateById(reqList));
    });

    DataService.getAppSettings().then((settings) => {
      setAppSettings(settings);
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubBiz();
      unsubCat();
      unsubProd();
      unsubOrd();
      unsubReq();
    };
  }, [currentPublicSlug]);

  const cleanCurrentSlug = currentPublicSlug ? extractCleanSlug(currentPublicSlug) : null;
  const activeBusiness =
    (cleanCurrentSlug
      ? businesses.find(
          (b) =>
            extractCleanSlug(b.slug) === cleanCurrentSlug ||
            b.slug.toLowerCase() === cleanCurrentSlug ||
            b.id === cleanCurrentSlug
        )
      : null) ||
    businesses.find((b) => b.id === selectedBusinessId) ||
    (businesses.length > 0 ? businesses[0] : null);

  // View navigation helpers
  const goToLanding = () => {
    setActiveView('landing');
    setCurrentPublicSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToAdmin = () => {
    setActiveView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToPublicStore = (slug: string) => {
    const clean = extractCleanSlug(slug);
    setCurrentPublicSlug(clean);
    setActiveView('public_store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBusinessWebsite = (bizOrSlug: Business | string) => {
    const biz =
      typeof bizOrSlug === 'string'
        ? businesses.find((b) => b.slug === bizOrSlug || b.id === bizOrSlug)
        : bizOrSlug;

    if (biz?.websiteUrl && biz.websiteUrl.trim()) {
      const url = biz.websiteUrl.trim();
      const target = url.startsWith('http') ? url : `https://${url}`;
      window.open(target, '_blank', 'noopener,noreferrer');
      return;
    }

    if (biz?.slug) {
      goToPublicStore(biz.slug);
    }
  };

  const getBusinessBySlug = (slug: string): Business | undefined => {
    const clean = extractCleanSlug(slug);
    return businesses.find(
      (b) =>
        extractCleanSlug(b.slug) === clean ||
        b.slug.toLowerCase() === clean ||
        b.id === clean
    );
  };

  // Business CRUD
  const createBusiness = async (bizData: Partial<Business>): Promise<Business> => {
    let cleanSlug = extractCleanSlug(bizData.slug || bizData.name || 'nuevo-negocio');
    if (!cleanSlug) cleanSlug = 'negocio-' + Date.now();

    const newBiz: Business = {
      id: 'biz-' + Date.now(),
      slug: cleanSlug,
      name: bizData.name || 'Nuevo Negocio',
      businessType: bizData.businessType || 'general',
      tagline: bizData.tagline || 'Tu catálogo digital oficial',
      description: bizData.description || 'Bienvenido a nuestro catálogo digital oficial.',
      logoUrl: bizData.logoUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&auto=format&fit=crop&q=80',
      coverUrl: bizData.coverUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
      phone: bizData.phone || '',
      whatsapp: bizData.whatsapp || appSettings.ownerWhatsApp,
      address: bizData.address || '',
      schedule: bizData.schedule || 'Lunes a Sábado: 8:00 AM - 7:00 PM',
      websiteUrl: bizData.websiteUrl || undefined,
      instagram: bizData.instagram || undefined,
      facebook: bizData.facebook || undefined,
      tiktok: bizData.tiktok || undefined,
      primaryColor: bizData.primaryColor || '#253745',
      secondaryColor: bizData.secondaryColor || '#0ea5e9',
      template: bizData.template || 'general',
      isActive: true,
      currency: bizData.currency || '$',
      deliveryAvailable: bizData.deliveryAvailable || false,
      deliveryCost: bizData.deliveryCost || 0,
      featuredNotice: bizData.featuredNotice || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await DataService.saveBusiness(newBiz);

    const defaultCat: Category = {
      id: 'cat-' + Date.now(),
      businessId: newBiz.id,
      name: 'General',
      description: 'Productos principales del catálogo',
      icon: 'Tag',
      sortOrder: 1,
      isActive: true,
    };
    await DataService.saveCategory(defaultCat);

    setBusinesses((prev) => {
      const exists = prev.some((b) => b.id === newBiz.id);
      if (exists) return prev.map((b) => (b.id === newBiz.id ? newBiz : b));
      return [...prev, newBiz];
    });
    setSelectedBusinessId(newBiz.id);
    showSyncToast(`Negocio "${newBiz.name}" registrado con éxito.`);
    return newBiz;
  };

  const updateBusiness = async (biz: Business): Promise<void> => {
    const updatedBiz = {
      ...biz,
      slug: extractCleanSlug(biz.slug),
      updatedAt: new Date().toISOString(),
    };
    await DataService.saveBusiness(updatedBiz);
    setBusinesses((prev) => prev.map((b) => (b.id === updatedBiz.id ? updatedBiz : b)));
    showSyncToast(`Cambios de "${updatedBiz.name}" guardados.`);
  };

  const deleteBusiness = async (id: string): Promise<void> => {
    await DataService.deleteBusiness(id);
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    if (selectedBusinessId === id) {
      const remaining = businesses.filter((b) => b.id !== id);
      setSelectedBusinessId(remaining.length > 0 ? remaining[0].id : '');
    }
    showSyncToast('Negocio eliminado.');
  };

  const toggleBusinessActive = async (id: string): Promise<void> => {
    const biz = businesses.find((b) => b.id === id);
    if (!biz) return;
    await updateBusiness({ ...biz, isActive: !biz.isActive });
  };

  // Product CRUD
  const createProduct = async (prodData: Partial<Product>): Promise<Product> => {
    const newProd: Product = {
      id: 'prod-' + Date.now(),
      businessId: prodData.businessId || selectedBusinessId,
      categoryId: prodData.categoryId || '',
      name: prodData.name || 'Nuevo Producto',
      description: prodData.description || '',
      price: prodData.price || 0,
      comparePrice: prodData.comparePrice,
      imageUrl: prodData.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      tags: prodData.tags || [],
      isFeatured: prodData.isFeatured || false,
      isAvailable: prodData.isAvailable ?? true,
      sku: prodData.sku,
      unit: prodData.unit,
      createdAt: new Date().toISOString(),
    };
    await DataService.saveProduct(newProd);
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === newProd.id);
      if (exists) return prev.map((p) => (p.id === newProd.id ? newProd : p));
      return [...prev, newProd];
    });
    showSyncToast(`Producto "${newProd.name}" creado.`);
    return newProd;
  };

  const updateProduct = async (prod: Product): Promise<void> => {
    await DataService.saveProduct(prod);
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
    showSyncToast(`Producto "${prod.name}" actualizado.`);
  };

  const deleteProduct = async (id: string, businessId: string): Promise<void> => {
    await DataService.deleteProduct(id, businessId);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showSyncToast('Producto eliminado.');
  };

  const toggleProductAvailable = async (id: string): Promise<void> => {
    const prod = products.find((p) => p.id === id);
    if (!prod) return;
    await updateProduct({ ...prod, isAvailable: !prod.isAvailable });
  };

  // Category CRUD
  const createCategory = async (catData: Partial<Category>): Promise<Category> => {
    const newCat: Category = {
      id: 'cat-' + Date.now(),
      businessId: catData.businessId || selectedBusinessId,
      name: catData.name || 'Nueva Categoría',
      description: catData.description || '',
      icon: catData.icon || 'Tag',
      sortOrder: catData.sortOrder || categories.length + 1,
      isActive: true,
    };
    await DataService.saveCategory(newCat);
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === newCat.id);
      if (exists) return prev.map((c) => (c.id === newCat.id ? newCat : c));
      return [...prev, newCat];
    });
    showSyncToast(`Categoría "${newCat.name}" agregada.`);
    return newCat;
  };

  const updateCategory = async (cat: Category): Promise<void> => {
    await DataService.saveCategory(cat);
    setCategories((prev) => prev.map((c) => (c.id === cat.id ? cat : c)));
    showSyncToast(`Categoría "${cat.name}" actualizada.`);
  };

  const deleteCategory = async (id: string, businessId: string): Promise<void> => {
    await DataService.deleteCategory(id, businessId);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showSyncToast('Categoría eliminada.');
  };

  // Orders CRUD
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    await DataService.saveOrder(newOrder);
    setOrders((prev) => {
      const exists = prev.some((o) => o.id === newOrder.id);
      if (exists) return prev.map((o) => (o.id === newOrder.id ? newOrder : o));
      return [newOrder, ...prev];
    });
    setLastSupabaseSyncTime(new Date().toLocaleTimeString());
    showSyncToast(`Pedido #${newOrder.id.slice(-6).toUpperCase()} registrado.`);
    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    businessId: string,
    status: Order['status']
  ): Promise<void> => {
    await DataService.updateOrderStatus(orderId, businessId, status);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    setLastSupabaseSyncTime(new Date().toLocaleTimeString());
    showSyncToast(`Estado del pedido actualizado a "${status}".`);
  };

  const deleteOrder = async (orderId: string, businessId: string): Promise<void> => {
    await DataService.deleteOrder(orderId, businessId);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
    showSyncToast(`Pedido eliminado.`);
  };

  // Service Requests (Clientes solicitando catálogo para su negocio)
  const createServiceRequest = async (
    reqData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>
  ): Promise<ServiceRequest> => {
    const newReq: ServiceRequest = {
      ...reqData,
      id: 'req-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await DataService.saveServiceRequest(newReq);
    setServiceRequests((prev) => {
      const exists = prev.some((r) => r.id === newReq.id);
      if (exists) return prev.map((r) => (r.id === newReq.id ? newReq : r));
      return [newReq, ...prev];
    });
    setLastSupabaseSyncTime(new Date().toLocaleTimeString());
    showSyncToast(`Solicitud de ${newReq.businessName} guardada.`);
    return newReq;
  };

  const updateServiceRequestStatus = async (
    id: string,
    status: ServiceRequest['status']
  ): Promise<void> => {
    await DataService.updateServiceRequestStatus(id, status);
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
    showSyncToast(`Solicitud marcada como "${status}".`);
  };

  const deleteServiceRequest = async (id: string): Promise<void> => {
    await DataService.deleteServiceRequest(id);
    setServiceRequests((prev) => prev.filter((r) => r.id !== id));
    showSyncToast('Solicitud eliminada.');
  };

  // App Settings
  const updateAppSettings = async (settings: Partial<AppSettings>): Promise<void> => {
    const updated = { ...appSettings, ...settings };
    setAppSettings(updated);
    await DataService.saveAppSettings(updated);
    showSyncToast('Configuración general actualizada.');
  };

  // Supabase mass sync
  const syncAllToSupabase = async (): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    try {
      const res = await DataService.syncAllToSupabase(
        businesses,
        categories,
        products,
        orders
      );
      const time = new Date().toLocaleTimeString();
      setLastSupabaseSyncTime(time);
      const msg = `Sincronizados ${res.syncedCount} elementos con Supabase PostgreSQL.`;
      showSyncToast(msg);
      return { success: true, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const purgeAllData = async (): Promise<{ success: boolean; deletedCount: number; message: string }> => {
    setIsLoading(true);
    try {
      const res = await DataService.purgeAllData();
      setBusinesses([]);
      setCategories([]);
      setProducts([]);
      setOrders([]);
      setServiceRequests([]);
      setSelectedBusinessId('');
      const msg = `Base de datos limpiada con éxito (${res.deletedCount} registros eliminados).`;
      showSyncToast(msg);
      return { success: true, deletedCount: res.deletedCount, message: msg };
    } finally {
      setIsLoading(false);
    }
  };

  const resetData = async () => {
    await purgeAllData();
  };

  return (
    <BusinessContext.Provider
      value={{
        businesses,
        categories,
        products,
        orders,
        serviceRequests,
        selectedBusinessId,
        activeBusiness,
        isLoading,
        activeView,
        currentPublicSlug,
        lastSupabaseSyncTime,
        lastFirestoreSyncTime: lastSupabaseSyncTime,
        syncNotification,
        goToLanding,
        goToAdmin,
        goToPublicStore,
        openBusinessWebsite,
        setSelectedBusinessId,
        createBusiness,
        updateBusiness,
        deleteBusiness,
        toggleBusinessActive,
        getBusinessBySlug,
        createProduct,
        updateProduct,
        deleteProduct,
        toggleProductAvailable,
        createCategory,
        updateCategory,
        deleteCategory,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        createServiceRequest,
        updateServiceRequestStatus,
        deleteServiceRequest,
        appSettings,
        updateAppSettings,
        syncAllToSupabase,
        syncAllToFirestore: syncAllToSupabase,
        defaultHomePage,
        setDefaultHomePage,
        purgeAllData,
        resetData,
      }}
    >
      {syncNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#16222f] text-white px-4 py-3 rounded-xl shadow-2xl border border-sky-500/30 flex items-center gap-2.5 text-xs font-semibold animate-fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{syncNotification}</span>
        </div>
      )}
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
