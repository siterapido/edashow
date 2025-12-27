/**
 * AI-Powered Sponsor Logo Analyzer
 * 
 * This script analyzes sponsor logos using Google Gemini AI to automatically
 * extract company names and generate the sponsors mapping file.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local', override: true })
dotenv.config({ path: '.env', override: false })

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY

if (!GOOGLE_API_KEY) {
    console.error('Error: GOOGLE_API_KEY or GEMINI_API_KEY is required in .env or .env.local')
    console.error('Get your API key from: https://makersuite.google.com/app/apikey')
    process.exit(1)
}

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)

interface SponsorMapping {
    filename: string
    name: string
}

/**
 * Analyzes a logo image using AI and extracts the company name
 */
async function analyzeLogoWithAI(filePath: string): Promise<string | null> {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        // Read the image file
        const imageBuffer = fs.readFileSync(filePath)
        const base64Image = imageBuffer.toString('base64')

        const ext = path.extname(filePath).toLowerCase()
        let mimeType = 'image/png'
        if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg'
        else if (ext === '.webp') mimeType = 'image/webp'
        else if (ext === '.gif') mimeType = 'image/gif'

        const prompt = `Analyze this company logo and extract ONLY the company name or brand name visible in the image.

Rules:
1. Return ONLY the company/brand name, nothing else
2. Do NOT include words like "Logo", "Company", "Inc", "Ltda", etc. unless they are part of the brand name
3. Preserve the exact capitalization and formatting as shown in the logo
4. If there are multiple text elements, return only the main company name
5. If the logo is purely graphical with no text, describe what type of business it might be (e.g., "Health Insurance", "Medical Center")
6. Be concise - maximum 50 characters

Company name:`

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            }
        ])

        const response = await result.response
        const text = response.text().trim()

        // Clean up the response
        let companyName = text
            .replace(/^["']|["']$/g, '') // Remove quotes
            .replace(/\n/g, ' ') // Replace newlines with spaces
            .trim()

        return companyName || null
    } catch (error) {
        console.error(`Error analyzing ${filePath}:`, error)
        return null
    }
}

/**
 * Fallback: Extract a reasonable name from the filename
 */
function getNameFromFilename(filename: string): string {
    const nameWithoutExt = path.parse(filename).name

    // If it's just a number, return a generic name
    if (/^\d+$/.test(nameWithoutExt)) {
        return `Sponsor ${nameWithoutExt}`
    }

    // Otherwise clean up the filename
    return nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Main function to analyze all logos
 */
async function analyzeAllLogos() {
    console.log('🤖 Starting AI-powered logo analysis...\n')

    const logosDir = path.join(process.cwd(), 'LOGOS PATROCINADORES')
    const outputPath = path.join(process.cwd(), 'scripts', 'sponsors_map.json')

    if (!fs.existsSync(logosDir)) {
        console.error(`Error: Directory not found: ${logosDir}`)
        process.exit(1)
    }

    // Get all image files
    const files = fs.readdirSync(logosDir)
        .filter(file => /\.(png|jpg|jpeg|gif|webp)$/i.test(file))
        .sort((a, b) => {
            // Sort numerically if filenames are numbers
            const numA = parseInt(path.parse(a).name)
            const numB = parseInt(path.parse(b).name)
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB
            }
            return a.localeCompare(b)
        })

    console.log(`Found ${files.length} logo files\n`)

    const sponsors: SponsorMapping[] = []
    let successCount = 0
    let fallbackCount = 0

    for (let i = 0; i < files.length; i++) {
        const filename = files[i]
        const filePath = path.join(logosDir, filename)

        process.stdout.write(`[${i + 1}/${files.length}] Analyzing ${filename}... `)

        let companyName = await analyzeLogoWithAI(filePath)

        if (!companyName) {
            companyName = getNameFromFilename(filename)
            console.log(`⚠️  Fallback: "${companyName}"`)
            fallbackCount++
        } else {
            console.log(`✅ "${companyName}"`)
            successCount++
        }

        sponsors.push({
            filename,
            name: companyName
        })

        // Small delay to respect API rate limits
        if (i < files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500))
        }
    }

    // Save the mapping file
    fs.writeFileSync(outputPath, JSON.stringify(sponsors, null, 4))

    console.log('\n' + '='.repeat(60))
    console.log('✨ Analysis Complete!')
    console.log('='.repeat(60))
    console.log(`Total logos: ${files.length}`)
    console.log(`AI extracted: ${successCount}`)
    console.log(`Fallback names: ${fallbackCount}`)
    console.log(`\nMapping saved to: ${outputPath}`)
    console.log('\nNext step: Run the import script to upload to database')
    console.log('  npx tsx scripts/import-sponsors.ts')
}

// Run the analysis
analyzeAllLogos().catch(console.error)
