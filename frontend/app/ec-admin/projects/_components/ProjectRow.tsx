'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { toggleProjectPublic, deleteProject } from '../actions'

interface Project {
  id: number
  title: string
  category: string | null
  year: string | null
  is_public: boolean
}

export default function ProjectRow({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(() => toggleProjectPublic(project.id, project.is_public))
  }

  function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This also deletes its todos.`)) return
    startTransition(() => deleteProject(project.id))
  }

  return (
    <tr className={`border-b border-neutral-800 ${isPending ? 'opacity-50' : ''}`}>
      <td className="py-3 px-4 text-neutral-100 text-sm">{project.title}</td>
      <td className="py-3 px-4 text-neutral-500 text-sm">{project.category ?? '—'}</td>
      <td className="py-3 px-4 text-neutral-500 text-sm">{project.year ?? '—'}</td>
      <td className="py-3 px-4">
        <button
          onClick={handleToggle}
          disabled={isPending}
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
            project.is_public
              ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-900/70'
              : 'bg-neutral-800 text-neutral-500 border border-neutral-700 hover:text-neutral-300'
          }`}
        >
          {project.is_public ? 'Live' : 'Draft'}
        </button>
      </td>
      <td className="py-3 px-4 flex gap-3">
        <Link
          href={`/ec-admin/projects/${project.id}`}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          Edit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-xs text-neutral-600 hover:text-red-400 transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}