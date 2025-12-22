import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getImageUrl } from "@/lib/payload/api";
import { fallbackPosts } from "@/lib/fallback-data";

interface RelatedPost {
  id?: number;
  slug: string;
  title: string;
  excerpt?: string;
  publishedDate?: string;
  featuredImage?: string | any;
  category?: string;
}

interface RelatedPostsProps {
  currentSlug: string;
  limit?: number;
  posts?: RelatedPost[];
}

export function RelatedPosts({
  currentSlug,
  limit = 3,
  posts,
}: RelatedPostsProps) {
  // Se não houver posts fornecidos, usar fallback
  const availablePosts = posts || fallbackPosts;
  
  // Filtrar o post atual e pegar os primeiros 'limit' posts
  const relatedPosts = availablePosts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, limit);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="my-12 pt-8 border-t border-slate-200">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">
        Posts Relacionados
      </h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => {
          const imageUrl =
            typeof post.featuredImage === "string"
              ? post.featuredImage
              : post.featuredImage
              ? getImageUrl(post.featuredImage)
              : "/placeholder.jpg";

          return (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className="group block border border-slate-200 bg-white hover:border-primary transition-colors"
            >
              <div className="relative w-full h-48 overflow-hidden">
                <Image
                  src={imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="p-4">
                {post.publishedDate && (
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Calendar className="w-3 h-3" />
                    <time dateTime={post.publishedDate}>
                      {format(
                        new Date(post.publishedDate),
                        "dd 'de' MMMM 'de' yyyy",
                        { locale: ptBR }
                      )}
                    </time>
                  </div>
                )}
                <h4 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h4>
                {post.excerpt && (
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}









