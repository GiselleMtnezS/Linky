"use client"

import { useUser } from '@auth0/nextjs-auth0'

/**
 * Client-side auth hook.
 * For server components, import auth0 from @/lib/auth0 and call auth0.getSession() directly.
 */
export const useAuth = () => {
  const { user, isLoading, error } = useUser()

  const login = (returnTo?: string) => {
    window.location.href = returnTo
      ? `/?returnTo=${encodeURIComponent(returnTo)}`
      : '/'
  }

  const logout = () => {
    window.location.href = '/auth/logout'
  }

  return { user, isLoading, error, login, logout }
}
