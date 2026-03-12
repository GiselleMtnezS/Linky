import { redirect } from 'next/navigation'
import { auth0 } from '@/lib/auth0'

export default async function HomePage() {
  const session = await auth0.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-surface-subtle">
      <div className="text-center space-y-6 animate-fade-in">
        <h1 className="font-display text-5xl text-ink tracking-tight">Linky</h1>
        <p className="text-ink-secondary text-base max-w-xs mx-auto leading-relaxed">
          Plan, write, and visualize your LinkedIn content — all in one timeline.
        </p>
        <a
          href="/auth/login"
          className="btn-primary mx-auto px-8 py-3 text-base"
        >
          Get started
        </a>
      </div>
    </main>
  )
}
