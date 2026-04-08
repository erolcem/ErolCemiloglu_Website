'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function toggleProjectPublic(id: number, currentValue: boolean) {
  const supabase = await createClient()
  await supabase.from('projects').update({ is_public: !currentValue }).eq('id', id)
  revalidatePath('/ec-admin/projects')
}

export async function deleteProject(id: number) {
  const supabase = await createClient()
  await supabase.from('item_todos').delete().eq('entity_type', 'project').eq('entity_id', id)
  await supabase.from('projects').delete().eq('id', id)
  revalidatePath('/ec-admin/projects')
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()

  const techRaw = (formData.get('tech_stack') as string) ?? ''
  const techArray = techRaw.split(',').map(t => t.trim()).filter(Boolean)

  const { data, error } = await supabase.from('projects').insert({
    title: formData.get('title') as string,
    category: formData.get('category') as string,
    description: formData.get('description') as string,
    tech_stack: techArray,
    image_path: (formData.get('image_path') as string) || null,
    link: (formData.get('link') as string) || null,
    year: (formData.get('year') as string) || null,
    custom_order: (formData.get('custom_order') as string) || null,
    is_public: false,
  }).select('id').single()

  if (error || !data) {
    throw new Error(error?.message ?? 'Failed to create project')
  }

  revalidatePath('/ec-admin/projects')
  redirect(`/ec-admin/projects/${data.id}`)
}

export async function updateProject(id: number, formData: FormData) {
  const supabase = await createClient()

  const techRaw = (formData.get('tech_stack') as string) ?? ''
  const techArray = techRaw.split(',').map(t => t.trim()).filter(Boolean)

  await supabase.from('projects').update({
    title: formData.get('title') as string,
    category: formData.get('category') as string,
    description: formData.get('description') as string,
    tech_stack: techArray,
    image_path: (formData.get('image_path') as string) || null,
    link: (formData.get('link') as string) || null,
    year: (formData.get('year') as string) || null,
    custom_order: (formData.get('custom_order') as string) || null,
    is_public: formData.get('is_public') === 'true',
  }).eq('id', id)

  revalidatePath('/ec-admin/projects')
  revalidatePath(`/ec-admin/projects/${id}`)
}

export async function addTodo(entityType: 'project' | 'skill', entityId: number, title: string) {
  const supabase = await createClient()
  await supabase.from('item_todos').insert({ entity_type: entityType, entity_id: entityId, title })
  revalidatePath(`/ec-admin/projects/${entityId}`)
}

export async function toggleTodo(todoId: number, currentDone: boolean, projectId: number) {
  const supabase = await createClient()
  await supabase.from('item_todos').update({ is_done: !currentDone }).eq('id', todoId)
  revalidatePath(`/ec-admin/projects/${projectId}`)
}

export async function deleteTodo(todoId: number, projectId: number) {
  const supabase = await createClient()
  await supabase.from('item_todos').delete().eq('id', todoId)
  revalidatePath(`/ec-admin/projects/${projectId}`)
}