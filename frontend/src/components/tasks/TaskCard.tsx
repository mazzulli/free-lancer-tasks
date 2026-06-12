import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Clock, Paperclip, GripVertical } from 'lucide-react'
import type { Tarefa } from '@/types'
import { formatHours } from '@/lib/formatters'

interface Props {
  tarefa: Tarefa
  onClick: () => void
}

export function TaskCard({ tarefa, onClick }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tarefa.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const totalHoras = tarefa.apontamentos.reduce((s, a) => s + a.totalHoras, 0)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="glass rounded-lg p-3 cursor-pointer hover:neon-border-cyan transition-all group"
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical size={14} />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-snug line-clamp-2">{tarefa.titulo}</p>
          <p className="text-xs text-muted-foreground mt-1 truncate">{tarefa.projeto.titulo}</p>
        </div>
      </div>

      {(tarefa.apontamentos.length > 0 || tarefa.documentos.length > 0) && (
        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
          {tarefa.apontamentos.length > 0 && (
            <span className="flex items-center gap-1"><Clock size={11} />{formatHours(totalHoras)}</span>
          )}
          {tarefa.documentos.length > 0 && (
            <span className="flex items-center gap-1"><Paperclip size={11} />{tarefa.documentos.length}</span>
          )}
        </div>
      )}
    </div>
  )
}
