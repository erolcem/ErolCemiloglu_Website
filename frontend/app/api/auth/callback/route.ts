import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Supabase sends the user here after email confirmation / magic link.
// We exchange the ?code= param for a real session cookie, then redirect
// into the admin portal.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/ec-admin'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong — bounce back to login with an error flag
  return NextResponse.redirect(`${origin}/ec-admin/login?error=auth_failed`)
}