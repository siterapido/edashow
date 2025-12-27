-- Add site configuration fields to theme_settings table
-- Migration: Add fields for site name, slogan, typography, SEO, analytics, and logo

-- Add site configuration columns
ALTER TABLE theme_settings
ADD COLUMN IF NOT EXISTS site_name TEXT DEFAULT 'EDA Show',
ADD COLUMN IF NOT EXISTS site_slogan TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS site_description TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS site_favicon_url TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_address TEXT;

-- Add SEO and Analytics columns
ALTER TABLE theme_settings
ADD COLUMN IF NOT EXISTS seo_keywords TEXT,
ADD COLUMN IF NOT EXISTS google_analytics_id TEXT,
ADD COLUMN IF NOT EXISTS google_tag_manager_id TEXT;

-- Add maintenance mode columns
ALTER TABLE theme_settings
ADD COLUMN IF NOT EXISTS maintenance_mode BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS maintenance_message TEXT DEFAULT 'Site em manutenção. Voltamos em breve!';

-- Add footer columns
ALTER TABLE theme_settings
ADD COLUMN IF NOT EXISTS footer_text TEXT,
ADD COLUMN IF NOT EXISTS footer_copyright TEXT;

-- Add typography columns
ALTER TABLE theme_settings
ADD COLUMN IF NOT EXISTS font_heading TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS font_body TEXT DEFAULT 'Inter',
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Add secondary color column
ALTER TABLE theme_settings
ADD COLUMN IF NOT EXISTS light_secondary TEXT DEFAULT '#F97316',
ADD COLUMN IF NOT EXISTS dark_primary TEXT DEFAULT '#FF6F00',
ADD COLUMN IF NOT EXISTS dark_secondary TEXT DEFAULT '#FB923C';

-- Update the existing row with default values if they exist
UPDATE theme_settings 
SET 
  site_name = COALESCE(site_name, 'EDA Show'),
  font_heading = COALESCE(font_heading, 'Inter'),
  font_body = COALESCE(font_body, 'Inter')
WHERE id IS NOT NULL;

