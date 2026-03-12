import type { SupabaseClient } from '@supabase/supabase-js'

export interface Post {
  id: string
  user_id: string
  content: string
  image_url: string | null
  scheduled_at: string | null
  position: number
  is_public: boolean
  created_at: string
  updated_at: string
}

export interface PostPayload {
  user_id: string
  content: string
  image_url?: string | null
  scheduled_at?: string | null
  position: number
  is_public?: boolean
}

export function fetchPosts(supabase: SupabaseClient, userId: string) {
  return supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('position', { ascending: true })
}

export function createPost(supabase: SupabaseClient, payload: PostPayload) {
  return supabase.from('posts').insert(payload)
}

export function updatePost(supabase: SupabaseClient, id: string, payload: Partial<PostPayload>) {
  return supabase.from('posts').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id)
}

export function deletePost(supabase: SupabaseClient, id: string) {
  return supabase.from('posts').delete().eq('id', id)
}

export async function swapPositions(
  supabase: SupabaseClient,
  idA: string,
  posA: number,
  idB: string,
  posB: number
) {
  const { error } = await updatePost(supabase, idA, { position: posB } as Partial<PostPayload>)
  if (error) return { error }
  return await updatePost(supabase, idB, { position: posA } as Partial<PostPayload>)
}