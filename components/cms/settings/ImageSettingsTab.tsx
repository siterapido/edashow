'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
    ImageIcon,
    Save,
    RefreshCw,
    Upload,
    Trash2,
    Check,
    Settings2,
    Droplet
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
    getImageSettings,
    updateImageSettings,
    uploadWatermarkLogo,
    removeWatermarkLogo
} from '@/lib/actions/cms-image-settings'

interface ImageSettingsState {
    enabled: boolean
    format: 'webp' | 'jpeg' | 'png'
    quality: number
    max_width: number
    max_height: number
    watermark_enabled: boolean
    watermark_logo_url: string | null
    watermark_position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'
    watermark_opacity: number
    watermark_size: number
}

const defaultSettings: ImageSettingsState = {
    enabled: true,
    format: 'webp',
    quality: 85,
    max_width: 1920,
    max_height: 1080,
    watermark_enabled: false,
    watermark_logo_url: null,
    watermark_position: 'bottom-right',
    watermark_opacity: 50,
    watermark_size: 15
}

const positions = [
    { value: 'top-left', label: 'Superior Esquerda' },
    { value: 'top-right', label: 'Superior Direita' },
    { value: 'center', label: 'Centro' },
    { value: 'bottom-left', label: 'Inferior Esquerda' },
    { value: 'bottom-right', label: 'Inferior Direita' }
]

const formats = [
    { value: 'webp', label: 'WebP (Recomendado)', description: 'Melhor compressão, suportado por todos navegadores modernos' },
    { value: 'jpeg', label: 'JPEG', description: 'Compatibilidade máxima' },
    { value: 'png', label: 'PNG', description: 'Suporta transparência' }
]

export function ImageSettingsTab() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingLogo, setUploadingLogo] = useState(false)
    const [settings, setSettings] = useState<ImageSettingsState>(defaultSettings)
    const logoInputRef = useRef<HTMLInputElement>(null)

    const fetchSettings = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getImageSettings()
            if (data) {
                setSettings({
                    enabled: data.enabled,
                    format: data.format,
                    quality: data.quality,
                    max_width: data.max_width,
                    max_height: data.max_height,
                    watermark_enabled: data.watermark_enabled,
                    watermark_logo_url: data.watermark_logo_url,
                    watermark_position: data.watermark_position,
                    watermark_opacity: data.watermark_opacity,
                    watermark_size: data.watermark_size
                })
            }
        } catch (error) {
            console.error('Erro ao buscar configurações:', error)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const handleSave = async () => {
        setSaving(true)
        try {
            const result = await updateImageSettings(settings)
            if (result.success) {
                alert('Configurações salvas com sucesso!')
            } else {
                alert('Erro ao salvar: ' + result.error)
            }
        } catch (error) {
            console.error('Erro ao salvar:', error)
            alert('Erro ao salvar configurações')
        }
        setSaving(false)
    }

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingLogo(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const result = await uploadWatermarkLogo(formData)

            if (result.success && result.url) {
                setSettings(prev => ({
                    ...prev,
                    watermark_logo_url: result.url!
                }))
                alert('Logo enviado com sucesso!')
            } else {
                alert('Erro ao enviar logo: ' + result.error)
            }
        } catch (error) {
            console.error('Erro ao enviar logo:', error)
            alert('Erro ao enviar logo')
        }
        setUploadingLogo(false)
        if (logoInputRef.current) {
            logoInputRef.current.value = ''
        }
    }

    const handleRemoveLogo = async () => {
        if (!confirm('Remover logo de marca d\'água?')) return

        try {
            const result = await removeWatermarkLogo()
            if (result.success) {
                setSettings(prev => ({
                    ...prev,
                    watermark_logo_url: null,
                    watermark_enabled: false
                }))
            }
        } catch (error) {
            console.error('Erro ao remover logo:', error)
        }
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
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Otimização de Imagens</h2>
                    <p className="text-gray-500 text-sm mt-1">Configure a otimização automática e marca d'água para imagens enviadas.</p>
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

            {/* Main Toggle */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                settings.enabled ? "bg-green-100" : "bg-gray-100"
                            )}>
                                <Settings2 className={cn(
                                    "w-5 h-5",
                                    settings.enabled ? "text-green-600" : "text-gray-500"
                                )} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Otimização Automática</h3>
                                <p className="text-sm text-gray-500">Converte e comprime imagens automaticamente no upload</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.enabled}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enabled: checked }))}
                        />
                    </div>
                </div>
            </div>

            {/* Optimization Settings */}
            {settings.enabled && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-orange-500" />
                            Configurações de Otimização
                        </h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {/* Format */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700">Formato de Saída</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {formats.map((format) => (
                                    <button
                                        key={format.value}
                                        onClick={() => setSettings(prev => ({ ...prev, format: format.value as any }))}
                                        className={cn(
                                            "p-4 rounded-lg border-2 text-left transition-all",
                                            settings.format === format.value
                                                ? "border-orange-500 bg-orange-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        )}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-gray-900">{format.label}</span>
                                            {settings.format === format.value && (
                                                <Check className="w-4 h-4 text-orange-500" />
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500">{format.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quality */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Qualidade</label>
                                <span className="text-sm font-bold text-orange-500">{settings.quality}%</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={settings.quality}
                                onChange={(e) => setSettings(prev => ({ ...prev, quality: parseInt(e.target.value) }))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>Menor arquivo</span>
                                <span>Maior qualidade</span>
                            </div>
                        </div>

                        {/* Dimensions */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Largura Máxima (px)</label>
                                <Input
                                    type="number"
                                    value={settings.max_width}
                                    onChange={(e) => setSettings(prev => ({ ...prev, max_width: parseInt(e.target.value) || 1920 }))}
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Altura Máxima (px)</label>
                                <Input
                                    type="number"
                                    value={settings.max_height}
                                    onChange={(e) => setSettings(prev => ({ ...prev, max_height: parseInt(e.target.value) || 1080 }))}
                                    className="bg-gray-50 border-gray-200"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Watermark Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                settings.watermark_enabled ? "bg-blue-100" : "bg-gray-100"
                            )}>
                                <Droplet className={cn(
                                    "w-5 h-5",
                                    settings.watermark_enabled ? "text-blue-600" : "text-gray-500"
                                )} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Marca D'água</h3>
                                <p className="text-sm text-gray-500">Adiciona logo automaticamente nas imagens</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.watermark_enabled}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, watermark_enabled: checked }))}
                            disabled={!settings.watermark_logo_url}
                        />
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Logo Upload */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700">Logo da Marca D'água</label>

                        {settings.watermark_logo_url ? (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <img
                                    src={settings.watermark_logo_url}
                                    alt="Logo marca d'água"
                                    className="w-20 h-20 object-contain bg-white rounded-lg border"
                                />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600">Logo configurado</p>
                                    <p className="text-xs text-gray-400 truncate max-w-[200px]">{settings.watermark_logo_url}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleRemoveLogo}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
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
                                <p className="text-xs text-gray-400 mt-1">PNG com fundo transparente recomendado</p>
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

                    {/* Watermark Options (only if logo is set) */}
                    {settings.watermark_logo_url && (
                        <>
                            {/* Position */}
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-700">Posição</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                    {positions.map((pos) => (
                                        <button
                                            key={pos.value}
                                            onClick={() => setSettings(prev => ({ ...prev, watermark_position: pos.value as any }))}
                                            className={cn(
                                                "p-3 rounded-lg border text-center text-sm transition-all",
                                                settings.watermark_position === pos.value
                                                    ? "border-orange-500 bg-orange-50 text-orange-700 font-medium"
                                                    : "border-gray-200 hover:border-gray-300 text-gray-600"
                                            )}
                                        >
                                            {pos.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Opacity */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Opacidade</label>
                                    <span className="text-sm font-bold text-orange-500">{settings.watermark_opacity}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={settings.watermark_opacity}
                                    onChange={(e) => setSettings(prev => ({ ...prev, watermark_opacity: parseInt(e.target.value) }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Mais transparente</span>
                                    <span>Mais visível</span>
                                </div>
                            </div>

                            {/* Size */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-medium text-gray-700">Tamanho (% da imagem)</label>
                                    <span className="text-sm font-bold text-orange-500">{settings.watermark_size}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="5"
                                    max="50"
                                    value={settings.watermark_size}
                                    onChange={(e) => setSettings(prev => ({ ...prev, watermark_size: parseInt(e.target.value) }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Menor</span>
                                    <span>Maior</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex gap-3">
                    <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="font-medium text-blue-900">Como funciona</h4>
                        <p className="text-sm text-blue-700 mt-1">
                            Quando habilitado, todas as imagens enviadas pelo CMS serão automaticamente:
                        </p>
                        <ul className="text-sm text-blue-700 mt-2 space-y-1 list-disc list-inside">
                            <li>Convertidas para o formato escolhido (WebP é recomendado para melhor compressão)</li>
                            <li>Redimensionadas se excederem as dimensões máximas</li>
                            <li>Comprimidas com a qualidade configurada</li>
                            {settings.watermark_enabled && <li>Marca d'água aplicada na posição configurada</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
