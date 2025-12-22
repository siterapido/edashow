"use client";

import { Card } from "@/components/ui/card"
import { getPosts, getImageUrl } from "@/lib/payload/api"
import { fallbackPosts } from "@/lib/fallback-data"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { motion } from "framer-motion"
import { container, fadeIn } from "@/lib/motion"
import { useEffect, useState } from "react"

interface LatestNewsProps {
  initialPosts?: any[]
}

export function LatestNews({ initialPosts = [] }: LatestNewsProps) {
  const [posts, setPosts] = useState<any[]>(initialPosts.length > 0 ? initialPosts : fallbackPosts.slice(0, 8));

  useEffect(() => {
    // Se não recebeu posts iniciais, busca do CMS
    if (initialPosts.length === 0) {
      const fetchData = async () => {
        try {
          const data = await getPosts({
            limit: 8,
            status: 'published',
            revalidate: 60
          });
          setPosts(data.length > 0 ? data : fallbackPosts.slice(0, 8));
        } catch (e) {
          setPosts(fallbackPosts.slice(0, 8));
        }
      };
      fetchData();
    } else {
      setPosts(initialPosts);
    }
  }, [initialPosts]);

  return (
    <motion.section
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="bg-gray-50 py-8 md:py-12 min-h-[400px]"
    >
      <div className="container mx-auto px-4">
        <motion.h2 variants={fadeIn("up")} className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 text-black">
          Últimas <span className="text-primary">Notícias</span>
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto">
          {posts.length > 0 && posts.map((item: any, index: number) => {
            // Determinar a URL da imagem
            const imageUrl = item.featuredImage
              ? (typeof item.featuredImage === 'string'
                ? item.featuredImage
                : getImageUrl(item.featuredImage, 'thumbnail'))
              : null;

            return (
              <motion.div
                key={item.id || index}
                variants={fadeIn("up", index * 0.1)}
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Link href={item.slug ? `/posts/${item.slug}` : '#'}>
                  <Card className="flex flex-col h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-slate-100 hover:border-slate-200 bg-white group overflow-hidden py-0 gap-0">
                    {imageUrl ? (
                      <div className="relative w-full h-40 md:h-48 flex-shrink-0 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={item.title || 'Notícia'}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div className="w-full h-40 md:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 flex items-center justify-center">
                        <span className="text-gray-400 text-sm font-medium">Sem imagem</span>
                      </div>
                    )}
                    <div className="flex flex-col flex-1 p-4 md:p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider bg-primary/10 px-2 py-1 rounded">
                          Notícia
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          {item.publishedDate
                            ? formatDistanceToNow(new Date(item.publishedDate), {
                              addSuffix: true,
                              locale: ptBR
                            })
                            : 'Recente'}
                        </span>
                      </div>

                      <h3 className="font-bold text-lg leading-tight mb-3 text-primary group-hover:text-primary/80 transition-colors line-clamp-2">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                        {item.excerpt || item.description}
                      </p>

                      <div className="flex items-center text-primary font-medium text-sm group/link mt-auto">
                        Ler mais
                        <svg className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.section>
  )
}
