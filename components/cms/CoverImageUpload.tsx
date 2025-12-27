'use client'

import React, { useCallback, useRef, useState } from 'react'
import { ImageIcon, X, Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadMedia } from '@/lib/actions/cms-media'

interface CoverImageUploadProps {
    value?: string
    onChange: (url: string | null) => void
    className?: string
}

export function CoverImageUpload({ value, onChange, className }: CoverImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = useCallback(async (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione uma imagem.')
            return
        }

        setIsUploading(true)
        try {
            const formData = new FormData()
            formData.append('file', file)
            const result = await uploadMedia(formData)
            onChange(result.url)
        } catch (error) {
            console.error('Erro ao fazer upload:', error)
            alert('Erro ao fazer upload da imagem.')
        } finally {
            setIsUploading(false)
        }
    }, [onChange])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file) handleUpload(file)
    }, [handleUpload])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleUpload(file)
        e.target.value = ''
    }, [handleUpload])

    const handleRemove = useCallback(() => {
        onChange(null)
    }, [onChange])

    if (value) {
        return (
            <div className={cn("relative group", className)}>
                <img
                    src={value}
                    alt="Imagem de capa"
                    className="w-full h-48 md:h-64 object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    >
                        <Upload className="w-5 h-5" />
                    </button>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-3 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>
        )
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
                "relative cursor-pointer border-2 border-dashed rounded-xl transition-all",
                "flex flex-col items-center justify-center gap-3 p-8 h-48 md:h-64",
                isDragging
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-100",
                isUploading && "pointer-events-none",
                className
            )}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {isUploading ? (
                <>
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                    <span className="text-sm text-gray-400">Enviando imagem...</span>
                </>
            ) : (
                <>
                    <div className="p-4 bg-gray-100 rounded-full">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="text-center">
                        <p className="text-sm font-medium text-gray-600">
                            {isDragging ? 'Solte a imagem aqui' : 'Adicionar imagem de capa'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Arraste uma imagem ou clique para selecionar
                        </p>
                        <p className="text-[10px] text-orange-500/60 font-medium mt-2">
                            Recomendado: 1200x630px para capa, 600x400px para miniaturas
                        </p>
                    </div>
                </>
            )}
        </div>
    )
}
