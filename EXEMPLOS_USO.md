# 📚 Exemplos de Uso do PayloadCMS

Este documento contém exemplos práticos de como usar o PayloadCMS no projeto EdaShow.

## 📝 Índice

1. [Buscar Dados do CMS](#buscar-dados-do-cms)
2. [Exibir Posts](#exibir-posts)
3. [Exibir Eventos](#exibir-eventos)
4. [Trabalhar com Imagens](#trabalhar-com-imagens)
5. [Filtros e Queries](#filtros-e-queries)
6. [Autenticação](#autenticação)
7. [Criar Componentes Dinâmicos](#criar-componentes-dinâmicos)

---

## 1. Buscar Dados do CMS

### Buscar Posts Publicados

```typescript
import { getPosts } from '@/lib/payload/api'

export default async function NewsPage() {
  const posts = await getPosts({ 
    limit: 10, 
    status: 'published' 
  })
  
  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  )
}
```

### Buscar Posts em Destaque

```typescript
const featuredPosts = await getPosts({ 
  limit: 3, 
  status: 'published',
  featured: true 
})
```

### Buscar Posts por Categoria

```typescript
const analysisPosts = await getPosts({ 
  limit: 5, 
  category: 'analysis' 
})
```

### Buscar Post por Slug

```typescript
import { getPostBySlug } from '@/lib/payload/api'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) {
    return <div>Post não encontrado</div>
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}
```

---

## 2. Exibir Posts

### Card de Post Simples

```typescript
import { getPosts, getImageUrl } from '@/lib/payload/api'
import Image from 'next/image'
import Link from 'next/link'

export default async function PostsList() {
  const posts = await getPosts({ limit: 6 })
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map(post => (
        <Link href={`/posts/${post.slug}`} key={post.id}>
          <article className="border rounded-lg overflow-hidden hover:shadow-lg transition">
            {post.featuredImage && (
              <div className="relative h-48 w-full">
                <Image
                  src={getImageUrl(post.featuredImage, 'card')}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <span className="text-sm text-primary">{post.category}</span>
              <h3 className="font-bold text-lg mt-2">{post.title}</h3>
              <p className="text-muted-foreground mt-2">{post.excerpt}</p>
              {post.publishedDate && (
                <time className="text-sm text-muted-foreground mt-2 block">
                  {new Date(post.publishedDate).toLocaleDateString('pt-BR')}
                </time>
              )}
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
```

### Post Completo com Autor

```typescript
import { getPostBySlug, getImageUrl } from '@/lib/payload/api'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)
  
  if (!post) return <div>Post não encontrado</div>
  
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        <span className="text-primary font-medium">{post.category}</span>
        <h1 className="text-4xl font-bold mt-2 mb-4">{post.title}</h1>
        
        {/* Autor */}
        {post.author && (
          <div className="flex items-center gap-3 mt-6">
            <Avatar>
              <AvatarImage 
                src={getImageUrl(post.author.photo, 'thumbnail')} 
                alt={post.author.name} 
              />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {new Date(post.publishedDate).toLocaleDateString('pt-BR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        )}
      </header>
      
      {/* Imagem Destacada */}
      {post.featuredImage && (
        <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
          <Image
            src={getImageUrl(post.featuredImage)}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      {/* Conteúdo */}
      <div className="prose prose-lg max-w-none">
        {/* Renderizar conteúdo rico aqui */}
        {post.content}
      </div>
      
      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex gap-2 mt-8">
          {post.tags.map((tag, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
            >
              {tag.tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
```

---

## 3. Exibir Eventos

### Lista de Eventos Próximos

```typescript
import { getEvents, getImageUrl } from '@/lib/payload/api'
import { Calendar, MapPin } from 'lucide-react'
import Image from 'next/image'

export default async function EventsList() {
  const events = await getEvents({ status: 'upcoming', limit: 6 })
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => (
        <article key={event.id} className="border rounded-lg overflow-hidden">
          {event.image && (
            <div className="relative h-48 w-full">
              <Image
                src={getImageUrl(event.image, 'card')}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="font-bold text-lg">{event.title}</h3>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event.startDate).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
              
              {event.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
            
            {event.registrationUrl && (
              <a 
                href={event.registrationUrl}
                className="mt-4 block text-center bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90"
                target="_blank"
                rel="noopener noreferrer"
              >
                Inscrever-se
              </a>
            )}
          </div>
        </article>
      ))}
    </div>
  )
}
```

---

## 4. Trabalhar com Imagens

### Obter URL de Imagem

```typescript
import { getImageUrl } from '@/lib/payload/api'

// Imagem original
const originalUrl = getImageUrl(post.featuredImage)

// Imagem em tamanho específico
const thumbnailUrl = getImageUrl(post.featuredImage, 'thumbnail')
const cardUrl = getImageUrl(post.featuredImage, 'card')
const tabletUrl = getImageUrl(post.featuredImage, 'tablet')
```

### Componente de Imagem Responsiva

```typescript
import Image from 'next/image'
import { getImageUrl } from '@/lib/payload/api'

interface ResponsiveImageProps {
  media: any
  alt: string
  className?: string
}

export function ResponsiveImage({ media, alt, className }: ResponsiveImageProps) {
  if (!media) return null
  
  return (
    <div className={`relative ${className}`}>
      <Image
        src={getImageUrl(media, 'tablet')}
        alt={media.alt || alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

---

## 5. Filtros e Queries

### Buscar com Múltiplos Filtros

```typescript
// Buscar posts publicados da categoria "news" em destaque
const posts = await getPosts({
  limit: 10,
  status: 'published',
  category: 'news',
  featured: true,
  revalidate: 60 // Revalidar a cada 60 segundos
})
```

### Query Personalizada com Fetch

```typescript
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

// Buscar posts com autor específico
const response = await fetch(
  `${API_URL}/api/posts?where[author][equals]=AUTHOR_ID&limit=5`,
  { next: { revalidate: 60 } }
)
const data = await response.json()
const posts = data.docs
```

### Buscar com Ordenação

```typescript
// Buscar posts mais recentes
const response = await fetch(
  `${API_URL}/api/posts?sort=-publishedDate&limit=10`,
  { next: { revalidate: 60 } }
)

// Buscar posts mais antigos
const response = await fetch(
  `${API_URL}/api/posts?sort=publishedDate&limit=10`,
  { next: { revalidate: 60 } }
)
```

### Buscar com Paginação

```typescript
const page = 2
const limit = 10

const response = await fetch(
  `${API_URL}/api/posts?page=${page}&limit=${limit}`,
  { next: { revalidate: 60 } }
)

const data = await response.json()
console.log('Total de posts:', data.totalDocs)
console.log('Total de páginas:', data.totalPages)
console.log('Página atual:', data.page)
console.log('Posts:', data.docs)
```

---

## 6. Autenticação

### Login

```typescript
'use client'

import { useState } from 'react'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        throw new Error('Login falhou')
      }
      
      const data = await response.json()
      console.log('Login bem-sucedido:', data)
      
      // Redirecionar ou atualizar estado
      window.location.href = '/admin'
    } catch (err) {
      setError('Email ou senha inválidos')
    }
  }
  
  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Entrar</button>
    </form>
  )
}
```

### Requisição Autenticada

```typescript
const token = 'SEU_TOKEN_JWT'

const response = await fetch('/api/posts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `JWT ${token}`
  },
  body: JSON.stringify({
    title: 'Novo Post',
    slug: 'novo-post',
    content: 'Conteúdo do post...',
    status: 'draft'
  })
})
```

---

## 7. Criar Componentes Dinâmicos

### Componente de Últimas Notícias

```typescript
// components/latest-news.tsx
import { getPosts, getImageUrl } from '@/lib/payload/api'
import Image from 'next/image'
import Link from 'next/link'

export async function LatestNews() {
  const posts = await getPosts({ 
    limit: 5, 
    status: 'published',
    revalidate: 60 
  })
  
  if (posts.length === 0) {
    return <p>Nenhuma notícia disponível</p>
  }
  
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Últimas Notícias</h2>
      <div className="space-y-4">
        {posts.map(post => (
          <Link 
            href={`/posts/${post.slug}`} 
            key={post.id}
            className="flex gap-4 hover:bg-accent p-2 rounded-lg transition"
          >
            {post.featuredImage && (
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={getImageUrl(post.featuredImage, 'thumbnail')}
                  alt={post.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-2">{post.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(post.publishedDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
```

### Componente de Colunistas

```typescript
// components/columnists-grid.tsx
import { getColumnists, getImageUrl } from '@/lib/payload/api'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export async function ColumnistsGrid() {
  const columnists = await getColumnists({ limit: 8 })
  
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">Nossos Colunistas</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {columnists.map(columnist => (
          <div key={columnist.id} className="text-center">
            <Avatar className="h-20 w-20 mx-auto mb-3">
              <AvatarImage 
                src={getImageUrl(columnist.photo, 'thumbnail')} 
                alt={columnist.name} 
              />
              <AvatarFallback>{columnist.name[0]}</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold">{columnist.name}</h3>
            {columnist.role && (
              <p className="text-sm text-muted-foreground">{columnist.role}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
```

---

## 🎯 Dicas e Boas Práticas

### 1. Revalidação de Cache

```typescript
// Revalidar a cada 60 segundos (ótimo para notícias)
const posts = await getPosts({ revalidate: 60 })

// Revalidar a cada 1 hora (ótimo para dados que mudam pouco)
const settings = await getSiteSettings(3600)

// Sem cache (sempre buscar dados frescos)
const posts = await getPosts({ revalidate: 0 })
```

### 2. Tratamento de Erros

```typescript
try {
  const posts = await getPosts()
  
  if (posts.length === 0) {
    return <EmptyState message="Nenhum post encontrado" />
  }
  
  return <PostsList posts={posts} />
} catch (error) {
  console.error('Erro ao buscar posts:', error)
  return <ErrorState message="Erro ao carregar posts" />
}
```

### 3. Loading States

```typescript
import { Suspense } from 'react'

export default function Page() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <LatestNews />
    </Suspense>
  )
}
```

### 4. TypeScript

```typescript
import type { Post, Event, Columnist } from '@/lib/payload/types'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  // TypeScript vai autocompletar as propriedades do post
  return <div>{post.title}</div>
}
```

---

## 📚 Recursos Adicionais

- [Documentação PayloadCMS](https://payloadcms.com/docs)
- [API REST Reference](https://payloadcms.com/docs/rest-api/overview)
- [Queries Avançadas](https://payloadcms.com/docs/queries/overview)
- [PAYLOAD_README.md](./PAYLOAD_README.md) - Documentação completa
- [INTEGRACAO_PAYLOAD.md](./INTEGRACAO_PAYLOAD.md) - Resumo da integração

---

**💡 Precisa de mais exemplos?** Consulte a página de exemplo em `/cms-example` ou a documentação oficial do PayloadCMS.










