'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getEvents() {
    const supabase = await createClient()
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: false })

    if (error) throw error
    return data
}

export async function saveEvent(data: any) {
    const supabase = await createClient()
    const { id, ...eventData } = data

    let result
    if (id === 'new') {
        result = await supabase.from('events').insert([eventData]).select().single()
    } else {
        result = await supabase.from('events').update(eventData).eq('id', id).select().single()
    }

    if (result.error) throw result.error
    revalidatePath('/cms/events')
    revalidatePath('/')
    return result.data
}

export async function deleteEvent(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) throw error
    revalidatePath('/cms/events')
    revalidatePath('/')
}
