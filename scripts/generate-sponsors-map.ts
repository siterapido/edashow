/**
 * Simple Sponsor Logo Mapper
 * Generates sponsors_map.json with standard names (Patrocinador 1, 2, 3...)
 */

import fs from 'fs'
import path from 'path'

interface SponsorMapping {
    filename: string
    name: string
    display_order: number
}

function generateSponsorsMap() {
    console.log('📋 Generating sponsors mapping with standard names...\n')

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

    const sponsors: SponsorMapping[] = files.map((filename, index) => {
        const sponsorNumber = index + 1
        const name = `Patrocinador ${sponsorNumber}`

        console.log(`[${sponsorNumber}/${files.length}] ${filename} → "${name}"`)

        return {
            filename,
            name,
            display_order: sponsorNumber
        }
    })

    // Save the mapping file
    fs.writeFileSync(outputPath, JSON.stringify(sponsors, null, 4))

    console.log('\n' + '='.repeat(60))
    console.log('✨ Mapping Complete!')
    console.log('='.repeat(60))
    console.log(`Total logos: ${files.length}`)
    console.log(`Mapping saved to: ${outputPath}`)
    console.log('\nNext step: Run the import script')
    console.log('  npx tsx scripts/import-sponsors.ts')
}

generateSponsorsMap()
