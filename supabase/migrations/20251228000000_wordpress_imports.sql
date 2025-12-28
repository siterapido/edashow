-- Migration: Create WordPress Imports Tracking Table
-- This table tracks posts imported from WordPress to prevent duplicates
-- and allow for updates/syncing.

-- Create the wordpress_imports table
CREATE TABLE IF NOT EXISTS public.wordpress_imports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- WordPress source information
    wp_post_id BIGINT NOT NULL,
    wp_site_url TEXT NOT NULL,
    
    -- Local post reference
    local_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
    
    -- Import metadata
    imported_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'success' CHECK (status IN ('success', 'error')),
    error_message TEXT,
    
    -- Ensure unique combination of WP post ID and site URL
    UNIQUE(wp_post_id, wp_site_url)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_wordpress_imports_wp_post 
    ON public.wordpress_imports(wp_post_id, wp_site_url);

CREATE INDEX IF NOT EXISTS idx_wordpress_imports_local_post 
    ON public.wordpress_imports(local_post_id);

CREATE INDEX IF NOT EXISTS idx_wordpress_imports_status 
    ON public.wordpress_imports(status);

CREATE INDEX IF NOT EXISTS idx_wordpress_imports_imported_at 
    ON public.wordpress_imports(imported_at DESC);

-- Enable RLS
ALTER TABLE public.wordpress_imports ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users with admin role can read imports
CREATE POLICY "Admins can read wordpress_imports"
    ON public.wordpress_imports
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Policy: System can insert/update (via service role)
-- Note: The API routes will use the service role key for import operations

-- Add comment to table
COMMENT ON TABLE public.wordpress_imports IS 'Tracks posts imported from WordPress sites to prevent duplicates and enable syncing';
COMMENT ON COLUMN public.wordpress_imports.wp_post_id IS 'The post ID from the WordPress source';
COMMENT ON COLUMN public.wordpress_imports.wp_site_url IS 'The base URL of the WordPress site';
COMMENT ON COLUMN public.wordpress_imports.local_post_id IS 'Reference to the local posts table';
