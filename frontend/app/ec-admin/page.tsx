import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Fetch counts for the dashboard overview
  const [{ count: projectCount }, { count: skillCount }, { count: taskCount }] =
    await Promise.all([
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('skills').select('*', { count: 'exact', head: true }),
      supabase.from('career_ops_tasks').select('*', { count: 'exact', head: true }).neq('status', 'archived'),
    ])

  const stats = [
    { label: 'Total Projects', value: projectCount ?? 0, accent: 'text-blue-400' },
    { label: 'Total Skills', value: skillCount ?? 0, accent: 'text-emerald-400' },
    { label: 'Active Career Tasks', value: taskCount ?? 0, accent: 'text-purple-400' },
  ]

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-neutral-100 mb-1">Command Center</h1>
      <p className="text-neutral-500 text-sm mb-8">Your private career operating system.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-5"
          >
            <p className="text-neutral-500 text-xs tracking-wide uppercase mb-2">{s.label}</p>
            <p className={`text-4xl font-bold ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <QuickLink href="/ec-admin/projects" title="Projects" description="Manage portfolio projects. Toggle is_public to push live." color="blue" />
        <QuickLink href="/ec-admin/skills" title="Skills & Tools" description="Manage skills bento grid. Attach learning todos." color="emerald" />
        <QuickLink href="/ec-admin/career-ops" title="Career Ops" description="Job applications, networking, LinkedIn tasks." color="purple" />
      </div>
    </div>
  )
}

function QuickLink({
  href,
  title,
  description,
  color,
}: {
  href: string
  title: string
  description: string
  color: 'blue' | 'emerald' | 'purple'
}) {
  const borderMap = {
    blue: 'border-blue-800/40 hover:border-blue-600/60',
    emerald: 'border-emerald-800/40 hover:border-emerald-600/60',
    purple: 'border-purple-800/40 hover:border-purple-600/60',
  }
  const textMap = {
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
  }

  return (
    <a
      href={href}
      className={`bg-neutral-900 border ${borderMap[color]} rounded-lg p-5 block transition-colors group`}
    >
      <p className={`font-semibold ${textMap[color]} mb-1`}>{title}</p>
      <p className="text-neutral-500 text-sm">{description}</p>
    </a>
  )
}