-- =============================================
-- PANORA EXPORTS B2B PLATFORM - DATABASE SCHEMA
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    role VARCHAR(20) NOT NULL CHECK (role IN ('BUYER', 'SELLER')),
    company_name VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    verification_documents TEXT[],
    verification_notes TEXT,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    price DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    unit VARCHAR(50),
    minimum_order_quantity INTEGER,
    images TEXT[],
    specifications JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- RFQ (REQUEST FOR QUOTATION) TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.rfqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    quantity INTEGER,
    unit VARCHAR(50),
    target_price DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    delivery_location VARCHAR(255),
    delivery_date DATE,
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'CLOSED', 'ACCEPTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- QUOTATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.quotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfq_id UUID NOT NULL REFERENCES public.rfqs(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    delivery_time VARCHAR(100),
    terms TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    seller_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED')),
    payment_status VARCHAR(20) DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')),
    shipping_address TEXT,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- VERIFICATION REQUESTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS public.verification_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- GST, EIN, VAT, ABN, etc.
    document_number VARCHAR(100) NOT NULL,
    document_url TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_verification_status ON public.users(verification_status);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON public.products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_rfqs_buyer_id ON public.rfqs(buyer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_rfq_id ON public.quotations(rfq_id);
CREATE INDEX IF NOT EXISTS idx_quotations_seller_id ON public.quotations(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_user_id ON public.verification_requests(user_id);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Users: Can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Products: Anyone can view active products, sellers can manage their own
CREATE POLICY "Anyone can view active products" ON public.products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Sellers can insert own products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own products" ON public.products
    FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own products" ON public.products
    FOR DELETE USING (auth.uid() = seller_id);

-- RFQs: Buyers can manage their own, sellers can view all open RFQs
CREATE POLICY "Buyers can view own RFQs" ON public.rfqs
    FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view open RFQs" ON public.rfqs
    FOR SELECT USING (status = 'OPEN');

CREATE POLICY "Buyers can insert own RFQs" ON public.rfqs
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Buyers can update own RFQs" ON public.rfqs
    FOR UPDATE USING (auth.uid() = buyer_id);

-- Quotations: Sellers can manage their own, buyers can view quotations for their RFQs
CREATE POLICY "Sellers can insert quotations" ON public.quotations
    FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can view own quotations" ON public.quotations
    FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Buyers can view quotations for their RFQs" ON public.quotations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.rfqs
            WHERE rfqs.id = quotations.rfq_id
            AND rfqs.buyer_id = auth.uid()
        )
    );

-- Orders: Buyers and sellers can view their own orders
CREATE POLICY "Buyers can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view own orders" ON public.orders
    FOR SELECT USING (auth.uid() = seller_id);

-- Verification Requests: Users can view and create their own requests
CREATE POLICY "Users can view own verification requests" ON public.verification_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create verification requests" ON public.verification_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON public.rfqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON public.quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON public.verification_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- SEED DEFAULT CATEGORIES
-- =============================================
INSERT INTO public.categories (name, description) VALUES
    ('Textiles', 'Premium fabrics, garments, and textile products'),
    ('Agriculture', 'Organic produce, grains, and agricultural products'),
    ('Hardware', 'Construction materials, tools, and metal products'),
    ('Handicrafts', 'Traditional Indian handicrafts and artisan products'),
    ('Spices', 'Authentic Indian spices and seasonings'),
    ('Leather Goods', 'Premium leather products and accessories'),
    ('Gems & Jewelry', 'Fine jewelry and precious stones'),
    ('Ayurveda & Wellness', 'Natural health and wellness products')
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- STORAGE BUCKET SETUP
-- =============================================
-- Note: Run this in Supabase Dashboard SQL Editor or via API
-- This creates a public bucket for document uploads

INSERT INTO storage.buckets (id, name, public)
VALUES ('panora-documents', 'panora-documents', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Authenticated users can upload to their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'panora-documents' AND
    (storage.foldername(name))[1] = 'verification' AND
    (storage.foldername(name))[2] = auth.uid()::text
);

-- Storage policy: Users can view their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
    bucket_id = 'panora-documents' AND
    (storage.foldername(name))[1] = 'verification' AND
    (storage.foldername(name))[2] = auth.uid()::text
);
