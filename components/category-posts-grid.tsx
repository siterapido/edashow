"use client"

import { PostCard } from "@/components/post-card"
import { motion } from "framer-motion"
import { container, fadeIn } from "@/lib/motion"
import { Post } from "@/lib/payload/types"

export interface CategoryPostsGridProps {
  posts: Post[]
  category: string
  excludePostId?: string
}

export function CategoryPostsGrid({ posts, category, excludePostId }: CategoryPostsGridProps) {
  // Filtrar posts excluindo o post em destaque se fornecido
  const filteredPosts = excludePostId
    ? posts.filter(post => post.id !== excludePostId)
    : posts

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg mb-2">
          Nenhum post encontrado nesta categoria.
        </p>
        <p className="text-sm text-muted-foreground">
          Novos conteúdos serão publicados em breve.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {filteredPosts.map((post, index) => (
        <motion.div
          key={post.id}
          variants={fadeIn("up", index * 0.1)}
        >
          <PostCard post={post} variant="default" />
        </motion.div>
      ))}
    </motion.div>
  )
}








