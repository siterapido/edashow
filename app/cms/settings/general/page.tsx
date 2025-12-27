'use client'

import React, { useEffect, useState, useRef } from 'react'
import {
    Settings,
    Save,
    RefreshCw,
    Upload,
    Globe,
    Mail,
    Phone,
    MapPin,
    AlertTriangle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { getSiteSettings, updateSiteSettings, uploadFavicon, type SiteSettings } from '@/lib/actions/cms-settings'

export default function GeneralSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploadingFavicon, setUploadingFavicon] = useState(false)
    const faviconInputRef = useRef<HTMLInputElement>(null)

    const [settings, setSettings] = useState({
        site_name: '',
        site_slogan: '',
        site_description: '',
        site_favicon_url: '',
        contact_email: '',
        contact_phone: '',
        contact_address: '',
        maintenance_mode: false,
        maintenance_message: '',
        footer_text: '',
        footer_copyright: ''
    })

    const fetchSettings = async () => {
        setLoading(true)
        const data = await getSiteSettings()
        if (data) {
            setSettings({
                site_name: data.site_name || '',
                site_slogan: data.site_slogan || '',
                site_description: data.site_description || '',
                site_favicon_url: data.site_favicon_url || '',
                contact_email: data.contact_email || '',
                contact_phone: data.contact_phone || '',
                contact_address: (data as any).contact_address || '',
                maintenance_mode: (data as any).maintenance_mode || false,
                maintenance_message: (data as any).maintenance_message || '',
                footer_text: (data as any).footer_text || '',
                footer_copyright: (data as any).footer_copyright || ''
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
            alert('Configurações salvas com sucesso!')
        } else {
            alert('Erro ao salvar: ' + result.error)
        }
        setSaving(false)
    }

    const handleFaviconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingFavicon(true)
        const formData = new FormData()
        formData.append('file', file)
        const result = await uploadFavicon(formData)

        if (result.success && result.url) {
            setSettings(prev => ({ ...prev, site_favicon_url: result.url! }))
            alert('Favicon enviado com sucesso!')
        } else {
            alert('Erro ao enviar favicon: ' + result.error)
        }
        setUploadingFavicon(false)
        if (faviconInputRef.current) faviconInputRef.current.value = ''
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
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Configurações Gerais</h1>
                    <p className="text-gray-500 text-sm mt-1">Configure as informações básicas do seu site.</p>
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

            {/* Site Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-orange-500" />
                        Informações do Site
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nome do Site</label>
                            <Input
                                name="site_name"
                                value={settings.site_name}
                                onChange={handleChange}
                                placeholder="EDA Show"
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Slogan</label>
                            <Input
                                name="site_slogan"
                                value={settings.site_slogan}
                                onChange={handleChange}
                                placeholder="Seu slogan aqui"
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Descrição (SEO)</label>
                        <Textarea
                            name="site_description"
                            value={settings.site_description}
                            onChange={handleChange}
                            placeholder="Descrição do site para mecanismos de busca..."
                            rows={3}
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>

                    {/* Favicon Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Favicon</label>
                        <div className="flex items-center gap-4">
                            {settings.site_favicon_url && (
                                <img src={settings.site_favicon_url} alt="Favicon" className="w-8 h-8 rounded border" />
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => faviconInputRef.current?.click()}
                                disabled={uploadingFavicon}
                            >
                                {uploadingFavicon ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                Enviar Favicon
                            </Button>
                        </div>
                        <input
                            ref={faviconInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFaviconUpload}
                            className="hidden"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-orange-500" />
                        Informações de Contato
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Mail className="w-3 h-3" /> Email
                            </label>
                            <Input
                                name="contact_email"
                                type="email"
                                value={settings.contact_email}
                                onChange={handleChange}
                                placeholder="contato@exemplo.com"
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Phone className="w-3 h-3" /> Telefone
                            </label>
                            <Input
                                name="contact_phone"
                                value={settings.contact_phone}
                                onChange={handleChange}
                                placeholder="(11) 99999-9999"
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Endereço
                        </label>
                        <Input
                            name="contact_address"
                            value={settings.contact_address}
                            onChange={handleChange}
                            placeholder="Rua, número, cidade - estado"
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-orange-500" />
                        Rodapé
                    </h2>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Texto do Rodapé</label>
                        <Textarea
                            name="footer_text"
                            value={settings.footer_text}
                            onChange={handleChange}
                            placeholder="Texto adicional para exibir no rodapé..."
                            rows={2}
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Copyright</label>
                        <Input
                            name="footer_copyright"
                            value={settings.footer_copyright}
                            onChange={handleChange}
                            placeholder="© 2024 EDA Show. Todos os direitos reservados."
                            className="bg-gray-50 border-gray-200 focus:bg-white"
                        />
                    </div>
                </div>
            </div>

            {/* Maintenance Mode */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "p-2 rounded-lg",
                                settings.maintenance_mode ? "bg-red-100" : "bg-gray-100"
                            )}>
                                <AlertTriangle className={cn(
                                    "w-5 h-5",
                                    settings.maintenance_mode ? "text-red-600" : "text-gray-500"
                                )} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Modo de Manutenção</h3>
                                <p className="text-sm text-gray-500">Desativa o acesso público ao site</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.maintenance_mode}
                            onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
                        />
                    </div>
                    {settings.maintenance_mode && (
                        <div className="mt-4 space-y-2">
                            <label className="text-sm font-medium text-gray-700">Mensagem de Manutenção</label>
                            <Textarea
                                name="maintenance_message"
                                value={settings.maintenance_message}
                                onChange={handleChange}
                                placeholder="Site em manutenção. Voltamos em breve!"
                                rows={2}
                                className="bg-gray-50 border-gray-200 focus:bg-white"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
