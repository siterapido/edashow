/**
 * WordPress Import API Endpoint
 * 
 * POST /api/wordpress/import
 * 
 * Receives posts from the WordPress plugin and imports them
 * into the EdaShow database.
 */

import { NextRequest, NextResponse } from 'next/server'
import {
    importWordPressPost,
    validatePayload,
    validateApiKey
} from '@/lib/wordpress/importer'
import { WordPressImportPayload, ImportErrorResponse } from '@/lib/wordpress/types'

export async function POST(request: NextRequest) {
    // Validate API Key
    const apiKey = request.headers.get('x-wp-api-key')

    if (!validateApiKey(apiKey)) {
        const errorResponse: ImportErrorResponse = {
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'API Key inválida ou não fornecida',
            },
        }
        return NextResponse.json(errorResponse, { status: 401 })
    }

    // Parse request body
    let payload: WordPressImportPayload
    try {
        payload = await request.json()
    } catch (error) {
        const errorResponse: ImportErrorResponse = {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: 'JSON inválido no corpo da requisição',
            },
        }
        return NextResponse.json(errorResponse, { status: 400 })
    }

    // Validate payload structure
    const validation = validatePayload(payload)
    if (!validation.valid) {
        const errorResponse: ImportErrorResponse = {
            success: false,
            error: {
                code: 'VALIDATION_ERROR',
                message: validation.error || 'Dados inválidos',
            },
        }
        return NextResponse.json(errorResponse, { status: 400 })
    }

    // Log import attempt
    console.log(`[WordPress Import] Receiving post from ${payload.site_url}: "${payload.post.title}" (WP ID: ${payload.post.wp_id})`)

    // Process import
    const result = await importWordPressPost(payload)

    if (result.success) {
        console.log(`[WordPress Import] Success: Post "${payload.post.title}" imported as ${result.data.post_id}`)
        return NextResponse.json(result, { status: 200 })
    } else {
        console.error(`[WordPress Import] Failed: ${result.error.message}`)
        return NextResponse.json(result, { status: 400 })
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-wp-api-key',
        },
    })
}
