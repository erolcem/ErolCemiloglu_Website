import { createAdminClient } from '@/lib/supabase/admin'
import TodoCentralList from './_components/TodoCentralList'
import AddGeneralTodo from './_components/AddGeneralTodo'

export const dynamic = 'force-dynamic'

type EntityType = 'project' | 'skill' | 'general'

export default async function TodosPage() {
  const supabase = createAdminClient()

  const [{ data: todos }, { data: projects }, { data: skills }] = await Promise.all([
    supabase
      .from('item_todos')
      .select('id, entity_type, entity_id, title, is_done')
      .order('is_done', { ascending: true })
      .order('id', { ascending: false }),
    supabase.from('projects').select('id, title, is_public'),
    supabase.from('skills').select('id, title, is_public'),
  ])

  const projectMap = new Map((projects ?? []).map(p => [p.id, p]))
  const skillMap   = new Map((skills   ?? []).map(s => [s.id, s]))

  type Group = {
    entity: { type: EntityType; id: number | null; title: string; is_public: boolean | null }
    todos: NonNullable<typeof todos>
  }

  const groups = new Map<string, Group>()

  // General/standalone group always appears first
  groups.set('general', {
    entity: { type: 'general', id: null, title: 'General', is_public: null },
    todos: [],
  })

  for (const todo of todos ?? []) {
    if (todo.entity_type === 'general') {
      groups.get('general')!.todos.push(todo)
      continue
    }

    const key = `${todo.entity_type}-${todo.entity_id}`
    if (!groups.has(key)) {
      const map = todo.entity_type === 'project' ? projectMap : skillMap
      const entity = map.get(todo.entity_id)
      groups.set(key, {
        entity: {
          type: todo.entity_type as EntityType,
          id: todo.entity_id,
          title: entity?.title ?? `Unknown #${todo.entity_id}`,
          is_public: entity?.is_public ?? false,
        },
        todos: [],
      })
    }
    groups.get(key)!.todos.push(todo)
  }

  const grouped = Array.from(groups.values())
  const totalPending = (todos ?? []).filter(t => !t.is_done).length

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-100">Todos</h1>
        <p className="text-neutral-500 text-sm mt-0.5">
          {totalPending} pending across projects, skills &amp; general tasks
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {grouped.map(({ entity, todos: groupTodos }) => (
          <div
            key={entity.type === 'general' ? 'general' : `${entity.type}-${entity.id}`}
            className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden"
          >
            {/* Group header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                {entity.type !== 'general' && (
                  <span className={`text-xs px-2 py-0.5 rounded border ${
                    entity.type === 'project'
                      ? 'text-blue-400 border-blue-800/40 bg-blue-900/20'
                      : 'text-purple-400 border-purple-800/40 bg-purple-900/20'
                  }`}>
                    {entity.type}
                  </span>
                )}
                <span className="text-sm font-medium text-neutral-200">{entity.title}</span>
              </div>
              <div className="flex items-center gap-3">
                {entity.is_public !== null && (
                  <span className={`text-xs ${entity.is_public ? 'text-emerald-500' : 'text-neutral-600'}`}>
                    {entity.is_public ? 'Live' : 'Draft'}
                  </span>
                )}
                {entity.type !== 'general' && entity.id && (
                  <a
                    href={`/ec-admin/${entity.type === 'project' ? 'projects' : 'skills'}/${entity.id}`}
                    className="text-xs text-neutral-600 hover:text-blue-400 transition-colors"
                  >
                    Edit →
                  </a>
                )}
              </div>
            </div>

            {/* Todos list */}
            {groupTodos.length > 0 ? (
              <TodoCentralList
                todos={groupTodos}
                entityType={entity.type}
                entityId={entity.id}
              />
            ) : (
              entity.type === 'general' && (
                <p className="text-neutral-600 text-sm px-4 py-4 text-center">
                  No general tasks yet.
                </p>
              )
            )}

            {/* Inline add form — only on the General group */}
            {entity.type === 'general' && (
              <div className="px-4 py-3 border-t border-neutral-800">
                <AddGeneralTodo />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
