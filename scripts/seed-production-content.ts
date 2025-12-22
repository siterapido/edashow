/**
 * Script para popular o banco com conteúdo de produção
 * Baseado nos dados de fallback
 * Usando Local API para evitar problemas de autenticação HTTP
 * 
 * Executa: npx ts-node --esm scripts/seed-production-content.ts
 */

import { getPayload } from 'payload'
import { fallbackPostsFull, fallbackEvents, fallbackSponsors } from '../lib/fallback-data.ts'
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Configurar __dirname para ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Carregar variáveis de ambiente
const envPath = path.resolve(__dirname, '../.env')
const envLocalPath = path.resolve(__dirname, '../.env.local')
console.log(`🔍 Carregando env de: ${envPath} (${fs.existsSync(envPath) ? 'existe' : 'NÃO EXISTE'})`)
console.log(`🔍 Carregando env local de: ${envLocalPath} (${fs.existsSync(envLocalPath) ? 'existe' : 'NÃO EXISTE'})`)

dotenv.config({ path: envPath })
dotenv.config({ path: envLocalPath })

if (process.env.DATABASE_URI) {
    const match = process.env.DATABASE_URI.match(/\/([^/?]+)(\?|$)/)
    if (match && match[1]) {
        process.env.PGDATABASE = match[1]
        console.log(`🔍 PGDATABASE explicitamente configurada como: ${process.env.PGDATABASE}`)
    }
}

console.log(`🔍 DATABASE_URI detectada: ${process.env.DATABASE_URI ? 'SIM (presente)' : 'NÃO (ausente)'}`)
if (process.env.DATABASE_URI) {
    const masked = process.env.DATABASE_URI.replace(/:([^@]+)@/, ':****@')
    console.log(`🔍 DATABASE_URI (masked): ${masked}`)
}

async function uploadLocalImage(
    payload: any,
    localPath: string,
    alt?: string,
    caption?: string
): Promise<string | null> {
    try {
        const cleanPath = localPath.split('?')[0]
        let fullPath = ''
        if (cleanPath.startsWith('/')) {
            fullPath = path.join(process.cwd(), 'public', cleanPath)
        } else {
            fullPath = cleanPath
        }

        if (!fs.existsSync(fullPath)) {
            console.warn(`⚠️ Arquivo não encontrado: ${fullPath} (Original: ${localPath})`)
            return null
        }

        const fileBuffer = fs.readFileSync(fullPath)
        const filename = path.basename(cleanPath)
        const ext = path.extname(filename).toLowerCase()

        let mimeType = 'image/jpeg'
        if (ext === '.png') mimeType = 'image/png'
        else if (ext === '.webp') mimeType = 'image/webp'
        else if (ext === '.gif') mimeType = 'image/gif'
        else if (ext === '.svg') mimeType = 'image/svg+xml'

        // Check if media already exists (optional, but good)
        // For now, just create new one to ensure IDs match what we expect or just simpler
        // Or we could check by filename?

        const media = await payload.create({
            collection: 'media',
            data: {
                alt: alt || '',
                caption: caption || '',
            },
            file: {
                data: fileBuffer,
                name: filename,
                mimetype: mimeType,
                size: fileBuffer.length,
            }
        })

        return media.id
    } catch (error) {
        console.error(`Erro ao fazer upload de ${localPath}:`, error)
        return null
    }
}

function createLexicalContent(text: string): any {
    const paragraphs = text.split('\n\n').filter(p => p.trim())
    return {
        root: {
            children: paragraphs.map(paragraph => ({
                children: [
                    {
                        detail: 0,
                        format: 0,
                        mode: 'normal',
                        style: '',
                        text: paragraph.trim(),
                        type: 'text',
                        version: 1,
                    },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                type: 'paragraph',
                version: 1,
            })),
            direction: 'ltr',
            format: '',
            indent: 0,
            type: 'root',
            version: 1,
        },
    }
}

async function main() {
    console.log('🚀 Iniciando seed de conteúdo (Local API)...')

    try {
        // Importar config dinamicamente após carregar envs
        const configModule = await import('../payload.config.js')
        const config = configModule.default

        const payload = await getPayload({ config })

        // 1. Sponsors
        console.log('\n🏢 Processando Patrocinadores...')
        for (const sponsor of fallbackSponsors) {
            console.log(`  Processando: ${sponsor.name}`)

            // Check if exists
            const existing = await payload.find({
                collection: 'sponsors',
                where: { name: { equals: sponsor.name } }
            })

            let logoId = null
            if (sponsor.logo) {
                logoId = await uploadLocalImage(payload, sponsor.logo, sponsor.name)
            }

            if (!logoId && existing.docs.length === 0) {
                console.warn(`  ⚠️ Sem logo para ${sponsor.name}, criando sem logo`)
            }

            const data = {
                name: sponsor.name,
                logo: logoId || undefined,
                website: sponsor.website,
                active: sponsor.active
            }

            if (existing.docs.length > 0) {
                // Update
                await payload.update({
                    collection: 'sponsors',
                    id: existing.docs[0].id,
                    data: data
                })
                console.log('  ✅ Atualizado')
            } else {
                // Create
                if (!data.logo && !logoId) {
                    // If required field logo is missing, skip or mock?
                    // Assuming config doesn't enforce required strictly or we skip
                    // But sponsor.tsx needs logo. 
                    // We will just try create
                }
                await payload.create({
                    collection: 'sponsors',
                    data: data
                })
                console.log('  ✅ Criado')
            }
        }

        // 2. Events
        console.log('\n📅 Processando Eventos...')
        for (const event of fallbackEvents) {
            console.log(`  Processando: ${event.title}`)
            const existing = await payload.find({
                collection: 'events',
                where: { slug: { equals: event.slug } }
            })

            let imageId = null
            if (event.image) {
                imageId = await uploadLocalImage(payload, event.image, event.title)
            }

            const sponsors = await Promise.all(
                (event.sponsors || []).map(async (s) => {
                    let sLogoId = null
                    if (s.logo) sLogoId = await uploadLocalImage(payload, s.logo, s.name)
                    return { ...s, logo: sLogoId }
                })
            )

            const speakers = await Promise.all(
                (event.speakers || []).map(async (s) => {
                    let sPhotoId = null
                    if (s.photo) sPhotoId = await uploadLocalImage(payload, s.photo, s.name)
                    return { ...s, photo: sPhotoId }
                })
            )

            const organizers = await Promise.all(
                (event.organizers || []).map(async (o) => {
                    let oPhotoId = null
                    if (o.photo) oPhotoId = await uploadLocalImage(payload, o.photo, o.name)
                    return { ...o, photo: oPhotoId }
                })
            )

            const data = {
                ...event,
                image: imageId || undefined,
                sponsors,
                speakers,
                organizers
            }

            if (existing.docs.length > 0) {
                await payload.update({
                    collection: 'events',
                    id: existing.docs[0].id,
                    data: data
                })
                console.log('  ✅ Atualizado')
            } else {
                await payload.create({
                    collection: 'events',
                    data: data
                })
                console.log('  ✅ Criado')
            }
        }

        // 3. Posts
        console.log('\n📝 Processando Posts...')
        const slugs = Object.keys(fallbackPostsFull)
        for (const slug of slugs) {
            const post = fallbackPostsFull[slug]
            console.log(`  Processando: ${post.title}`)

            const existing = await payload.find({
                collection: 'posts',
                where: { slug: { equals: slug } }
            })

            let imageId = null
            if (post.featuredImage) {
                imageId = await uploadLocalImage(payload, post.featuredImage, post.title)
            }

            let authorId = null
            if (post.author?.name) {
                const authorSlug = post.author.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
                const existingAuthor = await payload.find({
                    collection: 'columnists',
                    where: { slug: { equals: authorSlug } }
                })

                if (existingAuthor.docs.length > 0) {
                    authorId = existingAuthor.docs[0].id
                } else {
                    const newAuthor = await payload.create({
                        collection: 'columnists',
                        data: {
                            name: post.author.name,
                            slug: authorSlug,
                            role: post.author.role
                            // add photo if needed
                        }
                    })
                    authorId = newAuthor.id
                }
            }

            const data = {
                title: post.title,
                slug: slug,
                excerpt: post.excerpt,
                content: post.content && post.content.root ? post.content : createLexicalContent(post.excerpt || ''),
                category: post.category,
                featuredImage: imageId || undefined,
                author: authorId || undefined,
                status: 'published',
                publishedDate: post.publishedDate,
                featured: post.featured,
                tags: post.tags,
                sourceUrl: post.sourceUrl
            }

            if (existing.docs.length > 0) {
                await payload.update({
                    collection: 'posts',
                    id: existing.docs[0].id,
                    data: data
                })
                console.log('  ✅ Atualizado')
            } else {
                await payload.create({
                    collection: 'posts',
                    data: data
                })
                console.log('  ✅ Criado')
            }
        }

        console.log('\n✨ Seed concluído com sucesso!')
        process.exit(0)
    } catch (error) {
        console.error('❌ Erro fatal no seed:', error)
        process.exit(1)
    }
}

main()
