'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
    Palette,
    Save,
    RefreshCw,
    Upload,
    Trash2,
    Type,
    Sun,
    Moon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { getSiteSettings, updateSiteSettings, uploadSiteLogo, type SiteSettings } from '@/lib/actions/cms-settings'

const GOOGLE_FONTS = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Raleway',
    'Oswald',
    'Source Sans Pro',
    'Nunito',
    'Playfair Display',
    'Merriweather',
    'Ubuntu',
    'Outfit',
    'Work Sans'
]

export function BrandingSettingsTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const logoInputRef = useRef<HTMLInputElement>(null)

    const [settings, setSettings] = useState({
        logo_url: '',
        font_heading: 'Inter',
        font_body: 'Inter',
        light_primary: '#FF6F00',
        light_secondary: '#F97316',
        light_background: '#FFFFFF',
        light_foreground: '#0F172A',
        dark_primary: '#FF6F00',
        dark_secondary: '#FB923C',
        dark_background: '#0F172A',
        dark_foreground: '#F8FAFC'
    })

    const fetchSettings = async () => {
        setLoading(true)
        const data = await getSiteSettings()
        if (data) {
            setSettings({
                logo_url: data.logo_url || '',
                font_heading: data.font_heading || 'Inter',
                font_body: data.font_body || 'Inter',
                light_primary: data.light_primary || '#FF6F00',
                light_secondary: data.light_secondary || '#F97316',
                light_background: data.light_background || '#FFFFFF',
                light_foreground: data.light_foreground || '#0F172A',
                dark_primary: data.dark_primary || '#FF6F00',
                dark_secondary: data.dark_secondary || '#FB923C',
                dark_background: data.dark_background || '#0F172A',
                dark_foreground: data.dark_foreground || '#F8FAFC'
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
            alert('Configurações de branding salvas!')
        } else {
            alert('Erro ao salvar: ' + result.error)
        }
        setSaving(false)
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingLogo(true)
        const formData = new FormData()
        formData.append('file', file)
        const result = await uploadSiteLogo(formData)

        if (result.success && result.url) {
            setSettings(prev => ({ ...prev, logo_url: result.url! }))
            alert('Logo enviado com sucesso!')
        } else {
            alert('Erro ao enviar logo: ' + result.error)
        }
        setUploadingLogo(false)
        if (logoInputRef.current) logoInputRef.current.value = ''
    }

    const handleRemoveLogo = async () => {
        if (!confirm('Remover logo?')) return
        await updateSiteSettings({ logo_url: null } as any)
        setSettings(prev => ({ ...prev, logo_url: '' }))
    }

    const handleColorChange = (field: string, value: string) => {
        setSettings(prev => ({ ...prev, [field]: value }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Branding</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure cores, tipografia e logotipo do site.</p>
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

            {/* Logo */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Palette className="w-4 h-4 text-orange-500" />
                        Logotipo
                    </h3>
                </div>
                <div className="p-6">
                    {settings.logo_url ? (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <img
                                src={settings.logo_url}
                                alt="Logo do site"
                                className="w-32 h-16 object-contain bg-white rounded-lg border"
                            />
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">Logo configurado</p>
                                <p className="text-xs text-gray-400 truncate max-w-[200px]">{settings.logo_url}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => logoInputRef.current?.click()}
                                    disabled={uploadingLogo}
                                >
                                    {uploadingLogo ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRemoveLogo}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => logoInputRef.current?.click()}
                            className={cn(
                                "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
                                "hover:border-orange-400 hover:bg-orange-50/50",
                                uploadingLogo ? "opacity-50 pointer-events-none" : ""
                            )}
                        >
                            {uploadingLogo ? (
                                <RefreshCw className="w-8 h-8 mx-auto text-orange-500 animate-spin mb-2" />
                            ) : (
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            )}
                            <p className="text-sm text-gray-600">Clique para enviar o logo</p>
                            <p className="text-xs text-gray-400 mt-1">PNG ou SVG recomendado</p>
                        </div>
                    )}
                    <input
                        ref={logoInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                    />
                </div>
            </div>

            {/* Typography */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Type className="w-4 h-4 text-orange-500" />
                        Tipografia
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Fonte dos Títulos</label>
                            <select
                                value={settings.font_heading}
                                onChange={(e) => setSettings(prev => ({ ...prev, font_heading: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                {GOOGLE_FONTS.map((font) => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400" style={{ fontFamily: settings.font_heading }}>
                                Preview: Título em {settings.font_heading}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Fonte do Corpo</label>
                            <select
                                value={settings.font_body}
                                onChange={(e) => setSettings(prev => ({ ...prev, font_body: e.target.value }))}
                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                {GOOGLE_FONTS.map((font) => (
                                    <option key={font} value={font}>{font}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400" style={{ fontFamily: settings.font_body }}>
                                Preview: Texto em {settings.font_body}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Light Mode Colors */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Sun className="w-4 h-4 text-orange-500" />
                        Cores - Modo Claro
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ColorPicker
                            label="Primária"
                            value={settings.light_primary}
                            onChange={(v) => handleColorChange('light_primary', v)}
                        />
                        <ColorPicker
                            label="Secundária"
                            value={settings.light_secondary}
                            onChange={(v) => handleColorChange('light_secondary', v)}
                        />
                        <ColorPicker
                            label="Fundo"
                            value={settings.light_background}
                            onChange={(v) => handleColorChange('light_background', v)}
                        />
                        <ColorPicker
                            label="Texto"
                            value={settings.light_foreground}
                            onChange={(v) => handleColorChange('light_foreground', v)}
                        />
                    </div>
                    {/* Preview */}
                    <div className="mt-4 p-4 rounded-lg border" style={{
                        backgroundColor: settings.light_background,
                        color: settings.light_foreground
                    }}>
                        <p className="text-sm font-bold" style={{ color: settings.light_primary }}>Título de Exemplo</p>
                        <p className="text-sm mt-1">Texto de exemplo para visualização das cores.</p>
                        <button className="mt-2 px-3 py-1 rounded text-white text-xs" style={{ backgroundColor: settings.light_primary }}>
                            Botão
                        </button>
                    </div>
                </div>
            </div>

            {/* Dark Mode Colors */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Moon className="w-4 h-4 text-orange-500" />
                        Cores - Modo Escuro
                    </h3>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <ColorPicker
                            label="Primária"
                            value={settings.dark_primary}
                            onChange={(v) => handleColorChange('dark_primary', v)}
                        />
                        <ColorPicker
                            label="Secundária"
                            value={settings.dark_secondary}
                            onChange={(v) => handleColorChange('dark_secondary', v)}
                        />
                        <ColorPicker
                            label="Fundo"
                            value={settings.dark_background}
                            onChange={(v) => handleColorChange('dark_background', v)}
                        />
                        <ColorPicker
                            label="Texto"
                            value={settings.dark_foreground}
                            onChange={(v) => handleColorChange('dark_foreground', v)}
                        />
                    </div>
                    {/* Preview */}
                    <div className="mt-4 p-4 rounded-lg border" style={{
                        backgroundColor: settings.dark_background,
                        color: settings.dark_foreground
                    }}>
                        <p className="text-sm font-bold" style={{ color: settings.dark_primary }}>Título de Exemplo</p>
                        <p className="text-sm mt-1">Texto de exemplo para visualização das cores.</p>
                        <button className="mt-2 px-3 py-1 rounded text-white text-xs" style={{ backgroundColor: settings.dark_primary }}>
                            Botão
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="flex items-center gap-2">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 bg-gray-50 border-gray-200 text-sm font-mono uppercase"
                />
            </div>
        </div>
    )
}
