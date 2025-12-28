import { getPublicSupabaseClient } from './public-client'

export async function getPosts(options: {
    limit?: number
    offset?: number
    category?: string
    tag?: string
    status?: 'published' | 'draft'
    featured?: boolean
} = {}) {
    const supabase = getPublicSupabaseClient()
    let query = supabase
        .from('posts')
        .select(`
      *,
      category:categories(id, name, slug),
      author:profiles!author_id(id, name, slug, avatar_url, bio, social_links),
      columnist:columnists(id, name, slug, photo_url),
      cover_image_url
    `)
        .order('published_at', { ascending: false })

    if (options.limit) {
        query = query.range(options.offset || 0, (options.offset || 0) + options.limit - 1)
    }

    if (options.status) {
        query = query.eq('status', options.status)
    }

    if (options.featured !== undefined) {
        query = query.eq('featured_home', options.featured)
    }

    if (options.category) {
        query = query.filter('categories.slug', 'eq', options.category)
    }

    const { data, error } = await query
    if (error) {
        console.error('Error fetching posts from Supabase:', error)
        return []
    }

    // Process authors: prefer profiles, fallback to columnists
    return (data || []).map(post => {
        const author = post.author || post.columnist || { name: 'Redação' }
        return {
            ...post,
            author: {
                ...author,
                avatar_url: (author as any).avatar_url || (author as any).photo_url
            }
        }
    })
}

export async function getPostBySlug(slug: string) {
    const supabase = getPublicSupabaseClient()
    const { data, error } = await supabase
        .from('posts')
        .select(`
      *,
      category:categories(id, name, slug),
      author:profiles!author_id(id, name, slug, avatar_url, bio, social_links, title, website),
      columnist:columnists(id, name, slug, bio, photo_url, instagram_url, twitter_url),
      cover_image_url
    `)
        .eq('slug', slug)
        .single()

    if (error) {
        console.error(`Error fetching post ${slug}:`, error)
        return null
    }

    // Process author
    const profileAuthor = data.author
    const columnistAuthor = data.columnist

    let author: any = null
    if (profileAuthor) {
        author = {
            id: profileAuthor.id,
            name: profileAuthor.name,
            slug: profileAuthor.slug,
            bio: profileAuthor.bio,
            avatar_url: profileAuthor.avatar_url,
            title: profileAuthor.title,
            website: profileAuthor.website,
            twitter_url: profileAuthor.social_links?.twitter ? `https://twitter.com/${profileAuthor.social_links.twitter}` : null,
            instagram_url: profileAuthor.social_links?.instagram ? `https://instagram.com/${profileAuthor.social_links.instagram}` : null,
            linkedin_url: profileAuthor.social_links?.linkedin ? `https://linkedin.com/in/${profileAuthor.social_links.linkedin}` : null
        }
    } else if (columnistAuthor) {
        author = {
            ...columnistAuthor,
            avatar_url: columnistAuthor.photo_url
        }
    } else {
        author = { name: 'Redação', bio: 'Equipe de jornalismo EdaShow.' }
    }

    return {
        ...data,
        author
    }
}


export async function getCategories() {
    const supabase = getPublicSupabaseClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })

    if (error) {
        console.error('Error fetching categories:', error)
        return []
    }
    return data || []
}

export async function getSponsors(options: { active?: boolean } = {}) {
    const supabase = getPublicSupabaseClient()

    let query = supabase.from('sponsors').select('*').order('display_order', { ascending: true })

    if (options.active) query = query.eq('active', true)


    const { data, error } = await query
    if (error) {
        console.error('Error fetching sponsors:', error)
        return []
    }
    return data || []
}

export async function getEvents(options: { limit?: number, status?: string } = {}) {
    const supabase = getPublicSupabaseClient()
    let query = supabase.from('events').select('*').order('event_date', { ascending: true })

    if (options.limit) query = query.limit(options.limit)
    if (options.status) query = query.eq('status', options.status)

    const { data, error } = await query
    if (error) {
        console.error('Error fetching events:', error)
        return []
    }
    return data || []
}

export async function getEventBySlug(slug: string) {
    const supabase = getPublicSupabaseClient()
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error(`Error fetching event ${slug}:`, error)
        return null
    }
    return data
}

export async function getColumnists(options: { limit?: number } = {}) {
    const supabase = getPublicSupabaseClient()
    let query = supabase.from('columnists').select('*')
    if (options.limit) query = query.limit(options.limit)

    const { data, error } = await query
    if (error) {
        console.error('Error fetching columnists:', error)
        return []
    }
    return data || []
}

export async function getColumnistBySlug(slug: string) {
    const supabase = getPublicSupabaseClient()
    const { data, error } = await supabase
        .from('columnists')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error(`Error fetching columnist ${slug}:`, error)
        return null
    }
    return data
}

export async function getCategoryBySlug(slug: string) {
    const supabase = getPublicSupabaseClient()
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error(`Error fetching category ${slug}:`, error)
        return null
    }
    return data
}

export function getImageUrl(media: any, size: 'card' | 'hero' | 'full' = 'full') {
    if (!media) return '/placeholder.jpg'
    if (typeof media === 'string') return media
    return media.url || '/placeholder.jpg'
}
