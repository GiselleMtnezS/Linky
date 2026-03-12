import { auth0 } from '@/lib/auth0'
import { createSupabaseClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Example Route Handler — GET + POST.
 *
 * Pattern for every API route:
 * 1. Get session — return 401 if unauthenticated
 * 2. Create a fresh Supabase client with the access token
 * 3. Query — RLS ensures users can only touch their own rows
 *
 * Replace `posts` with your actual table name.
 */

export async function GET() {
  const session = await auth0.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseClient(session.tokenSet.accessToken)

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  const session = await auth0.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const supabase = createSupabaseClient(session.tokenSet.accessToken)

  const { data, error } = await supabase
    .from('posts')
    .insert({
      ...body,
      user_id: session.user.sub, // Auth0 sub — matches RLS policy
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
