import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import SkillForm from '../_components/SkillForm'
import TodoList from '@/components/admin/TodoList'
import { updateSkill } from '../actions'

export const dynamic = 'force-dynamic'

export default async function EditSkillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const skillId = parseInt(id)

  const supabase = createAdminClient()

  const [{ data: skill }, { data: todos }] = await Promise.all([
    supabase.from('skills').select('*').eq('id', skillId).single(),
    supabase
      .from('item_todos')
      .select('id, title, is_done')
      .eq('entity_type', 'skill')
      .eq('entity_id', skillId)
      .order('id', { ascending: true }),
  ])

  if (!skill) notFound()

  const updateWithId = updateSkill.bind(null, skillId)

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/ec-admin/skills" className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">
        ← Skills
      </Link>

      <h1 className="text-2xl font-bold text-neutral-100 mb-1 mt-3">{skill.title}</h1>
      <p className="text-neutral-500 text-sm mb-8">
        {skill.is_public
          ? <span className="text-emerald-400">Live on public site</span>
          : <span className="text-neutral-500">Draft — not visible publicly</span>
        }
      </p>

      <SkillForm action={updateWithId} defaultValues={skill} submitLabel="Save Changes" />

      <TodoList entityType="skill" entityId={skillId} todos={todos ?? []} />
    </div>
  )
}
