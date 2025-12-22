"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getImageUrl } from "@/lib/payload/api"
import { getCategoryInfo } from "@/lib/categories"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowRight, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { fadeIn } from "@/lib/motion"

export interface CategoryHeroProps {
  category: string
  featuredPost?: {
    id: string
    title: string
    slug: string
    excerpt?: string
    featuredImage?: any
    publishedDate?: string
    author?: {
      name?: string
    }
  }
}

export function CategoryHero({ category, featuredPost }: CategoryHeroProps) {
  const categoryInfo = getCategoryInfo(category)

  if (!featuredPost) {
    return null
  }

  const imageUrl = featuredPost.featuredImage
    ? getImageUrl(featuredPost.featuredImage, 'tablet')
    : '/placeholder.jpg'

  const publishedDate = featuredPost.publishedDate
    ? formatDistanceToNow(new Date(featuredPost.publishedDate), { addSuffix: true, locale: ptBR })
    : 'Recente'

  return (
    <section className="relative bg-[#0f172a] text-white overflow-hidden min-h-[400px] md:min-h-[500px] lg:min-h-[600px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl}
          alt={featuredPost.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-900/90 to-slate-900/80" />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10 h-full">
        <div className="max-w-3xl">
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.2)}
            className="space-y-4 md:space-y-6"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <Badge
                className="bg-primary text-white hover:bg-primary/90 border-none px-4 py-1.5 text-sm font-semibold uppercase tracking-wider"
                style={{ backgroundColor: categoryInfo.color || '#FF6F00' }}
              >
                {categoryInfo.label}
              </Badge>
              <span className="flex items-center gap-2 text-slate-300 text-sm">
                <Clock className="w-4 h-4" />
                {publishedDate}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
              {featuredPost.title}
            </h1>

            {featuredPost.excerpt && (
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-2xl">
                {featuredPost.excerpt}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white font-bold rounded-full px-8 h-12 text-base shadow-lg shadow-primary/20 min-h-[44px]"
              >
                <Link href={`/posts/${featuredPost.slug}`}>
                  Ler matéria completa
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>

            {featuredPost.author?.name && (
              <p className="text-sm text-slate-400 pt-2">
                Por <span className="font-semibold">{featuredPost.author.name}</span>
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}











