'use client'

import React, { useEffect, useState } from 'react'
import {
    Youtube,
    Link as LinkIcon,
    Check,
    AlertCircle,
    Loader2,
    ExternalLink,
    Users,
    Video,
    Eye,
    Play
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
    getYouTubeConfig,
    saveYouTubeConfig,
    testYouTubeConnection,
    YouTubeConfig
} from '@/lib/actions/cms-youtube'
import { getLatestVideos, YouTubeVideo } from '@/lib/youtube'

export default function CMSYouTubePage() {
    const [config, setConfig] = useState<YouTubeConfig | null>(null)
    const [channelUrl, setChannelUrl] = useState('')
    const [loading, setLoading] = useState(true)
    const [testing, setTesting] = useState(false)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [previewVideos, setPreviewVideos] = useState<YouTubeVideo[]>([])
    const [channelPreview, setChannelPreview] = useState<any>(null)

    useEffect(() => {
        loadConfig()
    }, [])

    const loadConfig = async () => {
        setLoading(true)
        try {
            const existingConfig = await getYouTubeConfig()
            if (existingConfig) {
                setConfig(existingConfig)
                setChannelUrl(existingConfig.channel_url || '')
                setChannelPreview({
                    name: existingConfig.channel_name,
                    thumbnail: existingConfig.channel_thumbnail,
                    subscriberCount: existingConfig.subscriber_count,
                    videoCount: existingConfig.video_count
                })
                // Load preview videos
                if (existingConfig.channel_id) {
                    const videos = await getLatestVideos(existingConfig.channel_id, 6)
                    setPreviewVideos(videos)
                }
            }
        } catch (err) {
            console.error('Error loading config:', err)
        }
        setLoading(false)
    }

    const handleTestConnection = async () => {
        if (!channelUrl.trim()) {
            setError('Por favor, insira a URL do canal')
            return
        }

        setTesting(true)
        setError(null)
        setSuccess(null)

        try {
            const result = await testYouTubeConnection(channelUrl)

            if (result.success && result.channel) {
                setChannelPreview({
                    name: result.channel.title,
                    thumbnail: result.channel.thumbnailUrl,
                    subscriberCount: result.channel.subscriberCount,
                    videoCount: result.channel.videoCount
                })

                // Update config with channel data
                setConfig(prev => ({
                    ...prev,
                    channel_id: result.channelId!,
                    channel_url: channelUrl,
                    channel_name: result.channel!.title,
                    channel_thumbnail: result.channel!.thumbnailUrl,
                    subscriber_count: result.channel!.subscriberCount,
                    video_count: result.channel!.videoCount,
                    description: result.channel!.description,
                    enabled: prev?.enabled ?? true
                }))

                // Load preview videos
                const videos = await getLatestVideos(result.channelId!, 6)
                setPreviewVideos(videos)

                setSuccess('Canal conectado com sucesso!')
            } else {
                setError(result.error || 'Erro ao conectar')
            }
        } catch (err) {
            setError('Erro ao testar conexão')
        }

        setTesting(false)
    }

    const handleSave = async () => {
        if (!config?.channel_id) {
            setError('Conecte um canal primeiro')
            return
        }

        setSaving(true)
        setError(null)

        try {
            const result = await saveYouTubeConfig(config)

            if (result.success) {
                setSuccess('Configuração salva com sucesso!')
                loadConfig()
            } else {
                setError(result.error || 'Erro ao salvar')
            }
        } catch (err) {
            setError('Erro ao salvar configuração')
        }

        setSaving(false)
    }

    const handleToggleEnabled = async (enabled: boolean) => {
        if (!config) return

        const updatedConfig = { ...config, enabled }
        setConfig(updatedConfig)

        if (config.id) {
            await saveYouTubeConfig(updatedConfig)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        )
    }

    return (
        <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
                        <Youtube className="w-7 h-7 text-red-500" />
                        YouTube
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Conecte o canal do YouTube para exibir vídeos no site.
                    </p>
                </div>
                {config?.channel_id && (
                    <a
                        href="/youtube"
                        target="_blank"
                        className="text-sm text-orange-600 hover:text-orange-500 flex items-center gap-1 font-medium"
                    >
                        Ver página pública <ExternalLink className="w-3 h-3" />
                    </a>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Configuration Panel */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Connect Channel Card */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <LinkIcon className="w-4 h-4 text-orange-500" />
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">
                                Conectar Canal
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-gray-400 text-[10px] font-bold uppercase">
                                    URL do Canal
                                </Label>
                                <Input
                                    value={channelUrl}
                                    onChange={(e) => setChannelUrl(e.target.value)}
                                    placeholder="youtube.com/@edashow"
                                    className="bg-gray-50 border-gray-100 text-gray-900 focus:bg-white transition-colors"
                                />
                                <p className="text-[10px] text-gray-400">
                                    Aceita: @handle, /channel/ID, /c/nome
                                </p>
                            </div>

                            <Button
                                onClick={handleTestConnection}
                                disabled={testing}
                                className="w-full bg-red-500 hover:bg-red-400 text-white font-bold gap-2"
                            >
                                {testing ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Youtube className="w-4 h-4" />
                                )}
                                {testing ? 'Conectando...' : 'Conectar Canal'}
                            </Button>

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
                                    <Check className="w-4 h-4" />
                                    {success}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Channel Preview Card */}
                    {channelPreview && (
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                {channelPreview.thumbnail && (
                                    <img
                                        src={channelPreview.thumbnail}
                                        alt={channelPreview.name}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-900">{channelPreview.name}</h3>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            {channelPreview.subscriberCount} inscritos
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Video className="w-3 h-3" />
                                            {channelPreview.videoCount} vídeos
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-3 border-t border-gray-100">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Exibir no site</p>
                                    <p className="text-xs text-gray-500">Mostrar vídeos na página /youtube</p>
                                </div>
                                <Switch
                                    checked={config?.enabled ?? true}
                                    onCheckedChange={handleToggleEnabled}
                                />
                            </div>

                            <Button
                                onClick={handleSave}
                                disabled={saving || !config?.channel_id}
                                className="w-full mt-4 bg-orange-500 hover:bg-orange-400 text-white font-bold gap-2"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Check className="w-4 h-4" />
                                )}
                                Salvar Configuração
                            </Button>
                        </div>
                    )}
                </div>

                {/* Preview Videos */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                <Play className="w-4 h-4 text-orange-500" />
                                Preview dos Vídeos
                            </h2>
                            {previewVideos.length > 0 && (
                                <span className="text-xs text-gray-400">
                                    {previewVideos.length} vídeos mais recentes
                                </span>
                            )}
                        </div>

                        {previewVideos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {previewVideos.map((video) => (
                                    <a
                                        key={video.id}
                                        href={`https://www.youtube.com/watch?v=${video.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group block"
                                    >
                                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                                                {video.duration}
                                            </div>
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                <Play className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                        </div>
                                        <h4 className="text-sm font-medium text-gray-900 mt-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                            {video.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-1">
                                            <span className="flex items-center gap-1">
                                                <Eye className="w-3 h-3" />
                                                {video.viewCount} views
                                            </span>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <Youtube className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                <p className="text-sm">Conecte um canal para ver os vídeos</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
