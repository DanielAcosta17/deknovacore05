-- ==============================================================================
-- D. E. K NovaCore - Esquema de Base de Datos para Supabase (PostgreSQL)
-- ==============================================================================
-- Instrucciones de uso en Supabase:
-- 1. Ve a tu proyecto en Supabase (https://supabase.com/dashboard).
-- 2. En el menú lateral izquierdo, haz clic en "SQL Editor" (ícono de código).
-- 3. Haz clic en "New query".
-- 4. Pega TODO este script y haz clic en "RUN".
-- ==============================================================================

-- 1. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA: Negocios (businesses)
CREATE TABLE IF NOT EXISTS public.businesses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  business_type TEXT DEFAULT 'general',
  tagline TEXT DEFAULT '',
  description TEXT DEFAULT '',
  logo_url TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  whatsapp TEXT DEFAULT '',
  address TEXT DEFAULT '',
  schedule TEXT DEFAULT '',
  website_url TEXT DEFAULT '',
  instagram TEXT DEFAULT '',
  facebook TEXT DEFAULT '',
  tiktok TEXT DEFAULT '',
  primary_color TEXT DEFAULT '#253745',
  secondary_color TEXT DEFAULT '#0ea5e9',
  template TEXT DEFAULT 'general',
  is_active BOOLEAN DEFAULT true,
  currency TEXT DEFAULT '$',
  delivery_available BOOLEAN DEFAULT false,
  delivery_cost NUMERIC(10, 2) DEFAULT 0,
  featured_notice TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABLA: Categorías (categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. TABLA: Productos (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  compare_price NUMERIC(10, 2),
  image_url TEXT DEFAULT '',
  tags JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT false,
  is_available BOOLEAN DEFAULT true,
  sku TEXT DEFAULT '',
  unit TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. TABLA: Pedidos de Carrito / Tienda (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  business_id TEXT NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT DEFAULT '',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'contacted', 'completed', 'cancelled'
  notes TEXT DEFAULT '',
  channel TEXT DEFAULT 'whatsapp',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABLA: Solicitudes de Clientes para su Negocio (service_requests)
-- (Cuando un cliente solicita crear un catálogo o menú para su negocio)
CREATE TABLE IF NOT EXISTS public.service_requests (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT DEFAULT '',
  plan TEXT NOT NULL DEFAULT 'Plan Pro',
  notes TEXT DEFAULT '',
  city TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'contacted', 'approved', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. TABLA: Configuración General (app_settings)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_settings',
  platform_name TEXT DEFAULT 'D. E. K NovaCore',
  owner_whatsapp TEXT DEFAULT '50760244779',
  support_email TEXT DEFAULT 'contacto@deknovacore.com',
  default_home_page TEXT DEFAULT 'landing',
  allow_customer_requests BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insertar configuración inicial por defecto si no existe
INSERT INTO public.app_settings (id, platform_name, owner_whatsapp, support_email, default_home_page, allow_customer_requests)
VALUES ('global_settings', 'D. E. K NovaCore', '50760244779', 'contacto@deknovacore.com', 'landing', true)
ON CONFLICT (id) DO NOTHING;

-- 8. ÍNDICES DE RENDIMIENTO
CREATE INDEX IF NOT EXISTS idx_businesses_slug ON public.businesses(slug);
CREATE INDEX IF NOT EXISTS idx_categories_business ON public.categories(business_id);
CREATE INDEX IF NOT EXISTS idx_products_business ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_orders_business ON public.orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_service_requests_status ON public.service_requests(status);

-- 9. HABILITAR ROW LEVEL SECURITY (RLS)
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- 10. POLÍTICAS DE ACCESO PÚBLICO (ANON) Y AUTENTICADO
-- Permitir lectura y escritura de negocios a usuarios anon (clave pública de la app)
DROP POLICY IF EXISTS "Public access to businesses" ON public.businesses;
CREATE POLICY "Public access to businesses" ON public.businesses
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir lectura y escritura de categorías
DROP POLICY IF EXISTS "Public access to categories" ON public.categories;
CREATE POLICY "Public access to categories" ON public.categories
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir lectura y escritura de productos
DROP POLICY IF EXISTS "Public access to products" ON public.products;
CREATE POLICY "Public access to products" ON public.products
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir a los clientes crear pedidos y al administrador gestionarlos
DROP POLICY IF EXISTS "Public access to orders" ON public.orders;
CREATE POLICY "Public access to orders" ON public.orders
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir a los clientes enviar pedidos de servicios para su negocio
DROP POLICY IF EXISTS "Public access to service_requests" ON public.service_requests;
CREATE POLICY "Public access to service_requests" ON public.service_requests
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Permitir acceso a la configuración
DROP POLICY IF EXISTS "Public access to app_settings" ON public.app_settings;
CREATE POLICY "Public access to app_settings" ON public.app_settings
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 11. BUCKET DE SUPABASE STORAGE PARA IMÁGENES
-- Crea el bucket 'business-assets' público para logos y fotos de productos
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-assets', 'business-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Políticas de storage para subir y descargar imágenes
DROP POLICY IF EXISTS "Public read storage business-assets" ON storage.objects;
CREATE POLICY "Public read storage business-assets" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'business-assets');

DROP POLICY IF EXISTS "Public insert storage business-assets" ON storage.objects;
CREATE POLICY "Public insert storage business-assets" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'business-assets');

DROP POLICY IF EXISTS "Public update storage business-assets" ON storage.objects;
CREATE POLICY "Public update storage business-assets" ON storage.objects
  FOR UPDATE TO anon, authenticated
  USING (bucket_id = 'business-assets');

DROP POLICY IF EXISTS "Public delete storage business-assets" ON storage.objects;
CREATE POLICY "Public delete storage business-assets" ON storage.objects
  FOR DELETE TO anon, authenticated
  USING (bucket_id = 'business-assets');

-- 12. HABILITAR TIEMPO REAL (REALTIME) EN SUPABASE
-- Permite que los cambios se reflejen al instante en la pantalla sin recargar
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.businesses;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.service_requests;
  EXCEPTION
    WHEN duplicate_object THEN
      NULL;
  END;
END $$;

-- 13. CONFIRMACIÓN FINAL
SELECT 'Base de datos Supabase para D. E. K NovaCore configurada exitosamente.' as mensaje;
