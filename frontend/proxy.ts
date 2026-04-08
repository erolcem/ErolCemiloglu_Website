import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// ⚠️  RENAME this folder + update the matcher below before production.
// The goal is obscurity (no public links) + hard auth (Supabase session).
const ADMIN_SEGMENT = 'ec-admin'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only intercept admin routes
  if (!pathname.startsWith(`/${ADMIN_SEGMENT}`)) {
    return NextResponse.next()
  }

  // Let the login page through without a session check (chicken-and-egg)
  if (pathname.startsWith(`/${ADMIN_SEGMENT}/login`)) {
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = `/${ADMIN_SEGMENT}/login`
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/ec-admin/:path*',
    '/api/auth/callback',
  ],
}