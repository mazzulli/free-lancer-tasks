import { useState } from 'react'
import { DndContext, DragEndEvent, DragOverEvent, PointerSensor, useSensor, useSensors, closestCorners } from '@dnd-kit/core'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Tarefa, TarefaStatus } from '@/types'
import { tarefaApi, clienteApi, projetoApi } from '@/services/api'
import { KanbanColumn } from './KanbanColumn'
import { TaskDetailModal } from '@/components/tasks/TaskDetailModal'
import { TaskForm } from '@/components/tasks/TaskForm'

const COLUMNS: { status: TarefaStatus; label: string; color: string }[] = [
  { status: 'NOVA', label: 'Nova', color: 'bg-blue-400' },
  { status: 'EM_ANDAMENTO', label: 'Em Andamento', color: 'bg-yellow-400' },
  { status: 'PRONTA', label: 'Pronta', color: 'bg-neon-cyan' },
  { status: 'FECHADA', label: 'Fechada', color: 'bg-neon-pink' },
]

export function KanbanBoard() {
  const qc = useQueryClient()
  const [clienteFilter, setClienteFilter] = useState('')
  const [projetoFilter, setProjetoFilter] = useState('')
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [taskFormOpen, setTaskFormOpen] = useState(false)

  const { data: clientes = [] } = useQuery({ queryKey: ['clientes'], queryFn: clienteApi.list })
  const { data: projetos = [] } = useQuery({ queryKey: ['projetos', clienteFilter], queryFn: () => projetoApi.list(clienteFilter || undefined) })
  const { data: tarefas = [] } = useQuery({
    queryKey: ['tarefas-kanban', clienteFilter, projetoFilter],
    queryFn: () => tarefaApi.list({ clienteId: clienteFilter || undefined, projetoId: projetoFilter || undefined }),
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TarefaStatus }) => tarefaApi.update(id, { status }),
    onError: (e: Error) => toast.error(e.message),
    onSettled: () => qc.invalidateQueries({ queryKey: ['tarefas-kanban'] }),
  })

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const tarefa = tarefas.find(t => t.id === active.id)
    if (!tarefa) return

    const newStatus = COLUMNS.find(c => c.status === over.id)?.status
      ?? tarefas.find(t => t.id === over.id)?.status

    if (newStatus && newStatus !== tarefa.status) {
      updateMutation.mutate({ id: tarefa.id as string, status: newStatus })
    }
  }

  const selectClass = 'w-full sm:w-auto px-3 py-2 rounded-lg bg-dark-blue-200 border border-border text-sm text-foreground focus:outline-none focus:border-neon-cyan/50 transition-all'

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <h1 className="text-2xl font-bold neon-text-cyan">Kanban</h1>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <select className={selectClass} value={clienteFilter} onChange={e => { setClienteFilter(e.target.value); setProjetoFilter('') }}>
            <option value="">Todos os clientes</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <select className={selectClass} value={projetoFilter} onChange={e => setProjetoFilter(e.target.value)}>
            <option value="">Todos os projetos</option>
            {projetos.map(p => <option key={p.id} value={p.id}>{p.titulo}</option>)}
          </select>
          <button onClick={() => setTaskFormOpen(true)} className="w-full sm:w-auto px-4 py-2 text-sm rounded-lg bg-neon-cyan text-dark-blue font-semibold hover:bg-neon-cyan-400 transition-all shadow-neon-cyan">
            + Nova Tarefa
          </button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {COLUMNS.map(col => (
            <KanbanColumn
              key={col.status}
              status={col.status}
              label={col.label}
              color={col.color}
              tarefas={tarefas.filter((t): t is Tarefa => t.status === col.status)}
              onTaskClick={setSelectedTask}
              onAddTask={() => setTaskFormOpen(true)}
            />
          ))}
        </div>
      </DndContext>

      <TaskDetailModal tarefaId={selectedTask} onClose={() => setSelectedTask(null)} />
      <TaskForm open={taskFormOpen} onClose={() => setTaskFormOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ['tarefas-kanban'] })} />
    </div>
  )
}
