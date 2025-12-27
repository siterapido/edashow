-- Migration: Create image_settings table for automatic image optimization configuration
-- Created at: 2025-12-27

-- Create image_settings table
CREATE TABLE IF NOT EXISTS public.image_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Optimization settings
    enabled BOOLEAN DEFAULT true,
    format TEXT DEFAULT 'webp' CHECK (format IN ('webp', 'jpeg', 'png')),
    quality INTEGER DEFAULT 85 CHECK (quality >= 1 AND quality <= 100),
    max_width INTEGER DEFAULT 1920,
    max_height INTEGER DEFAULT 1080,
    
    -- Watermark settings
    watermark_enabled BOOLEAN DEFAULT false,
    watermark_logo_url TEXT,
    watermark_position TEXT DEFAULT 'bottom-right' CHECK (watermark_position IN ('top-left', 'top-right', 'bottom-left', 'bottom-right', 'center')),
    watermark_opacity INTEGER DEFAULT 50 CHECK (watermark_opacity >= 1 AND watermark_opacity <= 100),
    watermark_size INTEGER DEFAULT 15 CHECK (watermark_size >= 5 AND watermark_size <= 50),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO public.image_settings (id)
VALUES (gen_random_uuid())
ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE public.image_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.image_settings
    FOR SELECT USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON public.image_settings
    FOR UPDATE USING (true);

-- Comment on table
COMMENT ON TABLE public.image_settings IS 'Configuration for automatic image optimization and watermarking';
