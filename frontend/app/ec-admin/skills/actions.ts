'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function toggleSkillPublic(id: number, currentValue: boolean) {
  const supabase = createAdminClient()
  await supabase.from('skills').update({ is_public: !currentValue }).eq('id', id)
  revalidatePath('/ec-admin/skills')
}

export async function deleteSkill(id: number) {
  const supabase = createAdminClient()
  await supabase.from('item_todos').delete().eq('entity_type', 'skill').eq('entity_id', id)
  await supabase.from('skills').delete().eq('id', id)
  revalidatePath('/ec-admin/skills')
}

export async function createSkill(formData: FormData) {
  const supabase = createAdminClient()

  const { data, error } = await supabase.from('skills').insert({
    title: formData.get('title') as string,
    category: (formData.get('category') as string) || null,
    image_path: (formData.get('image_path') as string) || null,
    link: (formData.get('link') as string) || null,
    is_wide: formData.get('is_wide') === 'true',
    is_public: false,
  }).select('id').single()

  if (error || !data) {
    console.error('[createSkill]', error?.message)
    return { error: error?.message ?? 'Failed to create skill' }
  }

  revalidatePath('/ec-admin/skills')
  redirect(`/ec-admin/skills/${data.id}`)
}

export async function updateSkill(id: number, formData: FormData) {
  const supabase = createAdminClient()

  const { error } = await supabase.from('skills').update({
    title: formData.get('title') as string,
    category: (formData.get('category') as string) || null,
    image_path: (formData.get('image_path') as string) || null,
    link: (formData.get('link') as string) || null,
    is_wide: formData.get('is_wide') === 'true',
    is_public: formData.get('is_public') === 'true',
  }).eq('id', id)

  if (error) {
    console.error('[updateSkill]', error.message)
    return { error: error.message }
  }

  revalidatePath('/ec-admin/skills')
  revalidatePath(`/ec-admin/skills/${id}`)
}
