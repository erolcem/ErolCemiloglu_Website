'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

type EntityType = 'project' | 'skill' | 'general'

function revalidateAll(entityType: EntityType, entityId: number | null) {
  revalidatePath('/ec-admin/todos')
  if (entityType === 'project' && entityId) revalidatePath(`/ec-admin/projects/${entityId}`)
  if (entityType === 'skill' && entityId) revalidatePath(`/ec-admin/skills/${entityId}`)
}

export async function addTodo(entityType: EntityType, entityId: number | null, title: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('item_todos')
    .insert({ entity_type: entityType, entity_id: entityId, title })
  if (error) {
    console.error('[addTodo]', error.message)
    return { error: error.message }
  }
  revalidateAll(entityType, entityId)
}

export async function toggleTodo(
  todoId: number,
  currentDone: boolean,
  entityType: EntityType,
  entityId: number | null
) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('item_todos')
    .update({ is_done: !currentDone })
    .eq('id', todoId)
  if (error) console.error('[toggleTodo]', error.message)
  revalidateAll(entityType, entityId)
}

export async function deleteTodo(
  todoId: number,
  entityType: EntityType,
  entityId: number | null
) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('item_todos').delete().eq('id', todoId)
  if (error) console.error('[deleteTodo]', error.message)
  revalidateAll(entityType, entityId)
}
