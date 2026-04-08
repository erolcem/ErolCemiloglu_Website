import { createClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS. Only used in server actions / server-side
// admin operations. NEVER import this in any 'use client' file.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}