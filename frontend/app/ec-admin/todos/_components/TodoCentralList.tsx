'use client'

import { useTransition, useState, useEffect } from 'react'
import { toggleTodo, deleteTodo } from '@/app/ec-admin/_actions/todos'

interface Todo {
  id: number
  title: string
  is_done: boolean
  due_date?: string | null
  description?: string | null
}

interface Props {
  todos: Todo[]
  entityType: 'project' | 'skill' | 'general'
  entityId: number | null
  hideCompleted?: boolean
}

export default function TodoCentralList({ todos, entityType, entityId, hideCompleted }: Props) {
  const [isPending, startTransition] = useTransition()
  const [optimisticTodos, setOptimisticTodos] = useState(todos)

  useEffect(() => {
    setOptimisticTodos(todos)
  }, [todos])

  const handleToggle = (todo: Todo) => {
    // Instantly check off the box visually before the server finishes
    setOptimisticTodos(prev => prev.map(t => t.id === todo.id ? { ...t, is_done: !t.is_done } : t))
    startTransition(() => {
      toggleTodo(todo.id, todo.is_done, entityType, entityId)
    })
  }

  const visibleTodos = hideCompleted
    ? optimisticTodos.filter(t => !t.is_done)
    : optimisticTodos

  if (visibleTodos.length === 0) {
    return <p className="text-neutral-600 text-sm px-4 py-4 text-center">No tasks to show.</p>
  }

  return (
    <ul className={isPending ? 'opacity-80' : ''}>
      {visibleTodos.map((todo, i) => (
        <li
          key={todo.id}
          className={`flex flex-col gap-1 px-4 py-3 ${i < visibleTodos.length - 1 ? 'border-b border-neutral-800' : ''}`}
        >
          <div className="flex items-start gap-3">
            <button
              onClick={() => handleToggle(todo)}
              className={`mt-0.5 w-4 h-4 rounded border shrink-0 flex items-center justify-center transition-colors ${
                todo.is_done ? 'bg-emerald-600 border-emerald-600' : 'border-neutral-600 hover:border-neutral-400'
              }`}
            >
              {todo.is_done && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <div className="flex-1 flex flex-col pt-0.5">
              <span className={`text-sm ${todo.is_done ? 'line-through text-neutral-600' : 'text-neutral-200'}`}>
                {todo.title}
              </span>
              {todo.due_date && (
                <span className="text-xs text-blue-400 mt-1 inline-flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(todo.due_date).toLocaleDateString()}
                </span>
              )}
              {todo.description && (
                <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                  {todo.description}
                </p>
              )}
            </div>
            <button
              onClick={() => startTransition(() => deleteTodo(todo.id, entityType, entityId))}
              className="text-neutral-700 hover:text-red-400 text-xs transition-colors p-1"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
