'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const NAV_ITEMS = [
  { href: '/ec-admin', label: 'Dashboard', exact: true },
  { href: '/ec-admin/projects', label: 'Projects' },
  { href: '/ec-admin/skills', label: 'Skills' },
  { href: '/ec-admin/todos', label: 'Todos' },
  { href: '/ec-admin/career-ops', label: 'Career Ops' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/ec-admin/login')
    router.refresh()
  }

  return (
    <aside className="w-52 shrink-0 bg-neutral-900 border-r border-neutral-800 flex flex-col min-h-screen">
      <div className="px-5 py-6 border-b border-neutral-800">
        <p className="text-neutral-100 font-semibold text-sm">EC Portal</p>
        <p className="text-neutral-600 text-xs mt-0.5">Command Center</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ href, label, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                active
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-neutral-800">
        <button
          onClick={handleSignOut}
          className="w-full px-3 py-2 rounded text-sm text-neutral-500 hover:text-red-400 hover:bg-neutral-800/50 transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}