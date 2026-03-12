/**
 * Example test — Dashboard page component.
 *
 * Shows the core pattern:
 * - Mock Auth0 session
 * - Mock Supabase client (prevents env var validation before MSW can intercept)
 * - Assert rendered output
 *
 * Add per-project tests following this pattern.
 */
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock Auth0 server-side session
vi.mock('@/lib/auth0', () => ({
  auth0: {
    getSession: vi.fn().mockResolvedValue({
      user: { name: 'Test User', email: 'test@example.com', sub: 'auth0|123' },
      tokenSet: { accessToken: 'mock-access-token' },
    }),
  },
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Mock TimelineClient — not under test here
vi.mock('@/components/Timeline/TimelineClient', () => ({
  default: () => <div>Timeline</div>,
}))

// Mock Supabase client factory.
// Supabase validates env vars in createClient() before any HTTP call,
// so we stub the whole factory and control return data per-test.
const mockSelect = vi.fn()
const mockUpsert = vi.fn().mockResolvedValue({ error: null })

vi.mock('@/lib/supabase', () => ({
  createSupabaseClient: () => ({
    from: (table: string) => {
      if (table === 'users') {
        return { upsert: mockUpsert }
      }
      return {
        select: () => ({
          order: mockSelect,
        }),
      }
    },
  }),
}))

// Lazy import after mocks are set up
const getDashboard = () => import('../../app/dashboard/page')

describe('Dashboard', () => {
  it('renders timeline when upsert succeeds', async () => {
    mockUpsert.mockResolvedValue({ error: null })

    const { default: Dashboard } = await getDashboard()
    const jsx = await Dashboard()
    render(jsx)

    expect(screen.getByText('Timeline')).toBeInTheDocument()
  })

  it('renders error state when upsert fails', async () => {
    mockUpsert.mockResolvedValue({ error: { message: 'DB error' } })

    const { default: Dashboard } = await getDashboard()
    const jsx = await Dashboard()
    render(jsx)

    expect(screen.getByText('Something went wrong. Please try refreshing.')).toBeInTheDocument()
  })
})