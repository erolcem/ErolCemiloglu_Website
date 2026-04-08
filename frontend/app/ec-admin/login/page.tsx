'use client'

import { useState, useEffect, Suspense } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

// Isolated into its own component so useSearchParams() is
// inside a Suspense boundary (required by Next.js 16).
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams.get('error') === 'auth_failed') {
      setError('Authentication failed. Try again.')
    }
  }, [searchParams])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/ec-admin')
    router.refresh()
  }

  return (
    <form
      onSubmit={handleLogin}
      className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 flex flex-col gap-5"
    >
      {error && (
        <div className="bg-red-950/40 border border-red-800/60 text-red-400 text-sm rounded px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-neutral-400 text-xs tracking-wide">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-neutral-400 text-xs tracking-wide">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-1 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white text-sm font-medium rounded px-4 py-2.5 transition-colors"
      >
        {loading ? 'Authenticating...' : 'Enter'}
      </button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <p className="text-neutral-600 text-xs text-center mb-8 tracking-widest uppercase">
          System Access
        </p>
        <Suspense fallback={<div className="bg-neutral-900 border border-neutral-800 rounded-lg p-8 h-56" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}