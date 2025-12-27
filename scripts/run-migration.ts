import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local', override: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
    console.log('Running database migration...')

    const migrationPath = path.join(process.cwd(), 'supabase/migrations/20250127000000_enhance_sponsors.sql')
    const sql = fs.readFileSync(migrationPath, 'utf-8')

    // Split by statement and execute each
    const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'))

    for (const statement of statements) {
        // Skip DO blocks as they need to be executed as a whole
        if (statement.includes('DO $$')) {
            const fullStatement = sql.substring(
                sql.indexOf('DO $$'),
                sql.indexOf('END $$;') + 7
            )
            console.log('Executing DO block...')
            const { error } = await supabase.rpc('exec_sql', { sql_query: fullStatement })
            if (error) {
                console.error('Error executing DO block:', error)
            } else {
                console.log('✓ DO block executed')
            }
            continue
        }

        if (statement.trim().length === 0) continue

        console.log(`Executing: ${statement.substring(0, 60)}...`)
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement })

        if (error && !error.message?.includes('already exists')) {
            console.error('Error:', error)
        } else {
            console.log('✓')
        }
    }

    console.log('\n✨ Migration completed!')
    console.log('\nNext: Run the AI logo analysis script')
    console.log('  npx tsx scripts/analyze-sponsor-logos.ts')
}

runMigration().catch(console.error)
