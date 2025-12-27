/**
 * Quick Database Column Addition Script
 * Adds the new columns to the sponsors table if they don't exist
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', override: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addColumns() {
    console.log('🔧 Adding new columns to sponsors table...\n')

    // First, let's check current table structure
    const { data: existing, error: selectError } = await supabase
        .from('sponsors')
        .select('*')
        .limit(1)

    if (selectError) {
        console.error('Error checking table:', selectError)
        return
    }

    console.log('Current table columns:', existing?.[0] ? Object.keys(existing[0]) : 'No data yet')

    // Check if columns already exist
    const currentColumns = existing?.[0] ? Object.keys(existing[0]) : []
    const needsActive = !currentColumns.includes('active')
    const needsDisplayOrder = !currentColumns.includes('display_order')
    const needsDescription = !currentColumns.includes('description')

    if (!needsActive && !needsDisplayOrder && !needsDescription) {
        console.log('\n✅ All columns already exist!')
        return
    }

    console.log('\n📋 Columns to add:')
    if (needsActive) console.log('  - active (boolean)')
    if (needsDisplayOrder) console.log('  - display_order (integer)')
    if (needsDescription) console.log('  - description (text)')

    console.log('\n⚠️  Note: Supabase client cannot directly ALTER TABLE.')
    console.log('Please run this SQL manually in Supabase SQL Editor:\n')
    console.log('------------------------------------------------------')
    console.log(`
-- Add new columns to sponsors table
ALTER TABLE public.sponsors 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true NOT NULL;

ALTER TABLE public.sponsors 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

ALTER TABLE public.sponsors 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing sponsors to have sequential display_order
UPDATE public.sponsors 
SET display_order = ROW_NUMBER() OVER (ORDER BY created_at)
WHERE display_order = 0 OR display_order IS NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_sponsors_active_order 
ON public.sponsors(active, display_order);
    `)
    console.log('------------------------------------------------------')
    console.log('\nOr visit: ' + supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/sql'))
}

addColumns().catch(console.error)
