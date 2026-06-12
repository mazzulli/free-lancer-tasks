import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import MDEditor from '@uiw/react-md-editor'
import type { Tarefa, TarefaStatus } from '@/types'
import { tarefaApi, projetoApi } from '@/services/api'

interface Props {
  open: boolean
  tarefa?: Tarefa | null
  defaultProjetoId?: string
  onClose: () => void
  onSaved: () => void
}

const STATUSES: { value: TarefaStatus; label: string }[] = [
  { value: 'NOVA', label: 'Nova' },
  { value: 'EM_ANDAMENTO', label: 'Em Andamento' },
  { value: 'PRONTA', label: 'Pronta' },
  { value: 'FECHADA', label: 'Fechada' },
]

export function TaskForm({ open, tarefa, defaultProjetoId, onClose, onSaved }: Props) {
  const { data: projetos = [] } = useQuery({ queryKey: ['projetos'], queryFn: () => projetoApi.list() })
  const [form, setForm] = useState({ projetoId: '', titulo: '', descricao: '', status: 'NOVA' as TarefaStatus })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (tarefa) setForm({ projetoId: tarefa.projetoId, titulo: tarefa.titulo, descricao: tarefa.descricao ?? '', status: tarefa.status })
    else setForm({ projetoId: defaultProjetoId ?? '', titulo: '', descricao: '', status: 'NOVA' })
  }, [tarefa, open, defaultProjetoId])

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      if (tarefa) await tarefaApi.update(tarefa.id, form)
      else await tarefaApi.create(form)
      toast.success(tarefa ? 'Tarefa atualizada!' : 'Tarefa criada!')
      onSaved(); onClose()
    } catch (err: unknown) { toast.error((err as Error).message) }
    finally { setSaving(false) }
  }

  const fieldClass = 'w-full px-3 py-2 rounded-lg bg-dark-blue-200 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 transition-all'

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-xl shadow-glass animate-in fade-in zoom-in-95 scrollbar-thin">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-dark-blue-100/80 backdrop-blur-md rounded-t-xl z-10">
            <Dialog.Title className="font-semibold neon-text-cyan">{tarefa ? 'Editar Tarefa' : 'Nova Tarefa'}</Dialog.Title>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Projeto *</label>
                <select required className={fieldClass} value={form.projetoId} onChange={e => set('projetoId', e.target.value)}>
                  <option value="">Selecione um projeto</option>
                  {projetos.map(p => <option key={p.id} value={p.id}>{p.cliente.nome} — {p.titulo}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Status</label>
                <select className={fieldClass} value={form.status} onChange={e => set('status', e.target.value as TarefaStatus)}>
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Título *</label>
              <input required className={fieldClass} value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Descrição breve da tarefa" />
            </div>

            <div className="space-y-1" data-color-mode="dark">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Descrição</label>
              <MDEditor value={form.descricao} onChange={v => set('descricao', v ?? '')} height={200} preview="edit" />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button type="submit" disabled={saving} className="px-6 py-2 text-sm rounded-lg bg-neon-cyan text-dark-blue font-semibold hover:bg-neon-cyan-400 disabled:opacity-50 transition-all shadow-neon-cyan">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
