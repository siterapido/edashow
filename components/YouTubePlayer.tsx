'use client'

import React, { useEffect, useCallback } from 'react'
import { X, ThumbsUp, Eye, Calendar } from 'lucide-react'
import { YouTubeVideo } from '@/lib/youtube'

interface YouTubePlayerProps {
    video: YouTubeVideo | null
    isOpen: boolean
    onClose: () => void
}

export function YouTubePlayer({ video, isOpen, onClose }: YouTubePlayerProps) {
    // Handle escape key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onClose()
        }
    }, [onClose])

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, handleKeyDown])

    if (!isOpen || !video) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-5xl animate-in zoom-in-95 fade-in duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors p-2"
                >
                    <X className="w-8 h-8" />
                </button>

                {/* Video Player */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl">
                    <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                    />
                </div>

                {/* Video Info */}
                <div className="mt-4 text-white">
                    <h2 className="text-xl sm:text-2xl font-bold line-clamp-2">
                        {video.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/70">
                        <span className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            {video.viewCount} visualizações
                        </span>
                        <span className="flex items-center gap-1.5">
                            <ThumbsUp className="w-4 h-4" />
                            {video.likeCount} curtidas
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {formatFullDate(video.publishedAt)}
                        </span>
                    </div>

                    {video.description && (
                        <p className="mt-4 text-sm text-white/60 line-clamp-3">
                            {video.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

function formatFullDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
}
