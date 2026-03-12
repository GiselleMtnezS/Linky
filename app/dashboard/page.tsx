import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth0'
import { createSupabaseClient } from '@/lib/supabase'
import TimelineClient from '@/components/Timeline/TimelineClient'

export default async function DashboardPage() {
  const session = await auth0.getSession()

  if (!session) {
    redirect('linky/auth/login')
  }

  const { user, tokenSet } = session
  const supabase = createSupabaseClient(tokenSet.accessToken!)

  const { error: upsertError } = await supabase.from('users').upsert({
    id: user.sub,
    name: user.name,
    email: user.email,
  }, { onConflict: 'id' })

  if (upsertError) {
    console.error('User upsert failed:', upsertError.message)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">Something went wrong. Please try refreshing.</p>
      </main>
    )
  }

  return (
    <TimelineClient
      userId={user.sub!}
      accessToken={tokenSet.accessToken!}
      userName={user.name ?? user.email ?? 'there'}
    />
  )
}