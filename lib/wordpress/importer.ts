/**
 * WordPress Import Service
 * 
 * Handles the core logic for importing posts from WordPress,
 * including image processing and content sanitization.
 */

import { createClient } from '@/lib/supabase/server'
import { getPublicSupabaseClient } from '@/lib/supabase/public-client'
import {
    WordPressImportPayload,
    WordPressPostData,
    WordPressMedia,
    ImportResponse,
    ProcessedImage,
} from './types'
import { slugify } from '@/lib/utils'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://edashow.com.br'

// ============================================================================
// Main Import Function
// ============================================================================

export async function importWordPressPost(
    payload: WordPressImportPayload
): Promise<ImportResponse> {
    const supabase = await createClient()
    const { site_url, action = 'create', post } = payload

    try {
        // Check for existing import
        const existingImport = await getExistingImport(supabase, post.wp_id, site_url)

        if (action === 'delete') {
            return await handleDelete(supabase, existingImport?.local_post_id)
        }

        // Process featured image
        let coverImageUrl: string | null = null
        let imagesProcessed = 0

        if (post.featured_image?.url) {
            const processed = await processImage(supabase, post.featured_image.url, post.slug)
            if (processed) {
                coverImageUrl = processed.new_url
                imagesProcessed++
            }
        }

        // Process inline images and update content
        let processedContent = post.content
        if (post.inline_images && post.inline_images.length > 0) {
            const result = await processInlineImages(supabase, post.content, post.inline_images, post.slug)
            processedContent = result.content
            imagesProcessed += result.count
        }

        // Map or create category
        let categoryId: string | undefined
        if (post.categories && post.categories.length > 0) {
            categoryId = await mapOrCreateCategory(supabase, post.categories[0])
        }

        // Process tags
        const tags = post.tags || []

        // Prepare post data
        const postData = {
            title: post.title,
            slug: await ensureUniqueSlug(supabase, post.slug, existingImport?.local_post_id),
            content: sanitizeContent(processedContent),
            excerpt: post.excerpt || extractExcerpt(processedContent),
            cover_image_url: coverImageUrl,
            category_id: categoryId,
            tags: tags,
            status: post.status || 'draft',
            published_at: post.published_at || new Date().toISOString(),
            source_url: `${site_url}/?p=${post.wp_id}`,
            // SEO meta
            ...(post.meta?.seo_title && { seo_title: post.meta.seo_title }),
            ...(post.meta?.seo_description && { seo_description: post.meta.seo_description }),
        }

        let localPostId: string
        let wasUpdate = false

        if (existingImport && (action === 'update' || existingImport.local_post_id)) {
            // Update existing post
            const { data, error } = await supabase
                .from('posts')
                .update(postData)
                .eq('id', existingImport.local_post_id)
                .select('id, slug')
                .single()

            if (error) throw error
            localPostId = data.id
            wasUpdate = true
        } else {
            // Create new post
            const { data, error } = await supabase
                .from('posts')
                .insert([postData])
                .select('id, slug')
                .single()

            if (error) throw error
            localPostId = data.id
        }

        // Record import
        await recordImport(supabase, {
            wp_post_id: post.wp_id,
            wp_site_url: site_url,
            local_post_id: localPostId,
            status: 'success',
        })

        return {
            success: true,
            message: wasUpdate ? 'Post atualizado com sucesso' : 'Post importado com sucesso',
            data: {
                post_id: localPostId,
                slug: postData.slug,
                url: `${SITE_URL}/posts/${postData.slug}`,
                images_processed: imagesProcessed,
                category_id: categoryId,
                was_update: wasUpdate,
            },
        }
    } catch (error: any) {
        console.error('WordPress import error:', error)

        // Record failed import
        await recordImport(supabase, {
            wp_post_id: post.wp_id,
            wp_site_url: site_url,
            local_post_id: null,
            status: 'error',
            error_message: error.message,
        })

        return {
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: error.message || 'Erro ao importar post',
            },
        }
    }
}

// ============================================================================
// Image Processing
// ============================================================================

async function processImage(
    supabase: any,
    imageUrl: string,
    postSlug: string
): Promise<ProcessedImage | null> {
    try {
        // Download image
        const response = await fetch(imageUrl, {
            headers: {
                'User-Agent': 'EdaShow-Import/1.0',
            },
        })

        if (!response.ok) {
            console.error(`Failed to download image: ${imageUrl}`)
            return null
        }

        const buffer = await response.arrayBuffer()
        const contentType = response.headers.get('content-type') || 'image/jpeg'

        // Determine file extension
        const extMap: Record<string, string> = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/webp': 'webp',
            'image/gif': 'gif',
        }
        const ext = extMap[contentType] || 'jpg'

        // Generate unique filename
        const timestamp = Date.now()
        const filename = `wp-import/${postSlug}/${timestamp}.${ext}`

        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
            .from('media')
            .upload(filename, buffer, {
                contentType,
                upsert: true,
            })

        if (error) {
            console.error('Storage upload error:', error)
            return null
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('media')
            .getPublicUrl(filename)

        return {
            original_url: imageUrl,
            new_url: urlData.publicUrl,
            storage_path: filename,
        }
    } catch (error) {
        console.error(`Error processing image ${imageUrl}:`, error)
        return null
    }
}

async function processInlineImages(
    supabase: any,
    content: string,
    inlineImages: { original_url: string; alt?: string }[],
    postSlug: string
): Promise<{ content: string; count: number }> {
    let processedContent = content
    let count = 0

    for (const img of inlineImages) {
        const processed = await processImage(supabase, img.original_url, postSlug)
        if (processed) {
            // Replace URL in content
            processedContent = processedContent.replace(
                new RegExp(escapeRegExp(img.original_url), 'g'),
                processed.new_url
            )
            count++
        }
    }

    return { content: processedContent, count }
}

function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// ============================================================================
// Category Mapping
// ============================================================================

async function mapOrCreateCategory(
    supabase: any,
    categoryName: string
): Promise<string | undefined> {
    // Try to find existing category
    const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', categoryName)
        .single()

    if (existing) {
        return existing.id
    }

    // Create new category
    const { data: newCategory, error } = await supabase
        .from('categories')
        .insert([{
            name: categoryName,
            slug: slugify(categoryName),
            display_order: 99,
        }])
        .select('id')
        .single()

    if (error) {
        console.error('Error creating category:', error)
        return undefined
    }

    return newCategory.id
}

// ============================================================================
// Content Sanitization
// ============================================================================

function sanitizeContent(html: string): string {
    // Remove WordPress-specific blocks/comments
    // Using [\s\S] instead of 's' flag for broader compatibility
    let cleaned = html
        .replace(/<!-- wp:[\s\S]*?-->/g, '')
        .replace(/<!-- \/wp:[\s\S]*?-->/g, '')
        // Remove empty paragraphs
        .replace(/<p>\s*<\/p>/g, '')
        // Clean up excessive whitespace
        .replace(/\n{3,}/g, '\n\n')
        .trim()

    return cleaned
}

function extractExcerpt(content: string, maxLength: number = 160): string {
    // Strip HTML tags
    const text = content.replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()

    if (text.length <= maxLength) {
        return text
    }

    return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...'
}

// ============================================================================
// Slug Handling
// ============================================================================

async function ensureUniqueSlug(
    supabase: any,
    baseSlug: string,
    exceptId?: string
): Promise<string> {
    let slug = slugify(baseSlug)
    let counter = 0
    let isUnique = false

    while (!isUnique) {
        const testSlug = counter === 0 ? slug : `${slug}-${counter}`

        let query = supabase
            .from('posts')
            .select('id')
            .eq('slug', testSlug)

        if (exceptId) {
            query = query.neq('id', exceptId)
        }

        const { data } = await query.single()

        if (!data) {
            slug = testSlug
            isUnique = true
        } else {
            counter++
        }
    }

    return slug
}

// ============================================================================
// Import Tracking
// ============================================================================

async function getExistingImport(
    supabase: any,
    wpPostId: number,
    siteUrl: string
): Promise<{ local_post_id: string } | null> {
    const { data } = await supabase
        .from('wordpress_imports')
        .select('local_post_id')
        .eq('wp_post_id', wpPostId)
        .eq('wp_site_url', siteUrl)
        .eq('status', 'success')
        .single()

    return data
}

async function recordImport(
    supabase: any,
    record: {
        wp_post_id: number
        wp_site_url: string
        local_post_id: string | null
        status: 'success' | 'error'
        error_message?: string
    }
): Promise<void> {
    await supabase
        .from('wordpress_imports')
        .upsert(
            {
                wp_post_id: record.wp_post_id,
                wp_site_url: record.wp_site_url,
                local_post_id: record.local_post_id,
                status: record.status,
                error_message: record.error_message,
                imported_at: new Date().toISOString(),
            },
            {
                onConflict: 'wp_post_id,wp_site_url',
            }
        )
}

async function handleDelete(
    supabase: any,
    localPostId?: string
): Promise<ImportResponse> {
    if (!localPostId) {
        return {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'Post não encontrado para exclusão',
            },
        }
    }

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', localPostId)

    if (error) {
        return {
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Erro ao excluir post',
            },
        }
    }

    return {
        success: true,
        message: 'Post excluído com sucesso',
        data: {
            post_id: localPostId,
            slug: '',
            url: '',
            images_processed: 0,
            was_update: false,
        },
    }
}

// ============================================================================
// Validation
// ============================================================================

export function validatePayload(payload: any): { valid: boolean; error?: string } {
    if (!payload.site_url) {
        return { valid: false, error: 'site_url é obrigatório' }
    }

    if (!payload.post) {
        return { valid: false, error: 'post é obrigatório' }
    }

    if (!payload.post.wp_id) {
        return { valid: false, error: 'post.wp_id é obrigatório' }
    }

    if (!payload.post.title) {
        return { valid: false, error: 'post.title é obrigatório' }
    }

    if (!payload.post.slug) {
        return { valid: false, error: 'post.slug é obrigatório' }
    }

    if (!payload.post.content) {
        return { valid: false, error: 'post.content é obrigatório' }
    }

    return { valid: true }
}

// ============================================================================
// API Key Validation
// ============================================================================

export function validateApiKey(apiKey: string | null): boolean {
    const validKey = process.env.WORDPRESS_IMPORT_API_KEY

    if (!validKey) {
        console.error('WORDPRESS_IMPORT_API_KEY not configured')
        return false
    }

    return apiKey === validKey
}
