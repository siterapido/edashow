'use client'

import React, { useEffect, useState } from 'react'
import {
    Search,
    BarChart3,
    Save,
    RefreshCw,
    Tag,
    Globe,
    Code
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { getSiteSettings, updateSiteSettings } from '@/lib/actions/cms-settings'

export default function SEOSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [settings, setSettings] = useState({
        site_description: '',
        seo_keywords: '',
        google_analytics_id: '',
        google_tag_manager_id: ''
    })

    const fetchSettings = async () => {
        setLoading(true)
        const data = await getSiteSettings()
        if (data) {
            setSettings({
                site_description: data.site_description || '',
                seo_keywords: (data as any).seo_keywords || '',
                google_analytics_id: (data as any).google_analytics_id || '',
                google_tag_manager_id: (data as any).google_tag_manager_id || ''
            })
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const result = await updateSiteSettings(settings as any)
        if (result.success) {
            alert('Configurações de SEO salvas!')
        } else {
            alert('Erro ao salvar: ' + result.error)
        }
        setSaving(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setSettings(prev => ({ ...prev, [name]: value }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">SEO & Analytics</h1>
                    <p className="text-gray-500 text-sm mt-1">Otimize seu site para mecanismos de busca.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2 shadow-lg"
                >
                    {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Salvar Alterações
                </Button>
            </div>

            {/* Meta Description */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-orange-500" />
                        Meta Descrição
                    </h2>
                </div>
                <div className="p-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Descrição do Site</label>
                        <Textarea
                            name="site_description"
                            value={settings.site_description}
                            onChange={handleChange}
                            placeholder="Uma descrição concisa do seu site para resultados de busca..."
                            rows={3}
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                            maxLength={160}
                        />
                        <p className="text-xs text-gray-400">{settings.site_description.length}/160 caracteres</p>
                    </div>

                    {/* Preview */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Preview no Google:</p>
                        <div className="space-y-1">
                            <p className="text-blue-600 text-lg">Nome do Seu Site</p>
                            <p className="text-green-700 text-sm">https://seusite.com.br</p>
                            <p className="text-gray-600 text-sm">{settings.site_description || 'Sua descrição aparecerá aqui...'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Keywords */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-orange-500" />
                        Palavras-chave
                    </h2>
                </div>
                <div className="p-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Keywords (separadas por vírgula)</label>
                        <Textarea
                            name="seo_keywords"
                            value={settings.seo_keywords}
                            onChange={handleChange}
                            placeholder="notícias, tecnologia, eventos, entretenimento..."
                            rows={2}
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                        <p className="text-xs text-gray-400">Palavras-chave ajudam os mecanismos de busca a entender seu conteúdo</p>
                    </div>
                </div>
            </div>

            {/* Analytics */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-orange-500" />
                        Google Analytics
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Google Analytics ID</label>
                        <Input
                            name="google_analytics_id"
                            value={settings.google_analytics_id}
                            onChange={handleChange}
                            placeholder="G-XXXXXXXXXX ou UA-XXXXXXXX-X"
                            className="bg-gray-50 border-gray-200 focus:bg-white font-mono"
                        />
                        <p className="text-xs text-gray-400">Encontre seu ID em Analytics → Admin → Propriedade → Fluxos de dados</p>
                    </div>
                </div>
            </div>

            {/* Tag Manager */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Code className="w-4 h-4 text-orange-500" />
                        Google Tag Manager
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">GTM Container ID</label>
                        <Input
                            name="google_tag_manager_id"
                            value={settings.google_tag_manager_id}
                            onChange={handleChange}
                            placeholder="GTM-XXXXXXX"
                            className="bg-gray-50 border-gray-200 focus:bg-white font-mono"
                        />
                        <p className="text-xs text-gray-400">Use o Tag Manager para gerenciar tags de marketing e rastreamento</p>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                    <Search className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-blue-900">Dicas de SEO</h4>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                            <li>Mantenha a meta descrição entre 150-160 caracteres</li>
                            <li>Use palavras-chave relevantes para seu público</li>
                            <li>O Google Analytics ajuda a entender o tráfego do site</li>
                            <li>Posts com bom conteúdo ranqueiam melhor naturalmente</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
