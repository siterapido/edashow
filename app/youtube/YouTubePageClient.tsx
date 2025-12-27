'use client'

import React, { useState } from 'react'
import { Youtube, Users, Video, Bell, ExternalLink } from 'lucide-react'
import { YouTubeVideo } from '@/lib/youtube'
import { YouTubeVideoCard } from '@/components/YouTubeVideoCard'
import { YouTubePlayer } from '@/components/YouTubePlayer'

interface YouTubeChannel {
    id: string
    name?: string | null
    thumbnail?: string | null
    subscriberCount?: string | null
    videoCount?: string | null
    description?: string | null
}

interface YouTubePageClientProps {
    channel: YouTubeChannel
    videos: YouTubeVideo[]
}

export function YouTubePageClient({ channel, videos }: YouTubePageClientProps) {
    const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null)
    const [isPlayerOpen, setIsPlayerOpen] = useState(false)

    const handleVideoClick = (video: YouTubeVideo) => {
        setSelectedVideo(video)
        setIsPlayerOpen(true)
    }

    const handleClosePlayer = () => {
        setIsPlayerOpen(false)
        setSelectedVideo(null)
    }

    return (
        <main>
            {/* Hero Section */}
            <section className="relative min-h-[400px] bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative container mx-auto px-4 py-16 sm:py-24">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                        {/* Channel Avatar */}
                        {channel.thumbnail && (
                            <div className="relative">
                                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden ring-4 ring-white/20 shadow-2xl">
                                    <img
                                        src={channel.thumbnail}
                                        alt={channel.name || 'Channel'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-red-600 p-2 rounded-full shadow-lg">
                                    <Youtube className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        )}

                        {/* Channel Info */}
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                                {channel.name || 'Canal EdaShow'}
                            </h1>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-white/80 mb-6">
                                <span className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    <span className="font-semibold">{channel.subscriberCount}</span> inscritos
                                </span>
                                <span className="flex items-center gap-2">
                                    <Video className="w-5 h-5" />
                                    <span className="font-semibold">{channel.videoCount}</span> vídeos
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <a
                                    href={`https://www.youtube.com/channel/${channel.id}?sub_confirmation=1`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <Bell className="w-5 h-5" />
                                    Inscrever-se
                                </a>
                                <a
                                    href={`https://www.youtube.com/channel/${channel.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded-full transition-all duration-200 backdrop-blur-sm"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Ver no YouTube
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Wave Separator */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
                        <path d="M0 50L48 45.7C96 41.3 192 32.7 288 29.2C384 25.7 480 27.3 576 35.8C672 44.3 768 59.7 864 62.5C960 65.3 1056 55.7 1152 48.3C1248 41 1344 36 1392 33.5L1440 31V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="white" />
                    </svg>
                </div>
            </section>

            {/* Videos Grid */}
            <section className="container mx-auto px-4 py-16">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Últimos Vídeos
                        </h2>
                        <p className="text-gray-500 mt-1">
                            Confira os conteúdos mais recentes do nosso canal
                        </p>
                    </div>
                </div>

                {videos.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                        {videos.map((video) => (
                            <YouTubeVideoCard
                                key={video.id}
                                video={video}
                                onClick={() => handleVideoClick(video)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Youtube className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Nenhum vídeo disponível no momento.</p>
                    </div>
                )}
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-red-600 to-red-500 py-16">
                <div className="container mx-auto px-4 text-center">
                    <Youtube className="w-16 h-16 text-white/80 mx-auto mb-6" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                        Não perca nenhum vídeo!
                    </h2>
                    <p className="text-white/80 max-w-xl mx-auto mb-8">
                        Inscreva-se no nosso canal e ative o sininho para receber notificações de novos conteúdos sobre saúde suplementar.
                    </p>
                    <a
                        href={`https://www.youtube.com/channel/${channel.id}?sub_confirmation=1`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-red-600 font-bold px-8 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <Bell className="w-5 h-5" />
                        Inscrever-se no Canal
                    </a>
                </div>
            </section>

            {/* Video Player Modal */}
            <YouTubePlayer
                video={selectedVideo}
                isOpen={isPlayerOpen}
                onClose={handleClosePlayer}
            />
        </main>
    )
}
