import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import type { Tarefa, TarefaStatus } from '@/types'
import { TaskCard } from '@/components/tasks/TaskCard'
import { cn } from '@/lib/utils'

interface Props {
  status: TarefaStatus
  label: string
  color: string
  tarefas: Tarefa[]
  onTaskClick: (id: string) => void
  onAddTask: () => void
}

export function KanbanColumn({ status, label, color, tarefas, onTaskClick, onAddTask }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col min-w-64 w-64 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-sm font-medium">{label}</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">{tarefas.length}</span>
        </div>
        <button onClick={onAddTask} className="text-muted-foreground hover:text-neon-cyan transition-colors p-1 rounded hover:bg-neon-cyan/10">
          <Plus size={15} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn('flex-1 min-h-32 rounded-xl p-2 space-y-2 transition-colors', isOver ? 'bg-neon-cyan/5 border border-neon-cyan/30' : 'bg-white/[0.02] border border-transparent')}
      >
        <SortableContext items={tarefas.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tarefas.map(t => (
            <TaskCard key={t.id} tarefa={t} onClick={() => onTaskClick(t.id)} />
          ))}
        </SortableContext>
        {tarefas.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-6 opacity-50">Arraste tarefas aqui</p>
        )}
      </div>
    </div>
  )
}
