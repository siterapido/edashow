import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.resolve(__dirname, '../.env') })

console.log('Testing connection to:', process.env.DATABASE_URI?.replace(/:([^@]+)@/, ':****@'))

async function test() {
    const client = new pg.Client({
        connectionString: process.env.DATABASE_URI,
        ssl: {
            rejectUnauthorized: false
        }
    })

    try {
        await client.connect()
        console.log('✅ Connected successfully!')
        const res = await client.query('SELECT current_database(), current_user')
        console.log('Results:', res.rows[0])
        await client.end()
    } catch (err) {
        console.error('❌ Connection failed:', err)
        process.exit(1)
    }
}

test()
