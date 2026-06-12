import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Pencil, Trash2, Building2, Mail, Hash } from 'lucide-react'
import { toast } from 'sonner'
import type { Cliente } from '@/types'
import { clienteApi } from '@/services/api'
import { formatCNPJ, formatCEP } from '@/lib/formatters'
import { ClientForm } from './ClientForm'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

export function ClientList() {
  const qc = useQueryClient()
  const { data: clientes = [], isLoading } = useQuery({ queryKey: ['clientes'], queryFn: clienteApi.list })
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Cliente | null>(null)
  const [deleting, setDeleting] = useState<Cliente | null>(null)

  const deleteMutation = useMutation({
    mutationFn: (id: string) => clienteApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['clientes'] }); toast.success('Cliente excluído!'); setDeleting(null) },
    onError: (e: Error) => toast.error(e.message),
  })

  if (isLoading) return <div className="flex items-center justify-center h-40 text-muted-foreground">Carregando...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold neon-text-cyan">Clientes</h1>
          <p className="text-sm text-muted-foreground mt-1">{clientes.length} cliente{clientes.length !== 1 ? 's' : ''} cadastrado{clientes.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => { setEditing(null); setFormOpen(true) }} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan text-dark-blue font-semibold text-sm hover:bg-neon-cyan-400 transition-all shadow-neon-cyan">
          <Plus size={16} /> Novo Cliente
        </button>
      </div>

      <div className="space-y-3">
        {clientes.length === 0 && (
          <div className="glass rounded-xl p-10 text-center text-muted-foreground">
            <Building2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhum cliente cadastrado ainda.</p>
          </div>
        )}
        {clientes.map(c => (
          <div key={c.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:neon-border-cyan transition-all">
            <div className="p-2.5 rounded-lg bg-neon-cyan/10">
              <Building2 size={20} className="text-neon-cyan" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{c.nome}</p>
              <p className="text-xs text-muted-foreground truncate">{c.razaoSocial}</p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Hash size={12} />{formatCNPJ(c.cnpj)}</span>
              <span className="flex items-center gap-1"><Mail size={12} />{c.email}</span>
              {c.cidade && <span>{c.cidade}/{c.estado}</span>}
              {c.cep && <span>{formatCEP(c.cep)}</span>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => { setEditing(c); setFormOpen(true) }} className="p-2 rounded-lg text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10 transition-colors"><Pencil size={15} /></button>
              <button onClick={() => setDeleting(c)} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      <ClientForm open={formOpen} cliente={editing} onClose={() => setFormOpen(false)} onSaved={() => qc.invalidateQueries({ queryKey: ['clientes'] })} />

      <ConfirmModal
        open={!!deleting}
        title="Excluir cliente"
        description={`Tem certeza que deseja excluir "${deleting?.nome}"? Todos os projetos e tarefas associados serão removidos.`}
        confirmLabel="Excluir"
        onConfirm={() => deleting && deleteMutation.mutate(deleting.id)}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
