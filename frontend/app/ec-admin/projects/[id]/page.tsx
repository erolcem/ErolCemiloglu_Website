import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/admin'
import ProjectForm from '../_components/ProjectForm'
import TodoList from '@/components/admin/TodoList'
import { updateProject } from '../actions'

export const dynamic = 'force-dynamic'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const projectId = parseInt(id)

  const supabase = createAdminClient()

  const [{ data: project }, { data: todos }] = await Promise.all([
    supabase.from('projects').select('*').eq('id', projectId).single(),
    supabase
      .from('item_todos')
      .select('id, title, is_done')
      .eq('entity_type', 'project')
      .eq('entity_id', projectId)
      .order('id', { ascending: true }),
  ])

  if (!project) notFound()

  const updateWithId = updateProject.bind(null, projectId)

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-2 mb-1">
        <Link href="/ec-admin/projects" className="text-neutral-500 hover:text-neutral-300 text-sm transition-colors">
          ← Projects
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-neutral-100 mb-1 mt-3">{project.title}</h1>
      <p className="text-neutral-500 text-sm mb-8">
        {project.is_public
          ? <span className="text-emerald-400">Live on public site</span>
          : <span className="text-neutral-500">Draft — not visible publicly</span>
        }
      </p>

      <ProjectForm
        action={updateWithId}
        defaultValues={{
          ...project,
          tech_stack: Array.isArray(project['tech stack']) ? project['tech stack'] : [],
        }}
        submitLabel="Save Changes"
      />

      <TodoList entityType="project" entityId={projectId} todos={todos ?? []} />
    </div>
  )
}