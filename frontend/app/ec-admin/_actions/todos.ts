'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

type EntityType = 'project' | 'skill' | 'general'

function revalidateAll(entityType: EntityType, entityId: number | null) {
  revalidatePath('/ec-admin/todos')
  if (entityType === 'project' && entityId) revalidatePath(`/ec-admin/projects/${entityId}`)
  if (entityType === 'skill' && entityId) revalidatePath(`/ec-admin/skills/${entityId}`)
}

export async function addTodo(
  entityType: 'project' | 'skill' | 'general',
  entityId: number | null,
  title: string,
  dueDate?: string | null,        // <-- We add the parameter here
  description?: string | null     // <-- And here
) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('item_todos')
    .insert({
      entity_type: entityType,
      entity_id: entityId,
      title: title,
      due_date: dueDate || null,       // <-- Send it to Supabase
      description: description || null // <-- Send it to Supabase
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/ec-admin/todos')
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

export async function editTodo(
  todoId: number,
  title: string,
  dueDate: string | null,
  description: string | null,
  entityType: EntityType,
  entityId: number | null
) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('item_todos')
    .update({ title, due_date: dueDate || null, description: description || null })
    .eq('id', todoId)
    
  if (error) console.error('[editTodo]', error.message)
  revalidateAll(entityType, entityId)
}
