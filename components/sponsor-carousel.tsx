"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { getImageUrl } from "@/lib/payload/api"

interface Sponsor {
    id: string | number
    name: string
    logo: any
    website?: string
}

interface SponsorCarouselProps {
    sponsors?: Sponsor[]
}

export function SponsorCarousel({ sponsors = [] }: SponsorCarouselProps) {
    // Se não houver patrocinadores, não renderiza nada
    if (!sponsors || sponsors.length === 0) return null

    // Duplicar a lista para criar o efeito infinito
    const duplicatedSponsors = [...sponsors, ...sponsors, ...sponsors]

    return (
        <section className="py-20 bg-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white z-10 pointer-events-none" />

            <div className="container mx-auto px-4 mb-12 relative z-20">
                <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Pilar de Inovação e Parceria</h2>
                    <div className="h-1 w-20 bg-blue-600 rounded-full mb-4" />
                    <p className="text-gray-500 text-center max-w-2xl">
                        Colaboramos com as principais organizações do setor para trazer as notícias e análises mais relevantes da saúde.
                    </p>
                </div>
            </div>

            <div className="relative flex overflow-x-hidden py-4">
                <motion.div
                    className="flex whitespace-nowrap items-center"
                    animate={{
                        x: ["0%", "-33.333%"],
                    }}
                    transition={{
                        duration: 120, // Mais lento e elegante
                        ease: "linear",
                        repeat: Infinity,
                    }}
                >
                    {duplicatedSponsors.map((sponsor, index) => {
                        const imageUrl = getImageUrl(sponsor.logo)

                        return (
                            <div
                                key={`${sponsor.id}-${index}`}
                                className="mx-12 flex items-center justify-center transition-all duration-500 opacity-80 hover:opacity-100 transform hover:scale-105"
                                style={{ minWidth: "160px" }}
                            >
                                <div className="relative h-16 w-36">
                                    <Image
                                        src={imageUrl}
                                        alt={sponsor.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-contain"
                                    />
                                </div>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </section>
    )
}
