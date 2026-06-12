import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
import MDEditor from '@uiw/react-md-editor'
import type { Projeto } from '@/types'
import { projetoApi, clienteApi } from '@/services/api'

interface Props {
  open: boolean
  projeto?: Projeto | null
  defaultClienteId?: string
  onClose: () => void
  onSaved: () => void
}

export function ProjectForm({ open, projeto, defaultClienteId, onClose, onSaved }: Props) {
  const { data: clientes = [] } = useQuery({ queryKey: ['clientes'], queryFn: clienteApi.list })
  const [form, setForm] = useState({ clienteId: '', titulo: '', descricao: '', valorHora: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (projeto) {
      setForm({ clienteId: projeto.clienteId, titulo: projeto.titulo, descricao: projeto.descricao ?? '', valorHora: String(projeto.valorHora) })
    } else {
      setForm({ clienteId: defaultClienteId ?? '', titulo: '', descricao: '', valorHora: '' })
    }
  }, [projeto, open, defaultClienteId])

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, valorHora: parseFloat(form.valorHora) || 0 }
      if (projeto) await projetoApi.update(projeto.id, payload)
      else await projetoApi.create(payload)
      toast.success(projeto ? 'Projeto atualizado!' : 'Projeto criado!')
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
            <Dialog.Title className="font-semibold neon-text-cyan">{projeto ? 'Editar Projeto' : 'Novo Projeto'}</Dialog.Title>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground uppercase tracking-wider">Cliente *</label>
              <select required className={fieldClass} value={form.clienteId} onChange={e => set('clienteId', e.target.value)}>
                <option value="">Selecione um cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Título *</label>
                <input required className={fieldClass} value={form.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Nome do projeto" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Valor/Hora (R$) *</label>
                <input required type="number" min="0" step="0.01" className={fieldClass} value={form.valorHora} onChange={e => set('valorHora', e.target.value)} placeholder="150.00" />
              </div>
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
