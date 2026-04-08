'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { toggleSkillPublic, deleteSkill } from '../actions'

interface Skill {
  id: number
  title: string
  category: string | null
  is_wide: boolean | null
  is_public: boolean
}

export default function SkillRow({ skill }: { skill: Skill }) {
  const [isPending, startTransition] = useTransition()

  return (
    <tr className={`border-b border-neutral-800 ${isPending ? 'opacity-50' : ''}`}>
      <td className="py-3 px-4 text-neutral-100 text-sm">{skill.title}</td>
      <td className="py-3 px-4 text-neutral-500 text-sm">{skill.category ?? '—'}</td>
      <td className="py-3 px-4">
        {skill.is_wide && (
          <span className="text-xs px-2 py-0.5 rounded bg-purple-900/40 text-purple-400 border border-purple-800/40">Wide</span>
        )}
      </td>
      <td className="py-3 px-4">
        <button
          onClick={() => startTransition(() => toggleSkillPublic(skill.id, skill.is_public))}
          disabled={isPending}
          className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
            skill.is_public
              ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-700/50 hover:bg-emerald-900/70'
              : 'bg-neutral-800 text-neutral-500 border border-neutral-700 hover:text-neutral-300'
          }`}
        >
          {skill.is_public ? 'Live' : 'Draft'}
        </button>
      </td>
      <td className="py-3 px-4 flex gap-3">
        <Link href={`/ec-admin/skills/${skill.id}`} className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          Edit
        </Link>
        <button
          onClick={() => {
            if (!confirm(`Delete "${skill.title}"?`)) return
            startTransition(() => deleteSkill(skill.id))
          }}
          disabled={isPending}
          className="text-xs text-neutral-600 hover:text-red-400 transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  )
}
