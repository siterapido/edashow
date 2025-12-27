# 🚀 Automated Sponsor Setup Guide

This guide will help you automatically register all sponsor logos in the database using AI-powered name extraction.

## Prerequisites

- Google Gemini API key (get one at: https://makersuite.google.com/app/apikey)
- All sponsor logos in `LOGOS PATROCINADORES/` directory (✅ 43 logos found)

## Step 1: Add Google API Key

Add this line to your `.env.local` file:

```bash
GOOGLE_API_KEY=your_api_key_here
```

Or alternatively use `GEMINI_API_KEY` if you prefer.

## Step 2: Run Database Migration

The database needs new columns (`active`, `display_order`, `description`). Run this SQL in your Supabase SQL Editor:

**Supabase SQL Editor URL:** https://exeuuqbgyfaxgbwygfuu.supabase.co/project/_/sql

```sql
-- Add new columns to sponsors table
ALTER TABLE public.sponsors 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true NOT NULL;

ALTER TABLE public.sponsors 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE public.sponsors 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing sponsors to have sequential display_order
DO $$
DECLARE
    sponsor_record RECORD;
    counter INTEGER := 1;
BEGIN
    FOR sponsor_record IN 
        SELECT id FROM public.sponsors ORDER BY created_at
    LOOP
        UPDATE public.sponsors 
        SET display_order = counter 
        WHERE id = sponsor_record.id AND (display_order = 0 OR display_order IS NULL);
        counter := counter + 1;
    END LOOP;
END $$;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_sponsors_active_order 
ON public.sponsors(active, display_order);
```

## Step 3: Run AI Logo Analysis

This will analyze all 43 logos and extract company names automatically:

```bash
npx tsx scripts/analyze-sponsor-logos.ts
```

Expected output:
- Generates `scripts/sponsors_map.json` with all company names
- Uses AI to read text from logos
- Falls back to filename for logos without text

## Step 4: Import to Database

Upload logos to Supabase storage and register in database:

```bash
npx tsx scripts/import-sponsors.ts
```

This will:
- Process and optimize each logo (resize, trim whitespace)
- Upload to Supabase `sponsors` bucket
- Create database records with all fields
- Set display_order automatically

## Step 5: Manage in Admin

Navigate to: http://localhost:3000/cms/sponsors

Features:
- ✅ Upload new sponsor logos
- ✅ Edit sponsor details
- ✅ Toggle active/inactive status
- ✅ Reorder sponsors
- ✅ Delete sponsors

## Step 6: Deploy to Production

After testing locally:

```bash
git add .
git commit -m "feat: automated sponsor management system"
git push origin main
```

Your hosting platform will automatically deploy the changes.

## Troubleshooting

### "Cannot find module @google/generative-ai"

Run: `npm install @google/generative-ai`

### API Rate Limits

The script includes a 500ms delay between API calls to respect rate limits.

### Logos not appearing

1. Check Supabase storage bucket `sponsors` is public
2. Verify logo URLs in database include the full path
3. Clear browser cache

## What Was Built

### Database Changes
- `active` column to show/hide sponsors
- `display_order` column for custom ordering
- `description` column for future use

### AI Analysis Script
- `scripts/analyze-sponsor-logos.ts` - Extracts company names using Google Gemini
- Processes all image formats (png, jpg, jpeg, webp, gif)
- Generates accurate company names automatically

### Import Script Enhancements
- `scripts/import-sponsors.ts` - Enhanced with new fields
- Image optimization (resize to 500x300, trim whitespace)
- Progress reporting

### Admin Interface
- `app/cms/sponsors/page.tsx` - Completely redesigned
- Direct logo upload with preview
- Active/inactive toggle switch
- Better UI/UX with icons and colors

### Server Actions
- `lib/actions/cms-sponsors.ts` - New functions:
  - `uploadSponsorLogo()` - Handle file uploads
  - `toggleSponsorActive()` - Toggle visibility
  - `getSponsor()` - Get single sponsor
  - `updateSponsorOrder()` - Batch update order
