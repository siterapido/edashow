"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getImageUrl } from "@/lib/payload/api"
import { getCategoryInfo } from "@/lib/categories"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string
    featuredImage?: any
    category: 'news' | 'analysis' | 'interviews' | 'opinion'
    publishedDate?: string
    featured?: boolean
    author?: {
      name?: string
    }
  }
  variant?: 'default' | 'featured' | 'compact'
  className?: string
}

export function PostCard({ post, variant = 'default', className }: PostCardProps) {
  const categoryInfo = getCategoryInfo(post.category)
  const imageUrl = post.featuredImage 
    ? getImageUrl(post.featuredImage, variant === 'compact' ? 'thumbnail' : 'card')
    : null

  const cardContent = (
    <Card className={cn(
      "overflow-hidden hover:shadow-lg transition-all duration-300 h-full group cursor-pointer border-slate-100 hover:border-slate-200",
      variant === 'compact' && "flex flex-row gap-4",
      className
    )}>
      {imageUrl && (
        <div className={cn(
          "relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300",
          variant === 'compact' ? "w-32 h-32 flex-shrink-0" : "w-full h-48"
        )}>
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {variant !== 'compact' && (
            <div className="absolute top-3 left-3">
              <Badge 
                className="bg-white/90 backdrop-blur text-slate-800 font-semibold shadow-sm hover:bg-white border-none"
                style={{ backgroundColor: categoryInfo.color ? `${categoryInfo.color}15` : undefined }}
              >
                {categoryInfo.label}
              </Badge>
            </div>
          )}
        </div>
      )}
      
      {!imageUrl && variant !== 'compact' && (
        <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <span className="text-gray-400 text-sm font-medium">{categoryInfo.label}</span>
        </div>
      )}

      <div className={cn(
        "p-4 md:p-5 flex flex-col flex-1",
        variant === 'compact' && "p-3"
      )}>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {variant === 'compact' && (
            <Badge 
              className="text-xs font-semibold border-none"
              style={{ backgroundColor: categoryInfo.color ? `${categoryInfo.color}15` : undefined }}
            >
              {categoryInfo.label}
            </Badge>
          )}
          {post.featured && (
            <span className="text-yellow-500 text-xs">⭐</span>
          )}
          {post.publishedDate && (
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Calendar className="h-3 w-3" />
              <time dateTime={post.publishedDate}>
                {format(new Date(post.publishedDate), 'dd/MM/yyyy', { locale: ptBR })}
              </time>
            </div>
          )}
        </div>

        <h3 className={cn(
          "font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors",
          variant === 'compact' ? "text-base" : "text-lg"
        )}>
          {post.title}
        </h3>

        {post.excerpt && variant !== 'compact' && (
          <p className="text-sm text-slate-600 line-clamp-3 mb-3 flex-1">
            {post.excerpt}
          </p>
        )}

        {variant !== 'compact' && (
          <div className="flex items-center text-primary font-medium text-sm group/link mt-auto">
            Ler mais
            <svg 
              className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        )}

        {post.author?.name && variant === 'compact' && (
          <p className="text-xs text-slate-500 mt-1">Por {post.author.name}</p>
        )}
      </div>
    </Card>
  )

  return (
    <Link href={`/posts/${post.slug}`} className="block h-full">
      {variant === 'featured' ? (
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {cardContent}
        </motion.div>
      ) : (
        cardContent
      )}
    </Link>
  )
}








