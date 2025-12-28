'use client'

import React, { useEffect, useState } from 'react'
import {
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    RefreshCw,
    Copy,
    Eye,
    EyeOff,
    ExternalLink,
    FileText,
    Image as ImageIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

interface ImportRecord {
    id: string
    wp_post_id: number
    wp_site_url: string
    local_post_id: string | null
    imported_at: string
    status: 'success' | 'error'
    error_message: string | null
    post?: {
        title: string
        slug: string
    }
}

export default function WordPressImportPage() {
    const [imports, setImports] = useState<ImportRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [showApiKey, setShowApiKey] = useState(false)
    const [stats, setStats] = useState({ total: 0, success: 0, errors: 0 })

    // Placeholder API Key - in production this comes from env
    const apiKeyPlaceholder = 'wp_import_*****************************'

    useEffect(() => {
        fetchImports()
    }, [])

    const fetchImports = async () => {
        setLoading(true)
        try {
            const supabase = createClient()

            // Fetch imports with post data
            const { data, error } = await supabase
                .from('wordpress_imports')
                .select(`
          *,
          post:posts(title, slug)
        `)
                .order('imported_at', { ascending: false })
                .limit(50)

            if (error) throw error

            setImports(data || [])

            // Calculate stats
            const total = data?.length || 0
            const success = data?.filter(d => d.status === 'success').length || 0
            const errors = data?.filter(d => d.status === 'error').length || 0
            setStats({ total, success, errors })
        } catch (error) {
            console.error('Error fetching imports:', error)
        } finally {
            setLoading(false)
        }
    }

    const copyApiKey = () => {
        // In production, get from env
        navigator.clipboard.writeText('YOUR_API_KEY_HERE')
        alert('API Key copiada! Configure em WORDPRESS_IMPORT_API_KEY no .env')
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    return (
        <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Importar do WordPress
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Gerencie importações de posts do WordPress
                    </p>
                </div>
                <Button
                    onClick={fetchImports}
                    variant="outline"
                    className="gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Atualizar
                </Button>
            </div>

            {/* API Configuration Card */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 rounded-xl">
                        <Download className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Configuração da API
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                            Use estas informações para configurar o plugin WordPress.
                        </p>

                        <div className="mt-4 space-y-4">
                            {/* API URL */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    URL da API
                                </label>
                                <div className="mt-1 flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-mono">
                                        {typeof window !== 'undefined'
                                            ? `${window.location.origin}/api/wordpress`
                                            : '/api/wordpress'}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/api/wordpress`)
                                        }}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* API Key */}
                            <div>
                                <label className="text-sm font-medium text-gray-700">
                                    API Key
                                </label>
                                <div className="mt-1 flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm font-mono">
                                        {showApiKey
                                            ? 'Configure em .env: WORDPRESS_IMPORT_API_KEY'
                                            : apiKeyPlaceholder}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                    >
                                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={copyApiKey}
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Gere uma chave segura e configure em WORDPRESS_IMPORT_API_KEY no arquivo .env
                                </p>
                            </div>

                            {/* Documentation Link */}
                            <div className="pt-2">
                                <a
                                    href="/WORDPRESS_PLUGIN_GUIDE.md"
                                    target="_blank"
                                    className="inline-flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    <FileText className="w-4 h-4" />
                                    Ver documentação do plugin
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total de importações</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Sucesso</p>
                            <p className="text-2xl font-bold text-green-600">{stats.success}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Erros</p>
                            <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Import History */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Histórico de Importações
                    </h2>
                </div>

                {loading ? (
                    <div className="p-12 text-center">
                        <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mx-auto" />
                        <p className="text-gray-500 mt-2">Carregando...</p>
                    </div>
                ) : imports.length === 0 ? (
                    <div className="p-12 text-center">
                        <Download className="w-12 h-12 text-gray-300 mx-auto" />
                        <p className="text-gray-500 mt-4">Nenhuma importação encontrada</p>
                        <p className="text-gray-400 text-sm mt-1">
                            Configure o plugin WordPress para começar a importar posts
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {imports.map((item) => (
                            <div
                                key={item.id}
                                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className={`p-2 rounded-lg ${item.status === 'success'
                                                ? 'bg-green-50'
                                                : 'bg-red-50'
                                            }`}
                                    >
                                        {item.status === 'success' ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                        ) : (
                                            <XCircle className="w-5 h-5 text-red-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {item.post?.title || `WP Post #${item.wp_post_id}`}
                                        </p>
                                        <div className="flex items-center gap-3 text-sm text-gray-500">
                                            <span>{item.wp_site_url}</span>
                                            <span>•</span>
                                            <span>{formatDate(item.imported_at)}</span>
                                        </div>
                                        {item.error_message && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {item.error_message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {item.post?.slug && (
                                    <a
                                        href={`/posts/${item.post.slug}`}
                                        target="_blank"
                                        className="text-orange-600 hover:text-orange-700"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
