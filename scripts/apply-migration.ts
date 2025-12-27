/**
 * Apply Database Migration via Supabase Client
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', override: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function applyMigration() {
    console.log('🔧 Applying database migration...\n')

    // Add display_order column
    console.log('Adding display_order column...')
    let { error: error1 } = await supabase.rpc('exec_sql', {
        sql_query: 'ALTER TABLE public.sponsors ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0'
    })
    if (error1) console.error('Error:', error1.message)
    else console.log('✅ display_order column added')

    // Add description column
    console.log('Adding description column...')
    let { error: error2 } = await supabase.rpc('exec_sql', {
        sql_query: 'ALTER TABLE public.sponsors ADD COLUMN IF NOT EXISTS description TEXT'
    })
    if (error2) console.error('Error:', error2.message)
    else console.log('✅ description column added')

    // Create index
    console.log('Creating index...')
    let { error: error3 } = await supabase.rpc('exec_sql', {
        sql_query: 'CREATE INDEX IF NOT EXISTS idx_sponsors_active_order ON public.sponsors(active, display_order)'
    })
    if (error3) console.error('Error:', error3.message)
    else console.log('✅ Index created')

    console.log('\n✨ Migration applied!')
    console.log('\nNow run: npx tsx scripts/import-sponsors.ts')
}

applyMigration().catch(console.error)
