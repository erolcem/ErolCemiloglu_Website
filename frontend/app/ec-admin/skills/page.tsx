import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import SkillRow from './_components/SkillRow'

export const dynamic = 'force-dynamic'

export default async function AdminSkillsPage() {
  const supabase = createAdminClient()
  const { data: skills } = await supabase
    .from('skills')
    .select('id, title, category, is_wide, is_public')
    .order('id', { ascending: true })

  const total = skills?.length ?? 0
  const live = skills?.filter(s => s.is_public).length ?? 0

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Skills</h1>
          <p className="text-neutral-500 text-sm mt-0.5">{live} live · {total - live} draft</p>
        </div>
        <Link
          href="/ec-admin/skills/new"
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded transition-colors"
        >
          + New Skill
        </Link>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-800">
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Title</th>
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Category</th>
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Layout</th>
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Status</th>
              <th className="text-left py-3 px-4 text-neutral-500 text-xs font-medium tracking-wide uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skills && skills.length > 0 ? (
              skills.map(skill => <SkillRow key={skill.id} skill={skill} />)
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-neutral-600 text-sm">
                  No skills yet.{' '}
                  <Link href="/ec-admin/skills/new" className="text-blue-400 hover:text-blue-300">Create one.</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
