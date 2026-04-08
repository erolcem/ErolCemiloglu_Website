import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import ProjectRow from './_components/ProjectRow'

export const dynamic = 'force-dynamic'

export default async function AdminProjectsPage() {
  const supabase = createAdminClient()
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, category, year, is_public')
    .order('year', { ascending: false })
    .order('id', { ascending: false })

  const total = projects?.length ?? 0
  const live = projects?.filter(p => p.is_public).length ?? 0

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Projects</h1>
          <p className="text-neutral-500 text-sm mt-0.5">
            {live} live · {total - live} draft
          </p>
        </div>
        <Link
          href="/ec-admin/projects/new"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
        >
          + New Project
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Title</th>
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Category</th>
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Year</th>
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Status</th>
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects && projects.length > 0 ? (
              projects.map(project => (
                <ProjectRow key={project.id} project={project} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-neutral-600 text-sm">
                  No projects yet.{' '}
                  <Link href="/ec-admin/projects/new" className="text-blue-400 hover:text-blue-300">
                    Create one.
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}