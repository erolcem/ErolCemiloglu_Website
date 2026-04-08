'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

function revalidateAll(entityType: 'project' | 'skill', entityId: number) {
  revalidatePath('/ec-admin/todos')
  if (entityType === 'project') revalidatePath(`/ec-admin/projects/${entityId}`)
  if (entityType === 'skill') revalidatePath(`/ec-admin/skills/${entityId}`)
}

export async function addTodo(entityType: 'project' | 'skill', entityId: number, title: string) {
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
  entityType: 'project' | 'skill',
  entityId: number
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
  entityType: 'project' | 'skill',
  entityId: number
) {
  const supabase = createAdminClient()
  const { error } = await supabase.from('item_todos').delete().eq('id', todoId)
  if (error) console.error('[deleteTodo]', error.message)
  revalidateAll(entityType, entityId)
}
