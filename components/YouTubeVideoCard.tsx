'use client'

import React from 'react'
import { Play, Eye } from 'lucide-react'
import { YouTubeVideo } from '@/lib/youtube'

interface YouTubeVideoCardProps {
    video: YouTubeVideo
    onClick?: () => void
}

export function YouTubeVideoCard({ video, onClick }: YouTubeVideoCardProps) {
    return (
        <div
            onClick={onClick}
            className="group cursor-pointer"
        >
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300">
                <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-black/90 text-white text-xs font-semibold px-2 py-1 rounded-md backdrop-blur-sm">
                    {video.duration}
                </div>

                {/* Play Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300 shadow-2xl">
                        <Play className="w-7 h-7 text-white ml-1" fill="currentColor" />
                    </div>
                </div>
            </div>

            <div className="mt-4 px-1">
                <h3 className="text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors duration-200">
                    {video.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {video.viewCount} visualizações
                    </span>
                    <span>•</span>
                    <span>{formatDate(video.publishedAt)}</span>
                </div>
            </div>
        </div>
    )
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoje'
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`
    return `${Math.floor(diffDays / 365)} anos atrás`
}
