'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPost(id: string) {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('posts')
        .select(`
            *,
            categories(*),
            columnists(*),
            author:author_id(*)
        `)
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function savePost(data: any) {
    const supabase = await createClient()
    const { id, categories, columnists, author, ...postData } = data

    // Clean up data for database insert/update
    // We keep columnist_id for now for backward compatibility if the DB still uses it,
    // but we prioritize author_id (profiles.id)

    let result
    if (id === 'new' || !id) {
        result = await supabase.from('posts').insert([postData]).select().single()
    } else {
        result = await supabase.from('posts').update(postData).eq('id', id).select().single()
    }

    if (result.error) throw result.error

    revalidatePath('/cms/posts')
    revalidatePath('/')
    revalidatePath(`/posts/${result.data.slug}`)
    return result.data
}

export async function autoSavePost(data: any) {
    const supabase = await createClient()
    const { id, categories, columnists, author, ...postData } = data

    if (!id || id === 'new') return null

    const { data: result, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single()

    if (error) throw error
    return result
}


export async function deletePost(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('posts').delete().eq('id', id)

    if (error) throw error

    revalidatePath('/cms/posts')
    revalidatePath('/')
}

export async function getCategories() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('categories').select('*').order('name')
    if (error) throw error
    return data
}

export async function getColumnists() {
    const supabase = await createClient()
    const { data, error } = await supabase.from('columnists').select('*').order('name')
    if (error) throw error
    return data
}

/**
 * Fetches all users who can be authors (all roles except 'user')
 */
export async function getAuthors() {
    const supabase = await createClient()

    // Get users with CMS roles
    const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('role', ['admin', 'editor', 'author', 'columnist', 'contributor'])

    if (rolesError) throw rolesError

    if (!roles || roles.length === 0) return []

    const userIds = roles.map(r => r.user_id)

    const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, name, email')
        .in('id', userIds)
        .order('name')

    if (profileError) throw profileError
    return profiles
}

