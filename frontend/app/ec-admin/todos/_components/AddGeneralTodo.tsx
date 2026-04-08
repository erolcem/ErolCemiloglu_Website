'use client'

import { useRef, useTransition, useState } from 'react'
import { addTodo } from '@/app/ec-admin/_actions/todos'

export default function AddGeneralTodo() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const title = inputRef.current?.value.trim()
    if (!title) return
    setError(null)
    startTransition(async () => {
      const result = await addTodo('general', null, title)
      if (result && 'error' in result) {
        setError(result.error)
      } else if (inputRef.current) {
        inputRef.current.value = ''
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      {error && <p className="text-red-400 text-xs">{error}</p>}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a general task..."
          disabled={isPending}
          className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-neutral-700 hover:bg-neutral-600 text-neutral-200 text-sm px-4 py-2 rounded transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  )
}
