'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type AppRole = 'admin' | 'editor' | 'author' | 'columnist' | 'contributor' | 'user'

export interface User {
    id: string
    email: string
    name: string
    role: AppRole
    created_at: string
    last_sign_in?: string
    slug?: string
    bio?: string
    avatar_url?: string
    website?: string
    social_links?: any
    is_public?: boolean
    title?: string
}

export async function getUsers(): Promise<User[]> {
    const supabase = await createClient()

    // Get all users from profiles and join with user_roles
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        return []
    }

    // Get roles for all users
    const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*')

    if (rolesError) {
        console.error('Error fetching roles:', rolesError)
    }

    const rolesMap = new Map(roles?.map(r => [r.user_id, r.role]) || [])

    return profiles.map(profile => ({
        id: profile.id,
        email: profile.email || '',
        name: profile.name || profile.email?.split('@')[0] || 'Sem nome',
        role: (rolesMap.get(profile.id) || 'user') as AppRole,
        created_at: profile.created_at,
        last_sign_in: profile.last_sign_in_at,
        slug: profile.slug,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        website: profile.website,
        social_links: profile.social_links,
        is_public: profile.is_public,
        title: profile.title
    }))
}

export async function updateUserRole(userId: string, role: AppRole): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()

    // Check if role exists for user
    const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .single()

    if (existingRole) {
        // Update existing role
        const { error } = await supabase
            .from('user_roles')
            .update({ role, updated_at: new Date().toISOString() })
            .eq('user_id', userId)

        if (error) {
            console.error('Error updating role:', error)
            return { success: false, error: error.message }
        }
    } else {
        // Insert new role
        const { error } = await supabase
            .from('user_roles')
            .insert({ user_id: userId, role })

        if (error) {
            console.error('Error inserting role:', error)
            return { success: false, error: error.message }
        }
    }

    revalidatePath('/cms/settings/users')
    return { success: true }
}

export async function updateUserProfile(userId: string, data: Partial<User>): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()

    // Filter out fields that are not in the profiles table
    const { id, role, created_at, last_sign_in, email, ...updateData } = data as any

    const { error } = await supabase
        .from('profiles')
        .update({
            ...updateData,
            updated_at: new Date().toISOString()
        })
        .eq('id', userId)

    if (error) {
        console.error('Error updating profile:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/cms/settings/users')
    return { success: true }
}

export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()

    // Delete role first
    await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)

    // Delete profile
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

    if (error) {
        console.error('Error deleting user:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/cms/settings/users')
    return { success: true }
}

export async function createUser(data: { email: string; password: string; name: string; role: AppRole }): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                name: data.name
            }
        }
    })

    if (authError) {
        console.error('Error creating user:', authError)
        return { success: false, error: authError.message }
    }

    if (authData.user) {
        // Create profile
        await supabase
            .from('profiles')
            .upsert({
                id: authData.user.id,
                email: data.email,
                name: data.name,
                slug: data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            })

        // Create role
        await supabase
            .from('user_roles')
            .upsert({
                user_id: authData.user.id,
                role: data.role
            })
    }

    revalidatePath('/cms/settings/users')
    return { success: true }
}

