import { describe, it, expect, vi } from 'vitest'
import { createPost, deletePost } from './posts.service'

const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
}

describe('posts.service', () => {
  it('createPost calls supabase insert', async () => {
    await createPost(mockSupabase, { content: 'New post', position: 0, user_id: 'auth0|test' })
    expect(mockSupabase.from).toHaveBeenCalledWith('posts')
    expect(mockSupabase.insert).toHaveBeenCalled()
  })

  it('deletePost calls supabase delete with correct id', async () => {
    await deletePost(mockSupabase, 'post-1')
    expect(mockSupabase.delete).toHaveBeenCalled()
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'post-1')
  })
})
