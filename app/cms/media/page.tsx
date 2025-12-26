'use client'

import React, { useEffect, useState } from 'react'
import { Upload, Trash2, Image as ImageIcon, Search, Plus, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getMedia, uploadMedia, deleteMedia } from '@/lib/actions/cms-media'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

export default function CMSMediaPage() {
    const [media, setMedia] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)

    const fetchMedia = async () => {
        setLoading(true)
        try {
            const data = await getMedia()
            setMedia(data || [])
        } catch (error) {
            console.error('Erro ao buscar mídia:', error)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchMedia()
    }, [])

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            await uploadMedia(formData)
            fetchMedia()
        } catch (error) {
            console.error('Erro no upload:', error)
            alert('Falha no upload da imagem')
        }
        setUploading(false)
    }

    const handleDelete = async (id: string, filename: string) => {
        if (!confirm('Deseja excluir esta imagem?')) return
        try {
            await deleteMedia(id, filename)
            setMedia(prev => prev.filter(m => m.id !== id))
        } catch (error) {
            console.error('Erro ao deletar:', error)
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Biblioteca de Mídia</h1>
                    <p className="text-gray-500 text-sm mt-1">Gerencie suas imagens e arquivos para o blog e eventos.</p>
                </div>
                <div className="relative">
                    <Input
                        type="file"
                        id="media-upload"
                        className="hidden"
                        onChange={handleUpload}
                        accept="image/*"
                        disabled={uploading}
                    />
                    <Label
                        htmlFor="media-upload"
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 text-white rounded-md cursor-pointer transition-all font-bold shadow-lg shadow-orange-500/20 active:scale-95",
                            uploading && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploading ? 'Enviando...' : 'Fazer Upload'}
                    </Label>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {loading ? (
                    Array(12).fill(0).map((_, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse border border-gray-100" />
                    ))
                ) : media.length > 0 ? (
                    media.map((item) => (
                        <div key={item.id} className="group relative aspect-square bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-orange-500 transition-all shadow-sm">
                            <img
                                src={item.url}
                                alt={item.alt || item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(item.id, item.filename)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                                <div className="absolute bottom-2 left-2 right-2 text-[10px] text-white font-medium truncate px-1">
                                    {item.title}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center flex flex-col items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                        <ImageIcon className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-gray-400 italic">Sua biblioteca de mídia está vazia.</p>
                        <Button
                            variant="link"
                            className="mt-2 text-orange-500 font-bold"
                            onClick={() => document.getElementById('media-upload')?.click()}
                        >
                            Fazer seu primeiro upload
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}
