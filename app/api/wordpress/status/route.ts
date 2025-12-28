/**
 * WordPress Status API Endpoint
 * 
 * GET /api/wordpress/status
 * 
 * Returns the status of the WordPress import API,
 * including available categories and features.
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateApiKey } from '@/lib/wordpress/importer'
import { getPublicSupabaseClient } from '@/lib/supabase/public-client'
import { StatusResponse, ImportErrorResponse } from '@/lib/wordpress/types'

const API_VERSION = '1.0.0'
const SITE_NAME = 'EdaShow'

export async function GET(request: NextRequest) {
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

    try {
        // Fetch categories
        const supabase = getPublicSupabaseClient()
        const { data: categories, error } = await supabase
            .from('categories')
            .select('id, name, slug')
            .order('name')

        if (error) {
            throw error
        }

        const response: StatusResponse = {
            success: true,
            api_version: API_VERSION,
            site_name: SITE_NAME,
            categories: categories || [],
            features: {
                image_processing: true,
                auto_categories: true,
                seo_meta: true,
            },
        }

        return NextResponse.json(response, { status: 200 })
    } catch (error: any) {
        console.error('[WordPress Status] Error:', error)

        const errorResponse: ImportErrorResponse = {
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'Erro ao buscar informações do sistema',
            },
        }
        return NextResponse.json(errorResponse, { status: 500 })
    }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, x-wp-api-key',
        },
    })
}
