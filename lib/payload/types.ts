/**
 * Tipos TypeScript auxiliares para o PayloadCMS
 * 
 * Nota: Os tipos completos são gerados automaticamente em payload-types.ts
 * quando você inicia o servidor. Estes são tipos auxiliares para desenvolvimento.
 */

export interface Media {
  id: string
  alt?: string
  caption?: string
  url: string
  filename: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  sizes?: {
    thumbnail?: {
      url: string
      width: number
      height: number
      mimeType: string
      filesize: number
      filename: string
    }
    card?: {
      url: string
      width: number
      height: number
      mimeType: string
      filesize: number
      filename: string
    }
    tablet?: {
      url: string
      width: number
      height: number
      mimeType: string
      filesize: number
      filename: string
    }
  }
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'author'
  createdAt: string
  updatedAt: string
}

export interface Columnist {
  id: string
  name: string
  slug: string
  bio?: string
  photo?: Media | string
  role?: string
  social?: {
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  createdAt: string
  updatedAt: string
}

export interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  content: any // Rich text content
  featuredImage?: Media | string
  category: 'news' | 'analysis' | 'interviews' | 'opinion'
  tags?: Array<{ tag: string; id?: string }>
  author?: Columnist | string
  status: 'draft' | 'published' | 'archived'
  publishedDate?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description?: any // Rich text content
  image?: Media | string
  startDate: string
  endDate?: string
  location?: string
  eventType?: 'in-person' | 'online' | 'hybrid'
  registrationUrl?: string
  status: 'upcoming' | 'ongoing' | 'finished' | 'cancelled'
  organizers?: Array<{
    name: string
    company: string
    email?: string
    photo?: Media | string
    role?: string
    id?: string
  }>
  sponsors?: Array<{
    name: string
    logo?: Media | string
    website?: string
    sponsorshipType?: 'gold' | 'silver' | 'bronze'
    id?: string
  }>
  speakers?: Array<{
    name: string
    photo?: Media | string
    company: string
    role: string
    bio?: string
    talkTitle?: string
    id?: string
  }>
  createdAt: string
  updatedAt: string
}

export interface SiteSettings {
  id: string
  siteName: string
  siteDescription?: string
  logo?: Media | string
  favicon?: Media | string
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  updatedAt: string
  createdAt: string
}

export interface Header {
  id: string
  navigation?: Array<{
    label: string
    url: string
    id?: string
  }>
  updatedAt: string
  createdAt: string
}

export interface Footer {
  id: string
  copyright?: string
  links?: Array<{
    label: string
    url: string
    id?: string
  }>
  updatedAt: string
  createdAt: string
}

// Tipos de resposta da API
export interface PaginatedResponse<T> {
  docs: T[]
  totalDocs: number
  limit: number
  totalPages: number
  page: number
  pagingCounter: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage: number | null
  nextPage: number | null
}

export interface APIError {
  errors: Array<{
    message: string
    name?: string
    data?: any
  }>
}










