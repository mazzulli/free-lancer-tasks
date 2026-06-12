import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, FolderKanban } from 'lucide-react'
import { toast } from 'sonner'
import type { Projeto } from '@/types'
import { projetoApi, clienteApi } from '@/services/api'
import { formatCurrency } from '@/lib/formatters'
import { ProjectForm } from './ProjectForm'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

export function ProjectList() {
  const qc = useQueryClient()
  const { data: clientes = [] } = useQuery({ queryKey: ['clientes'], queryFn: clienteApi.list })
  const [clienteFilter, setClienteFilter] = useState('')
  const { data: projetos = [], isLoading } = useQuery({
    queryKey: ['projetos', clienteFilter],
    queryFn: () => projetoApi.list(clienteFilter || undefined),
  })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Projeto | null>(null)
  const [deleting, setDeleting] = useState<Projeto | null>(null)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projetoApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['projetos'] }); toast.success('Projeto excluído!'); setDeleting(null) },
    onError: (e: Error) => toast.error(e.message),
  })

  const fieldClass = 'px-3 py-2 rounded-lg bg-dark-blue-200 border border-border text-sm text-foreground focus:outline-none focus:border-neon-cyan/50 transition-all'

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Projetos</h1>
          <p className="text-sm text-muted-foreground mt-1">{projetos.length} projeto{projetos.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex items-center gap-3">
          <select className={fieldClass} value={clienteFilter} onChange={e => setClienteFilter(e.target.value)}>
            <option value="">Todos os clientes</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
          <button onClick={() => { setEditing(null); setFormOpen(true) }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan text-dark-blue font-semibold text-sm hover:bg-neon-cyan-400 transition-all shadow-neon-cyan">
            <Plus size={16} /> Novo Projeto
          </button>
        </div>
      </div>

      {isLoading && <div className="text-muted-foreground text-center py-10">Carregando...</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projetos.length === 0 && !isLoading && (
          <div className="col-span-full glass rounded-xl p-10 text-center text-muted-foreground">
            <FolderKanban size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum projeto encontrado.</p>
          </div>
        )}
        {projetos.map(p => (
          <div key={p.id} className="glass rounded-xl p-5 flex flex-col gap-3 hover:neon-border-cyan transition-all">
            <div className="flex items-start justify-between gap-2">
              <div className="p-2 rounded-lg bg-neon-pink/10"><FolderKanban size={18} className="text-neon-pink" /></div>
              <div className="flex gap-1">
                <button onClick={() => { setEditing(p); setFormOpen(true) }} className="p-1.5 rounded text-muted-foreground hover:text-neon-cyan transition-colors"><Pencil size={14} /></button>
                <button onClick={() => setDeleting(p)} className="p-1.5 rounded text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
            <div>
              <p className="font-semibold text-foreground">{p.titulo}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.cliente.nome}</p>
            </div>
            <div className="mt-auto pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Valor/hora</span>
              <span className="text-sm font-semibold neon-text-pink">{formatCurrency(p.valorHora)}</span>
            </div>
          </div>
        ))}
      </div>

      <ProjectForm open={formOpen} projeto={editing} onClose={() => setFormOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ['projetos'] })} />
      <ConfirmModal open={!!deleting} title="Excluir projeto" description={`Deseja excluir "${deleting?.titulo}"? Todas as tarefas serão removidas.`} confirmLabel="Excluir" onConfirm={() => deleting && deleteMutation.mutate(deleting.id)} onCancel={() => setDeleting(null)} />
    </div>
  )
}
