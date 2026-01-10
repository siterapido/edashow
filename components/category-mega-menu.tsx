"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getPosts } from "@/lib/supabase/api"
import { getAllCategories, getCategoryInfo } from "@/lib/categories"
import { CategoryPreviewCard } from "./category-preview-card"
import { cn } from "@/lib/utils"

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
    const fetchAllData = async () => {
      setIsLoading(true)
      const categories = getAllCategories()

      const promises = categories.map(async (cat) => {
        try {
          // Buscar posts via Supabase API
          const posts = await getPosts({
            limit: 3,
            status: 'published',
            category: cat.slug || cat.value
          });

          return {
            category: cat.value as any,
            posts: posts,
            loading: false
          }
        } catch (error) {
          console.error(`Erro ao buscar posts da categoria ${cat.value}:`, error)
          // Em caso de erro, retornar array vazio (sem fallbacks mockados)
          return {
            category: cat.value as any,
            posts: [],
            loading: false
          }
        }
      })

      const results = await Promise.all(promises)
      setCategoriesData(results)
      setIsLoading(false)
    }

    fetchAllData()
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
      <div className="p-4 bg-white">
        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3 animate-pulse">
                <div className="aspect-[16/10] bg-gray-100 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {activePosts.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {activePosts.map((post, index) => (
                      <Link
                        key={post.id}
                        href={`/posts/${post.slug}`}
                        className="group flex flex-col gap-3 rounded-xl transition-all duration-300"
                      >
                        {/* Imagem */}
                        <div className="relative aspect-[16/10] flex-shrink-0 rounded-xl overflow-hidden bg-gray-50 shadow-sm transition-shadow duration-300 group-hover:shadow-md">
                          {post.cover_image_url ? (
                            <Image
                              src={post.cover_image_url}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                              style={{ backgroundColor: activeCategoryInfo.color }}
                            >
                              {post.title.substring(0, 1).toUpperCase()}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Conteúdo */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-bold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors leading-[1.4]">
                            {post.title}
                          </h4>
                          {post.excerpt && (
                            <p className="text-[11px] text-gray-500 line-clamp-1 mt-1.5 font-medium">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Ver mais link */}
                  <div className="pt-2 border-t border-gray-50 flex justify-center">
                    <Link
                      href={`/${categories.find(c => c.value === activeTab)?.slug}`}
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-gray-50 text-xs font-bold text-gray-600 hover:bg-primary/5 hover:text-primary transition-all duration-300 group shadow-sm border border-gray-100"
                    >
                      Ver todos os conteúdos em {activeCategoryInfo.label}
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                  <p className="text-sm font-medium text-gray-400">Nenhum post disponível nesta categoria</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  )
}












