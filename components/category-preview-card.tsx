"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCategoryInfo } from "@/lib/categories"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface CategoryPreviewCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string
    featured_image?: any
    category: 'news' | 'analysis' | 'interviews' | 'opinion'
    published_at?: string
  }
  className?: string
}

export function CategoryPreviewCard({ post, className }: CategoryPreviewCardProps) {
  const categoryInfo = getCategoryInfo(post.category)
  const imageUrl = post.featured_image?.url || '/placeholder.jpg'

  const timeAgo = post.published_at
    ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
    : null

  return (
    <Link href={`/posts/${post.slug}`} className="block">
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={cn("h-full", className)}
      >
        <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 h-full group cursor-pointer border-slate-100 hover:border-slate-200 bg-white">
          {/* Imagem */}
          <div className="relative w-full h-24 md:h-28 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2">
              <Badge
                className="text-[10px] md:text-xs font-semibold border-none backdrop-blur-sm shadow-sm px-1.5 md:px-2 py-0.5"
                style={{
                  backgroundColor: categoryInfo.color ? `${categoryInfo.color}E6` : undefined,
                  color: 'white'
                }}
              >
                {categoryInfo.label}
              </Badge>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-2.5 md:p-3 flex flex-col gap-1 md:gap-1.5">
            <h4 className="font-semibold text-xs md:text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors text-slate-900">
              {post.title}
            </h4>

            {post.excerpt && (
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            {timeAgo && (
              <span className="text-xs text-slate-400 mt-auto">
                {timeAgo}
              </span>
            )}
          </div>
        </Card>
      </motion.div>
    </Link>
  )
}












