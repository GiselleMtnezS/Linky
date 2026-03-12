import { renderHook, waitFor } from '@testing-library/react'
import { usePosts } from '@/hooks/usePosts'

vi.mock('@/lib/supabase', () => ({
  createSupabaseClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          order: () => Promise.resolve({
            data: [{ id: 'post-1', content: 'Test post', position: 0 }],
            error: null,
          })
        })
      })
    })
  })
}))

describe('usePosts', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => usePosts('auth0|test', 'mock-token'))
    expect(result.current.loading).toBe(true)
  })

  it('fetches posts on mount', async () => {
    const { result } = renderHook(() => usePosts('auth0|test', 'mock-token'))
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.posts).toHaveLength(1)
    expect(result.current.posts[0].content).toBe('Test post')
  })
})
