'use client'

import { useTransition, useRef, useState } from 'react'
import { addTodo, toggleTodo, deleteTodo } from '@/app/ec-admin/_actions/todos'

interface Todo {
  id: number
  title: string
  is_done: boolean
}

interface Props {
  entityType: 'project' | 'skill'
  entityId: number
  todos: Todo[]
}

export default function TodoList({ entityType, entityId, todos }: Props) {
  const [isPending, startTransition] = useTransition()
  const [addError, setAddError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const title = inputRef.current?.value.trim()
    if (!title) return
    setAddError(null)
    startTransition(async () => {
      const result = await addTodo(entityType, entityId, title)
      if (result && 'error' in result) {
        setAddError(result.error)
      } else if (inputRef.current) {
        inputRef.current.value = ''
      }
    })
  }

  const done = todos.filter(t => t.is_done).length

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">Checklist</h2>
        {todos.length > 0 && (
          <span className="text-xs text-neutral-500">{done}/{todos.length} done</span>
        )}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden mb-3">
        {todos.length === 0 ? (
          <p className="text-neutral-600 text-sm px-4 py-6 text-center">No tasks yet — add one below.</p>
        ) : (
          <ul>
            {todos.map((todo, i) => (
              <li
                key={todo.id}
                className={`flex items-center gap-3 px-4 py-3 ${i < todos.length - 1 ? 'border-b border-neutral-800' : ''} ${isPending ? 'opacity-60' : ''}`}
              >
                <button
                  onClick={() => startTransition(() => toggleTodo(todo.id, todo.is_done, entityType, entityId))}
                  className={`w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                    todo.is_done ? 'bg-emerald-600 border-emerald-600' : 'border-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  {todo.is_done && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <span className={`flex-1 text-sm ${todo.is_done ? 'line-through text-neutral-600' : 'text-neutral-200'}`}>
                  {todo.title}
                </span>
                <button
                  onClick={() => startTransition(() => deleteTodo(todo.id, entityType, entityId))}
                  className="text-neutral-700 hover:text-red-400 text-xs transition-colors"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {addError && <p className="text-red-400 text-xs mb-2">{addError}</p>}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Add a task..."
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
      </form>
    </div>
  )
}
