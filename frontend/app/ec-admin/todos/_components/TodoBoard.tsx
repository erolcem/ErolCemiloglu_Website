'use client'

import { useState, useEffect } from 'react'
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

import TodoCentralList from './TodoCentralList'
import AddInlineTodo from './AddGeneralTodo'

export type TodoItem = {
  id: number
  entity_type: string
  entity_id: number | null
  title: string
  is_done: boolean
  description?: string | null
  due_date?: string | null
  position?: number | null
}

export type Group = {
  id: string
  entity: {
    type: 'project' | 'skill' | 'general'
    id: number | null
    title: string
    is_public: boolean | null
  }
  todos: TodoItem[]
}

// --- Individual Draggable Group Component ---
function SortableGroupCard({ group, hideCompleted }: { group: Group, hideCompleted: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.7 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden flex flex-col">
      {/* Group header - Act as Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 cursor-grab active:cursor-grabbing hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 pointer-events-none">
          {group.entity.type !== 'general' && (
            <span
              className={`text-xs px-2 py-0.5 rounded border ${
                group.entity.type === 'project'
                  ? 'text-blue-400 border-blue-800/40 bg-blue-900/20'
                  : 'text-purple-400 border-purple-800/40 bg-purple-900/20'
              }`}
            >
              {group.entity.type}
            </span>
          )}
          <span className="text-sm font-medium text-neutral-200">{group.entity.title}</span>
        </div>
        <div className="flex items-center gap-3">
          {group.entity.is_public !== null && (
            <span className={`text-xs ${group.entity.is_public ? 'text-emerald-500' : 'text-neutral-600'}`}>
              {group.entity.is_public ? 'Live' : 'Draft'}
            </span>
          )}
          {group.entity.type !== 'general' && group.entity.id && (
            <a
              href={`/ec-admin/${group.entity.type === 'project' ? 'projects' : 'skills'}/${group.entity.id}`}
              className="text-xs text-neutral-600 hover:text-blue-400 transition-colors z-10 relative"
              onPointerDown={(e) => e.stopPropagation()} // Prevents dragging when clicking edit
            >
              Edit →
            </a>
          )}
        </div>
      </div>

      {/* Todos list */}
        <div className="flex-1 overflow-y-auto max-h-[400px]">
        <TodoCentralList todos={group.todos as any} entityType={group.entity.type} entityId={group.entity.id} hideCompleted={hideCompleted} />
        </div>

      {/* Universal Inline add form */}
        <div className="px-4 py-3 border-t border-neutral-800 mt-auto">
        <AddInlineTodo entityType={group.entity.type} entityId={group.entity.id} />
        </div>
    </div>
  )
}

// --- Main Board Component ---
export default function TodoBoard({ initialGroups, totalPending }: { initialGroups: Group[]; totalPending: number }) {
  const [groups, setGroups] = useState<Group[]>(initialGroups)
  const [hideCompleted, setHideCompleted] = useState(false)
  
  // Setup DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Requires 5px movement to start drag (allows clicking)
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  // Load saved layout from localStorage on mount
  useEffect(() => {
    const savedOrder = localStorage.getItem('ec-todo-layout')
    if (savedOrder) {
      const orderMap = JSON.parse(savedOrder) as string[]
      setGroups((currentGroups) => {
        return [...currentGroups].sort((a, b) => {
          const indexA = orderMap.indexOf(a.id)
          const indexB = orderMap.indexOf(b.id)
          return (indexA > -1 ? indexA : Infinity) - (indexB > -1 ? indexB : Infinity)
        })
      })
    }
  }, [])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setGroups((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const reordered = arrayMove(items, oldIndex, newIndex)
        
        // Save layout preference to localStorage
        localStorage.setItem('ec-todo-layout', JSON.stringify(reordered.map((g) => g.id)))
        return reordered
      })
    }
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-100">Command Center Tasks</h1>
          <p className="text-neutral-500 text-sm mt-0.5">{totalPending} pending action items</p>
        </div>
        <button
          onClick={() => setHideCompleted(!hideCompleted)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
            hideCompleted ? 'bg-blue-600/20 text-blue-400 border-blue-500/30' : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'
          }`}
        >
          {hideCompleted ? 'Showing Active Only' : 'Hide Completed'}
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={groups.map((g) => g.id)} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {groups.map((group) => (
              <SortableGroupCard key={group.id} group={group} hideCompleted={hideCompleted} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}