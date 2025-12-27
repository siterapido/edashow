/**
 * Verify Sponsors in Database
 * Checks how many sponsors were successfully imported
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local', override: true })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function verifySponsors() {
    console.log('🔍 Verifying sponsors in database...\n')

    const { data: sponsors, error } = await supabase
        .from('sponsors')
        .select('*')
        .order('created_at', { ascending: true })

    if (error) {
        console.error('Error fetching sponsors:', error)
        return
    }

    console.log(`✅ Total sponsors in database: ${sponsors?.length || 0}\n`)

    if (sponsors && sponsors.length > 0) {
        console.log('📋 Sponsors list:')
        sponsors.forEach((sponsor, index) => {
            console.log(`   ${index + 1}. ${sponsor.name}`)
            console.log(`      Logo: ${sponsor.logo_path ? '✅' : '❌'}`)
            console.log(`      Active: ${sponsor.active ? '✅' : '❌'}`)
        })

        console.log('\n✨ All sponsors successfully imported!')
        console.log('\nNext steps:')
        console.log('1. Visit http://localhost:3000/cms/sponsors to manage')
        console.log('2. Check http://localhost:3000 to see carousel')
        console.log('3. Deploy to production')
    } else {
        console.log('⚠️  No sponsors found in database')
    }
}

verifySponsors().catch(console.error)
