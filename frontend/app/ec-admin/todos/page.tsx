import { createAdminClient } from '@/lib/supabase/admin'
import TodoBoard from './_components/TodoBoard'
import type { Group } from './_components/TodoBoard'

export const dynamic = 'force-dynamic'

type EntityType = 'project' | 'skill' | 'general'

export default async function TodosPage() {
  const supabase = createAdminClient()

  const [{ data: todos }, { data: projects }, { data: skills }] = await Promise.all([
    supabase
      .from('item_todos')
      .select('id, entity_type, entity_id, title, is_done, description, due_date, position')
      .eq('is_archived', false)
      .order('is_done', { ascending: true })
      .order('position', { ascending: false }),
    supabase.from('projects').select('id, title, is_public'),
    supabase.from('skills').select('id, title, is_public'),
  ])

  const projectMap = new Map((projects ?? []).map(p => [p.id, p]))
  const skillMap   = new Map((skills   ?? []).map(s => [s.id, s]))

  const groups = new Map<string, Group>()

  // General/standalone group always appears first
  groups.set('general', {
    id: 'general',
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
        id: key,
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
    <TodoBoard initialGroups={grouped} totalPending={totalPending} />
  )
}
