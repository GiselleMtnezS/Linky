'use client'

import { useState, useEffect, useCallback } from 'react'
import { createSupabaseClient } from '@/lib/supabase'
import {
  fetchPosts,
  createPost,
  updatePost,
  deletePost,
  swapPositions,
} from '@/services/posts.service'
import type { Post, PostPayload } from '@/services/posts.service'

export function usePosts(userId: string, accessToken: string) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseClient(accessToken)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error } = await fetchPosts(supabase, userId)
    if (error) {
      setError(error.message)
    } else {
      setPosts(data ?? [])
    }
    setLoading(false)
  }, [userId, accessToken])

  useEffect(() => {
    load()
  }, [load])

  async function addPost(payload: Omit<PostPayload, 'user_id' | 'position'>) {
    const position = posts.length
    const { error } = await createPost(supabase, { ...payload, user_id: userId, position })
    if (!error) await load()
  }

  async function editPost(id: string, payload: Partial<PostPayload>) {
    const { error } = await updatePost(supabase, id, payload)
    if (!error) await load()
  }

  async function removePost(id: string) {
    const { error } = await deletePost(supabase, id)
    if (!error) await load()
  }

  async function moveUp(index: number) {
    if (index === 0) return
    const newPosts = [...posts]
    const posA = newPosts[index].position
    const posB = newPosts[index - 1].position

    newPosts[index] = { ...newPosts[index], position: posB }
    newPosts[index - 1] = { ...newPosts[index - 1], position: posA }
    newPosts.splice(index - 1, 2, newPosts[index - 1], newPosts[index])
    setPosts([...newPosts].sort((a, b) => a.position - b.position))

    const a = posts[index]
    const b = posts[index - 1]
    const { error } = await swapPositions(supabase, a.id, a.position, b.id, b.position)
    if (error) await load() // roll back on failure
  }

  async function moveDown(index: number) {
    if (index === posts.length - 1) return
    const newPosts = [...posts]
    const posA = newPosts[index].position
    const posB = newPosts[index + 1].position

    newPosts[index] = { ...newPosts[index], position: posB }
    newPosts[index + 1] = { ...newPosts[index + 1], position: posA }
    setPosts([...newPosts].sort((a, b) => a.position - b.position))

    const a = posts[index]
    const b = posts[index + 1]
    const { error } = await swapPositions(supabase, a.id, a.position, b.id, b.position)
    if (error) await load() // roll back on failure
  }

  return { posts, loading, error, addPost, editPost, removePost, moveUp, moveDown }
}
