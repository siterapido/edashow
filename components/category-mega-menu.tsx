"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getPosts, getImageUrl } from "@/lib/payload/api"
import { getAllCategories, getCategoryInfo } from "@/lib/categories"
import { CategoryPreviewCard } from "./category-preview-card"
import { cn } from "@/lib/utils"
import { getFallbackPosts } from "@/lib/fallback-data"

interface CategoryPosts {
  category: 'news' | 'analysis' | 'interviews' | 'opinion'
  posts: any[]
  loading: boolean
}

export function CategoryMegaMenu() {
  const [categoriesData, setCategoriesData] = useState<CategoryPosts[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('news')

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      setIsLoading(true)
      const categories = getAllCategories()
      
      const promises = categories.map(async (cat) => {
        try {
          // Buscar posts via API diretamente (client-side safe)
          const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || window.location.origin
          const params = new URLSearchParams({
            limit: '3',
            'where[status][equals]': 'published',
            'where[category][equals]': cat.value,
            sort: '-publishedDate',
          })
          
          const response = await fetch(`${API_URL}/api/posts?${params.toString()}`)
          
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          
          const data = await response.json()
          const posts = data.docs || []
          
          // Se não houver posts da API, usar posts de fallback
          const finalPosts = posts.length > 0 
            ? posts 
            : getFallbackPosts({ category: cat.value, limit: 3 })
          
          return {
            category: cat.value,
            posts: finalPosts,
            loading: false
          }
        } catch (error) {
          console.error(`Erro ao buscar posts da categoria ${cat.value}:`, error)
          // Em caso de erro, usar posts de fallback
          const fallbackPosts = getFallbackPosts({ category: cat.value, limit: 3 })
          return {
            category: cat.value,
            posts: fallbackPosts,
            loading: false
          }
        }
      })

      const results = await Promise.all(promises)
      setCategoriesData(results)
      setIsLoading(false)
    }

    fetchCategoryPosts()
  }, [])

  const categories = getAllCategories()
  const activeCategoryData = categoriesData.find(
    (data) => data.category === activeTab
  )
  const activePosts = activeCategoryData?.posts || []
  const activeCategoryInfo = getCategoryInfo(activeTab as any)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[700px] max-w-[95vw] bg-white rounded-xl shadow-2xl border border-gray-200/80 overflow-hidden z-50 backdrop-blur-sm"
    >
      {/* Tabs Header */}
      <div className="border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const categoryInfo = getCategoryInfo(category.value)
              const isActive = activeTab === category.value
              
              return (
                <button
                  key={category.value}
                  onClick={() => setActiveTab(category.value)}
                  className={cn(
                    "relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap",
                    isActive
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-lg"
                      style={{ backgroundColor: categoryInfo.color }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{category.label}</span>
                </button>
              )
            })}
          </div>
          <Link 
            href="/posts" 
            className="text-xs text-gray-500 hover:text-primary font-medium flex items-center gap-1 transition-colors ml-3 flex-shrink-0"
          >
            Ver tudo
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              {activePosts.length > 0 ? (
                <>
                  {activePosts.map((post, index) => (
                    <Link
                      key={post.id}
                      href={`/posts/${post.slug}`}
                      className="flex gap-3 group hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                    >
                      {/* Imagem */}
                      <div className="relative w-24 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                        {post.featuredImage ? (
                          <Image
                            src={
                              typeof post.featuredImage === 'string'
                                ? post.featuredImage
                                : getImageUrl(post.featuredImage)
                            }
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div 
                            className="w-full h-full flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: activeCategoryInfo.color }}
                          >
                            {post.title.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-snug">
                          {post.title}
                        </h4>
                        {post.excerpt && (
                          <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{ 
                              backgroundColor: `${activeCategoryInfo.color}15`,
                              color: activeCategoryInfo.color 
                            }}
                          >
                            {activeCategoryInfo.label}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {/* Ver mais link */}
                  <Link
                    href={`/${categories.find(c => c.value === activeTab)?.slug}`}
                    className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors py-2 group"
                  >
                    Ver mais em {activeCategoryInfo.label}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Nenhum post disponível</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  )
}








