import { http, HttpResponse } from 'msw'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co'

export const handlers = [
  // GET posts
  http.get(`${SUPABASE_URL}/rest/v1/posts`, () => {
    return HttpResponse.json([
      {
        id: 'post-1',
        user_id: 'auth0|test',
        content: 'This is a test post about systems thinking.',
        image_url: null,
        scheduled_at: '2026-03-15T10:00:00Z',
        position: 0,
        is_public: false,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
      {
        id: 'post-2',
        user_id: 'auth0|test',
        content: 'Another test post about biomechanics.',
        image_url: 'https://res.cloudinary.com/test/image/upload/v1/test.jpg',
        scheduled_at: null,
        position: 1,
        is_public: false,
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ])
  }),

  // POST (create)
  http.post(`${SUPABASE_URL}/rest/v1/posts`, () => {
    return HttpResponse.json({ id: 'new-post-id' }, { status: 201 })
  }),

  // PATCH (update)
  http.patch(`${SUPABASE_URL}/rest/v1/posts`, () => {
    return HttpResponse.json({})
  }),

  // DELETE
  http.delete(`${SUPABASE_URL}/rest/v1/posts`, () => {
    return HttpResponse.json({})
  }),
]
