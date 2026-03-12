import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { auth0 } from '@/lib/auth0'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Redirect /auth/* to /linky/auth/*
  if (pathname.startsWith('/auth/')) {
    const url = request.nextUrl.clone()
    url.pathname = `/linky${pathname}`
    return NextResponse.redirect(url)
  }

  return await auth0.middleware(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
