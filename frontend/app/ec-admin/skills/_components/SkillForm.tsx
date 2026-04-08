'use client'

import { useTransition, useState } from 'react'

interface SkillData {
  title?: string
  category?: string | null
  image_path?: string | null
  link?: string | null
  is_wide?: boolean | null
  is_public?: boolean
}

interface Props {
  action: (formData: FormData) => Promise<void | { error: string }>
  defaultValues?: SkillData
  submitLabel?: string
}

export default function SkillForm({ action, defaultValues, submitLabel = 'Save Skill' }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await action(formData)
      if (result && 'error' in result) setError(result.error)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-950/40 border border-red-800/60 text-red-400 text-sm rounded px-3 py-2">
          {error}
        </div>
      )}

      <Field label="Title" name="title" defaultValue={defaultValues?.title} required />

      <Field label="Category" name="category" defaultValue={defaultValues?.category ?? ''} placeholder="e.g. Languages, Frameworks, Tools" />

      <Field label="Image Path" name="image_path" defaultValue={defaultValues?.image_path ?? ''} placeholder="/images/skill.jpg" />

      <Field label="Evidence Link" name="link" defaultValue={defaultValues?.link ?? ''} placeholder="https://github.com/..." />

      {/* is_wide toggle */}
      <div className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded px-4 py-3">
        <div>
          <p className="text-sm text-neutral-200 font-medium">Wide tile</p>
          <p className="text-xs text-neutral-500 mt-0.5">Spans two columns in the Bento grid.</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" name="is_wide" value="true" defaultChecked={defaultValues?.is_wide ?? false} className="sr-only peer" />
          <div className="w-11 h-6 bg-neutral-700 rounded-full peer peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
        </label>
      </div>

      {/* is_public toggle — only on edit */}
      {defaultValues !== undefined && (
        <div className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded px-4 py-3">
          <div>
            <p className="text-sm text-neutral-200 font-medium">Live on public site</p>
            <p className="text-xs text-neutral-500 mt-0.5">Toggle to push this skill to the portfolio.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" name="is_public" value="true" defaultChecked={defaultValues?.is_public} className="sr-only peer" />
            <div className="w-11 h-6 bg-neutral-700 rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
          </label>
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-700 disabled:text-neutral-500 text-white text-sm font-medium rounded px-4 py-2.5 transition-colors"
      >
        {isPending ? 'Saving...' : submitLabel}
      </button>
    </form>
  )
}

function Field({ label, name, defaultValue, placeholder, required }: {
  label: string; name: string; defaultValue?: string; placeholder?: string; required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-neutral-400 text-xs tracking-wide">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        required={required}
        className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  )
}
