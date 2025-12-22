"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getCategoryInfo } from "@/lib/categories"
import { Post } from "@/lib/payload/types"
import { TrendingUp, Tag, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export interface CategorySidebarProps {
  category: string
  popularPosts?: Post[]
  relatedPosts?: Post[]
  tags?: string[]
}

export function CategorySidebar({
  category,
  popularPosts = [],
  relatedPosts = [],
  tags = []
}: CategorySidebarProps) {
  const categoryInfo = getCategoryInfo(category)

  return (
    <aside className="space-y-6">
      {/* Mais Lidos */}
      {popularPosts.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-bold text-slate-900">
                Mais Lidos
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {popularPosts.slice(0, 5).map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="block group"
              >
                <div className="flex gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 group-hover:text-primary transition-colors line-clamp-2 mb-1">
                      {post.title}
                    </h4>
                    {post.publishedDate && (
                      <p className="text-xs text-slate-500">
                        {new Date(post.publishedDate).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Posts Relacionados */}
      {relatedPosts.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-bold text-slate-900">
              Relacionados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {relatedPosts.slice(0, 3).map((post) => (
              <PostCard key={post.id} post={post} variant="compact" />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Tags Populares */}
      {tags.length > 0 && (
        <Card className="border border-slate-200">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-bold text-slate-900">
                Tags Populares
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 10).map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
                  style={{ backgroundColor: categoryInfo.color ? `${categoryInfo.color}15` : undefined }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Newsletter Compacto */}
      <NewsletterWidget categoryLabel={categoryInfo.label} />

      {/* Espaço Publicitário */}
      <Card className="border border-slate-200 bg-slate-50">
        <CardContent className="p-0">
          <div className="w-full h-[250px] bg-slate-50 flex items-center justify-center border border-dashed border-slate-300">
            <div className="text-center p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Espaço Publicitário
              </p>
              <p className="text-xs text-slate-400">300 x 250</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  )
}

function NewsletterWidget({ categoryLabel }: { categoryLabel: string }) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("success")
    setTimeout(() => {
      setEmail("")
      setStatus("idle")
    }, 3000)
  }

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Mail className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg font-bold text-slate-900">
            Newsletter
          </CardTitle>
        </div>
        <p className="text-sm text-slate-600">
          Receba as principais notícias de {categoryLabel.toLowerCase()} no seu e-mail
        </p>
      </CardHeader>
      <CardContent>
        {status === "success" ? (
          <div className="text-center py-4">
            <p className="text-sm font-medium text-green-700 mb-1">
              ✓ Inscrição realizada!
            </p>
            <p className="text-xs text-slate-600">
              Verifique sua caixa de entrada
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-slate-200 h-10 text-sm"
              required
            />
            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary/90 h-10 text-sm font-semibold min-h-[44px]"
            >
              Inscrever-se
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}








