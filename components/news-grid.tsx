"use client";

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, Clock } from "lucide-react"
import { motion } from "framer-motion"
import { container, fadeIn } from "@/lib/motion"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getPosts } from "@/lib/supabase/api"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Post {
  id: string
  title: string
  excerpt?: string
  cover_image_url?: string
  featured_image?: any
  published_at?: string
  category?: any
  slug?: string
}

interface NewsGridProps {
  initialPosts?: Post[]
  limit?: number
}

export function NewsGrid({ initialPosts, limit = 6 }: NewsGridProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || [])
  const [loading, setLoading] = useState(!initialPosts)

  useEffect(() => {
    // Se já temos posts iniciais (SSR), não precisamos buscar
    if (initialPosts && initialPosts.length > 0) {
      return
    }

    // Buscar posts do Supabase
    async function fetchPosts() {
      try {
        const data = await getPosts({
          limit,
          status: 'published'
        })
        setPosts(data || [])
      } catch (error) {
        console.error('Erro ao buscar posts:', error)
        setPosts([])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [initialPosts, limit])

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-16 bg-slate-50/50">
        <div className="text-center text-slate-500">Carregando notícias...</div>
      </section>
    )
  }

  if (posts.length === 0) {
    return (
      <section className="container mx-auto px-4 py-16 bg-slate-50/50">
        <div className="text-center text-slate-500">Nenhuma notícia disponível no momento.</div>
      </section>
    )
  }
  return (
    <motion.section 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="container mx-auto px-4 py-16 bg-slate-50/50"
    >
      <div className="flex items-center justify-between mb-10">
        <motion.h2 
          variants={fadeIn("right")}
          className="text-3xl font-bold text-slate-800 tracking-tight"
        >
          Últimas <span className="text-primary">Notícias</span>
        </motion.h2>
        <motion.a 
          variants={fadeIn("left")}
          href="#" 
          className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
          whileHover={{ x: 5 }}
        >
          Ver todas as notícias &rarr;
        </motion.a>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => {
          const imageUrl = post.cover_image_url || post.featured_image?.url || '/placeholder.jpg'
          const categoryName = typeof post.category === 'object' && post.category ? post.category.name : 'Notícias'
          const publishedDate = post.published_at
            ? formatDistanceToNow(new Date(post.published_at), { addSuffix: true, locale: ptBR })
            : 'Recente'

          return (
            <motion.div
              key={post.id}
              variants={fadeIn("up", index * 0.1)}
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Link href={post.slug ? `/posts/${post.slug}` : '#'}>
                <Card
                  className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white h-full cursor-pointer"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <motion.img
                      src={imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-white/90 backdrop-blur text-slate-800 font-semibold shadow-sm hover:bg-white">
                        {categoryName}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" />
                        {publishedDate}
                      </div>
                    </div>

                    <h3 className="font-bold text-xl mb-3 text-slate-800 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
                      {post.excerpt || 'Clique para ler mais...'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          )
        })}
      </div>
    </motion.section>
  )
}
