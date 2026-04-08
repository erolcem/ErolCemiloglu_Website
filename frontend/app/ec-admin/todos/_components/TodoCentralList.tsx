'use client'

import { useTransition } from 'react'
import { toggleTodo, deleteTodo } from '@/app/ec-admin/_actions/todos'

interface Todo {
  id: number
  title: string
  is_done: boolean
}

interface Props {
  todos: Todo[]
  entityType: 'project' | 'skill'
  entityId: number
}

export default function TodoCentralList({ todos, entityType, entityId }: Props) {
  const [isPending, startTransition] = useTransition()

  return (
    <ul className={isPending ? 'opacity-60' : ''}>
      {todos.map((todo, i) => (
        <li
          key={todo.id}
          className={`flex items-center gap-3 px-4 py-3 ${i < todos.length - 1 ? 'border-b border-neutral-800' : ''}`}
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
  )
}
