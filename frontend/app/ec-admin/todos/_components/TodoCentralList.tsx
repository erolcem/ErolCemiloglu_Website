'use client'

import { useTransition, useState, useEffect } from 'react'
import { toggleTodo, deleteTodo, editTodo, reorderTodos } from '@/app/ec-admin/_actions/todos'
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
  position?: number | null
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
  onDelete,
  onSave
}: { 
  todo: Todo; 
  isLast: boolean; 
  onToggle: (todo: Todo) => void; 
  onDelete: (id: number) => void;
  onSave: (id: number, title: string, dueDate: string | null, description: string | null) => void;
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const [editDate, setEditDate] = useState(todo.due_date ? todo.due_date.substring(0, 10) : '')
  const [editDesc, setEditDesc] = useState(todo.description || '')

  useEffect(() => {
    if (!isEditing) {
      setEditTitle(todo.title)
      setEditDate(todo.due_date ? todo.due_date.substring(0, 10) : '')
      setEditDesc(todo.description || '')
    }
  }, [todo, isEditing])

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: todo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  }

  if (isEditing) {
    return (
      <li
        ref={setNodeRef}
        style={style}
        className={`flex flex-col gap-2 px-4 py-3 bg-neutral-900 ${!isLast ? 'border-b border-neutral-800' : ''}`}
      >
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-neutral-100 focus:outline-none focus:border-blue-500"
          placeholder="Task title"
          autoFocus
        />
        <input
          type="date"
          value={editDate}
          onChange={(e) => setEditDate(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-neutral-400 focus:outline-none focus:border-blue-500"
        />
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-sm text-neutral-300 focus:outline-none focus:border-blue-500 min-h-[60px]"
          placeholder="Description (optional)"
        />
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(todo.id, editTitle, editDate || null, editDesc || null)
              setIsEditing(false)
            }}
            className="px-3 py-1.5 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
          >
            Save
          </button>
        </div>
      </li>
    )
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
        <div className="flex items-start shrink-0">
          <button
            onClick={() => setIsEditing(true)}
            className="text-neutral-700 hover:text-blue-400 transition-colors p-1"
            title="Edit Task"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="text-neutral-700 hover:text-red-400 text-sm font-medium transition-colors p-1 leading-none"
            title="Delete Task"
          >
            ✕
          </button>
        </div>
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

  const handleEdit = (id: number, title: string, dueDate: string | null, description: string | null) => {
    setOptimisticTodos(prev => prev.map(t => t.id === id ? { ...t, title, due_date: dueDate, description } : t))
    startTransition(() => {
      editTodo(id, title, dueDate, description, entityType, entityId)
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      let newOrderUpdates: { id: number; position: number }[] = []

      setOptimisticTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const reordered = arrayMove(items, oldIndex, newIndex)

        // Extract all current positions and sort them descending (highest position = top of list)
        const positions = items.map(t => t.position ?? t.id).sort((a, b) => b - a)

        // Reassign the highest positions to the items in their new order
        const finalItems = reordered.map((item, i) => ({ ...item, position: positions[i] }))
        
        newOrderUpdates = finalItems.map(item => ({ id: item.id, position: item.position! }))
        
        return finalItems
      })
      
      if (newOrderUpdates.length > 0) {
        startTransition(() => {
          reorderTodos(newOrderUpdates, entityType, entityId)
        })
      }
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
              onSave={handleEdit}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
