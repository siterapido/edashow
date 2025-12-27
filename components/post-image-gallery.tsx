"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Grid3x3, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

interface PostImageGalleryProps {
  images?: GalleryImage[];
  fallbackImage?: string;
  mode?: "carousel" | "grid";
}

export function PostImageGallery({
  images = [],
  fallbackImage = "/placeholder.jpg",
  mode: initialMode = "carousel",
}: PostImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState<"carousel" | "grid">(initialMode);

  // Se não houver imagens, usar imagem fallback
  const displayImages =
    images.length > 0 ? images : [{ url: fallbackImage, alt: "Imagem" }];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (mode === "grid") {
    return (
      <div className="my-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-slate-900">Galeria de Imagens</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode("carousel")}
            className="gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Carrossel
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden border border-slate-200 bg-slate-50 cursor-pointer hover:border-primary transition-colors group"
              onClick={() => {
                setMode("carousel");
                setCurrentIndex(index);
              }}
            >
              <Image
                src={image.url}
                alt={image.alt || `Imagem ${index + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {image.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-slate-900">Galeria de Imagens</h3>
        {displayImages.length > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMode("grid")}
            className="gap-2"
          >
            <Grid3x3 className="w-4 h-4" />
            Grade
          </Button>
        )}
      </div>
      <div className="relative">
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden border border-slate-200 bg-slate-50">
          <Image
            src={displayImages[currentIndex].url}
            alt={displayImages[currentIndex].alt || `Imagem ${currentIndex + 1}`}
            fill
            className="object-contain"
            priority={currentIndex === 0}
            sizes="100vw"
          />
          {displayImages[currentIndex].caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-sm p-4">
              {displayImages[currentIndex].caption}
            </div>
          )}

          {/* Navegação */}
          {displayImages.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-slate-300"
                onClick={prevImage}
                aria-label="Imagem anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-slate-300"
                onClick={nextImage}
                aria-label="Próxima imagem"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        {/* Indicadores */}
        {displayImages.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-slate-300 hover:bg-slate-400"
                  }`}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Contador */}
        {displayImages.length > 1 && (
          <div className="text-center mt-2 text-sm text-slate-600">
            {currentIndex + 1} de {displayImages.length}
          </div>
        )}
      </div>
    </div>
  );
}













