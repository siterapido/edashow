'use client'

import React, { useEffect, useState } from 'react'
import { Instagram, Youtube, Linkedin, Facebook, Twitter, Save, RefreshCw, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function SocialSettingsPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [settingsId, setSettingsId] = useState<string | null>(null)
    const [socialMedia, setSocialMedia] = useState({
        instagram: '',
        youtube: '',
        linkedin: '',
        facebook: '',
        twitter: '',
        whatsapp: ''
    })

    const fetchSettings = async () => {
        setLoading(true)
        const supabase = createClient()
        const { data, error } = await supabase
            .from('theme_settings')
            .select('id, social_media')
            .single()

        if (error) {
            console.error('Erro ao buscar configurações:', error)
        } else if (data) {
            setSettingsId(data.id)
            if (data.social_media) {
                setSocialMedia({
                    instagram: data.social_media.instagram || '',
                    youtube: data.social_media.youtube || '',
                    linkedin: data.social_media.linkedin || '',
                    facebook: data.social_media.facebook || '',
                    twitter: data.social_media.twitter || '',
                    whatsapp: data.social_media.whatsapp || ''
                })
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleSave = async () => {
        if (!settingsId) return

        setSaving(true)
        const supabase = createClient()
        const { error } = await supabase
            .from('theme_settings')
            .update({
                social_media: socialMedia,
                updated_at: new Date().toISOString()
            })
            .eq('id', settingsId)

        if (error) {
            console.error('Erro ao salvar:', error)
            alert('Erro ao salvar configurações')
        } else {
            alert('Configurações salvas com sucesso!')
        }
        setSaving(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSocialMedia(prev => ({
            ...prev,
            [name]: value
        }))
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Redes Sociais</h1>
                    <p className="text-gray-500 text-sm mt-1">Conecte as redes sociais do projeto usando o @ ou link do perfil.</p>
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

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden text-slate-900">
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Instagram */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Instagram className="w-4 h-4 text-pink-600" /> Instagram
                            </label>
                            <Input
                                name="instagram"
                                value={socialMedia.instagram}
                                onChange={handleChange}
                                placeholder="@seu_perfil"
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            />
                        </div>

                        {/* Youtube */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Youtube className="w-4 h-4 text-red-600" /> Youtube
                            </label>
                            <Input
                                name="youtube"
                                value={socialMedia.youtube}
                                onChange={handleChange}
                                placeholder="@seu_canal ou link"
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            />
                        </div>

                        {/* Linkedin */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Linkedin className="w-4 h-4 text-blue-700" /> Linkedin
                            </label>
                            <Input
                                name="linkedin"
                                value={socialMedia.linkedin}
                                onChange={handleChange}
                                placeholder="link do perfil ou empresa"
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            />
                        </div>

                        {/* Facebook */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Facebook className="w-4 h-4 text-blue-600" /> Facebook
                            </label>
                            <Input
                                name="facebook"
                                value={socialMedia.facebook}
                                onChange={handleChange}
                                placeholder="link da página"
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            />
                        </div>

                        {/* Twitter/X */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <Twitter className="w-4 h-4 text-gray-900" /> Twitter / X
                            </label>
                            <Input
                                name="twitter"
                                value={socialMedia.twitter}
                                onChange={handleChange}
                                placeholder="@seu_perfil"
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            />
                        </div>

                        {/* WhatsApp */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-green-600" /> WhatsApp (para contato)
                            </label>
                            <Input
                                name="whatsapp"
                                value={socialMedia.whatsapp}
                                onChange={handleChange}
                                placeholder="5511999999999"
                                className="bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
