'use client'

import { useTransition, useState, useEffect } from 'react'
import { toggleTodo, deleteTodo } from '@/app/ec-admin/_actions/todos'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

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

function SortableTodoItem({ 
  todo, 
  isLast, 
  onToggle, 
  onDelete 
}: { 
  todo: Todo; 
  isLast: boolean; 
  onToggle: (todo: Todo) => void; 
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  let dateLabel = ''
  let dateColor = 'text-blue-400'
  
  if (todo.due_date) {
    const due = new Date(todo.due_date)
    const now = new Date()
    const dueMidnight = new Date(due.getFullYear(), due.getMonth(), due.getDate())
    const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const diffDays = Math.round((dueMidnight.getTime() - nowMidnight.getTime()) / (1000 * 60 * 60 * 24))
    
    const formatted = due.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    if (diffDays === 0) {
      dateLabel = `${formatted} (Today)`
      dateColor = 'text-amber-400'
    } else if (diffDays === 1) {
      dateLabel = `${formatted} (Tomorrow)`
    } else if (diffDays === -1) {
      dateLabel = `${formatted} (Yesterday)`
      dateColor = 'text-red-400'
    } else if (diffDays < -1) {
      dateLabel = `${formatted} (${Math.abs(diffDays)} days overdue)`
      dateColor = 'text-red-500 font-medium'
    } else {
      dateLabel = `${formatted} (${diffDays} days left)`
    }
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex flex-col gap-1 px-4 py-3 bg-neutral-900 ${!isLast ? 'border-b border-neutral-800' : ''}`}
    >
      <div className="flex items-start gap-3 group">
        <div 
          {...attributes} 
          {...listeners} 
          className="mt-0.5 cursor-grab active:cursor-grabbing text-neutral-600 hover:text-neutral-400 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm8-12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm0 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>
        </div>
        <button
          onClick={() => onToggle(todo)}
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
        <div className="flex-1 flex flex-col pt-0.5 min-w-0">
          <span className={`text-sm truncate ${todo.is_done ? 'line-through text-neutral-600' : 'text-neutral-200'}`}>
            {todo.title}
          </span>
          {todo.due_date && (
            <span className={`text-xs mt-1 inline-flex items-center gap-1 ${todo.is_done ? 'text-neutral-500' : dateColor}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {dateLabel}
            </span>
          )}
          {todo.description && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
              {todo.description}
            </p>
          )}
        </div>
        <button
          onClick={() => onDelete(todo.id)}
          className="text-neutral-700 hover:text-red-400 text-xs transition-colors p-1"
        >
          ✕
        </button>
      </div>
    </li>
  )
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

  const handleDelete = (id: number) => {
    setOptimisticTodos(prev => prev.filter(t => t.id !== id))
    startTransition(() => {
      deleteTodo(id, entityType, entityId)
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setOptimisticTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
      
      // TODO: Add a server action call here to persist the order!
      // e.g., reorderTodos(active.id, over.id)
    }
  }

  const visibleTodos = hideCompleted
    ? optimisticTodos.filter(t => !t.is_done)
    : optimisticTodos

  if (visibleTodos.length === 0) {
    return <p className="text-neutral-600 text-sm px-4 py-4 text-center">No tasks to show.</p>
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={visibleTodos.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <ul className={isPending ? 'opacity-80' : ''}>
          {visibleTodos.map((todo, i) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              isLast={i === visibleTodos.length - 1}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
