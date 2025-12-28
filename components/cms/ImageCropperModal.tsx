'use client'

import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { getCroppedImg } from '@/lib/utils/image-utils'
import { Loader2, ZoomIn, RotateCcw } from 'lucide-react'

interface ImageCropperModalProps {
    image: string
    open: boolean
    onClose: () => void
    onConfirm: (croppedImage: Blob) => void
    aspectRatio?: number
}

export function ImageCropperModal({
    image,
    open,
    onClose,
    onConfirm,
    aspectRatio = 16 / 9
}: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return

        setIsProcessing(true)
        try {
            const croppedImage = await getCroppedImg(
                image,
                croppedAreaPixels,
                rotation
            )
            if (croppedImage) {
                onConfirm(croppedImage)
            }
        } catch (e) {
            console.error(e)
            alert('Erro ao recortar imagem')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl">
                <DialogHeader className="px-6 py-4 border-b shrink-0">
                    <DialogTitle>Ajustar Imagem</DialogTitle>
                </DialogHeader>

                <div className="flex-1 relative bg-gray-900">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        rotation={rotation}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        onRotationChange={setRotation}
                    />
                </div>

                <div className="p-6 bg-white space-y-6 shrink-0 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Zoom Control */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                                <span className="flex items-center gap-2">
                                    <ZoomIn className="w-4 h-4" />
                                    Zoom
                                </span>
                                <span className="text-gray-400">{Math.round(zoom * 100)}%</span>
                            </div>
                            <Slider
                                value={[zoom]}
                                min={1}
                                max={3}
                                step={0.1}
                                onValueChange={([val]: number[]) => setZoom(val)}
                                className="py-2"
                            />
                        </div>

                        {/* Rotation Control */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm font-medium text-gray-700">
                                <span className="flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4" />
                                    Rotação
                                </span>
                                <span className="text-gray-400">{rotation}°</span>
                            </div>
                            <Slider
                                value={[rotation]}
                                min={0}
                                max={360}
                                step={1}
                                onValueChange={([val]: number[]) => setRotation(val)}
                                className="py-2"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex items-center gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="flex-1 rounded-xl h-11"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-bold h-11 rounded-xl shadow-lg shadow-orange-100 transition-all"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processando...
                                </>
                            ) : (
                                'Confirmar Recorte'
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
