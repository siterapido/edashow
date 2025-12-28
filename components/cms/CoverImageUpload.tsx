'use client'

import React, { useCallback, useRef, useState } from 'react'
import { ImageIcon, X, Upload, Loader2, Crop } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadMedia } from '@/lib/actions/cms-media'
import { ImageCropperModal } from './ImageCropperModal'

interface CoverImageUploadProps {
    value?: string
    onChange: (url: string | null) => void
    className?: string
    aspectRatio?: number
}

export function CoverImageUpload({
    value,
    onChange,
    className,
    aspectRatio = 16 / 9
}: CoverImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [cropperOpen, setCropperOpen] = useState(false)
    const [tempImage, setTempImage] = useState<string | null>(null)
    const [originalFileName, setOriginalFileName] = useState<string>('image.jpg')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = useCallback(async (blob: Blob) => {
        setIsUploading(true)
        try {
            const file = new File([blob], originalFileName, { type: blob.type })
            const formData = new FormData()
            formData.append('file', file)
            const result = await uploadMedia(formData)
            onChange(result.url)
        } catch (error) {
            console.error('Erro ao fazer upload:', error)
            alert('Erro ao fazer upload da imagem.')
        } finally {
            setIsUploading(false)
            setCropperOpen(false)
            setTempImage(null)
        }
    }, [onChange, originalFileName])

    const handleFileSelect = useCallback((file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione uma imagem.')
            return
        }

        setOriginalFileName(file.name)
        const reader = new FileReader()
        reader.onload = () => {
            setTempImage(reader.result as string)
            setCropperOpen(true)
        }
        reader.readAsDataURL(file)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)

        const file = e.dataTransfer.files[0]
        if (file) handleFileSelect(file)
    }, [handleFileSelect])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFileSelect(file)
        e.target.value = ''
    }, [handleFileSelect])

    const handleRemove = useCallback(() => {
        onChange(null)
    }, [onChange])

    return (
        <>
            {value ? (
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
                            title="Trocar imagem"
                        >
                            <Upload className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-3 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                            title="Remover imagem"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                    />
                </div>
            ) : (
                <div
                    onDrop={handleDrop}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
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
                        onChange={handleInputChange}
                        className="hidden"
                    />

                    {isUploading ? (
                        <>
                            <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                            <span className="text-sm text-gray-400 font-medium">Enviando imagem cortada...</span>
                        </>
                    ) : (
                        <>
                            <div className="p-4 bg-gray-100 rounded-full group-hover:bg-gray-200 transition-colors">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-700">
                                    {isDragging ? 'Solte para editar' : 'Adicionar imagem de capa'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Arraste ou clique para selecionar
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-3">
                                    <span className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2.5 py-1 rounded-full border border-orange-100 flex items-center gap-1.5 shadow-sm">
                                        <Crop className="w-3 h-3" />
                                        Ideal: 1280x720px (16:9)
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {tempImage && (
                <ImageCropperModal
                    image={tempImage}
                    open={cropperOpen}
                    aspectRatio={aspectRatio}
                    onClose={() => {
                        setCropperOpen(false)
                        setTempImage(null)
                    }}
                    onConfirm={handleUpload}
                />
            )}
        </>
    )
}

