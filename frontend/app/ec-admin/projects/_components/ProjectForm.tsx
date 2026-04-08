'use client'

import { useTransition, useState } from 'react'

interface ProjectData {
  title?: string
  category?: string
  description?: string
  tech_stack?: string[]
  image_path?: string | null
  link?: string | null
  year?: string | null
  custom_order?: string | null
  is_public?: boolean
}

interface Props {
  action: (formData: FormData) => Promise<void | { error: string }>
  defaultValues?: ProjectData
  submitLabel?: string
}

export default function ProjectForm({ action, defaultValues, submitLabel = 'Save Project' }: Props) {
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

  const techString = defaultValues?.tech_stack?.join(', ') ?? ''

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-950/40 border border-red-800/60 text-red-400 text-sm rounded px-3 py-2">
          {error}
        </div>
      )}
      <Field label="Title" name="title" defaultValue={defaultValues?.title} required />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Category" name="category" defaultValue={defaultValues?.category ?? ''} placeholder="e.g. Robotics, Software" />
        <Field label="Year" name="year" defaultValue={defaultValues?.year ?? ''} placeholder="e.g. 2025" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-neutral-400 text-xs tracking-wide">Description</label>
        <textarea
          name="description"
          defaultValue={defaultValues?.description ?? ''}
          rows={4}
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
      </div>

      <Field
        label="Tech Stack (comma-separated)"
        name="tech_stack"
        defaultValue={techString}
        placeholder="Python, ROS, Next.js"
      />

      <Field
        label="Image / Video Path"
        name="image_path"
        defaultValue={defaultValues?.image_path ?? ''}
        placeholder="/images/project.mp4 or /images/pic.jpg"
      />

      <Field
        label="External Link"
        name="link"
        defaultValue={defaultValues?.link ?? ''}
        placeholder="https://github.com/..."
      />

      <Field
        label="Custom Order (higher = first)"
        name="custom_order"
        defaultValue={defaultValues?.custom_order ?? ''}
        placeholder="0"
      />

      {/* is_public toggle — only shown on edit (new projects always start as draft) */}
      {defaultValues !== undefined && (
        <div className="flex items-center justify-between bg-neutral-800 border border-neutral-700 rounded px-4 py-3">
          <div>
            <p className="text-sm text-neutral-200 font-medium">Live on public site</p>
            <p className="text-xs text-neutral-500 mt-0.5">Toggle to push this project to the portfolio.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="is_public"
              value="true"
              defaultChecked={defaultValues?.is_public}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
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

function Field({
  label,
  name,
  defaultValue,
  placeholder,
  required,
}: {
  label: string
  name: string
  defaultValue?: string
  placeholder?: string
  required?: boolean
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