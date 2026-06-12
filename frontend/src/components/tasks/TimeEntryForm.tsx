import { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Apontamento } from '@/types'
import { apontamentoApi } from '@/services/api'
import { formatDate } from '@/lib/formatters'

interface Props {
  tarefaId: string
  apontamento?: Apontamento | null
  onDone: () => void
  onCancel: () => void
}

export function TimeEntryForm({ tarefaId, apontamento, onDone, onCancel }: Props) {
  const qc = useQueryClient()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ data: today, horaIni: '', horaFim: '' })
  const [preview, setPreview] = useState<number | null>(null)

  useEffect(() => {
    if (apontamento) {
      setForm({ data: apontamento.data.split('T')[0], horaIni: apontamento.horaIni, horaFim: apontamento.horaFim })
    } else {
      setForm({ data: today, horaIni: '', horaFim: '' })
    }
  }, [apontamento])

  useEffect(() => {
    if (form.horaIni && form.horaFim) {
      const [hi, mi] = form.horaIni.split(':').map(Number)
      const [hf, mf] = form.horaFim.split(':').map(Number)
      const total = ((hf * 60 + mf) - (hi * 60 + mi)) / 60
      setPreview(total > 0 ? Math.round(total * 100) / 100 : null)
    } else setPreview(null)
  }, [form.horaIni, form.horaFim])

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const mutation = useMutation({
    mutationFn: () => apontamento
      ? apontamentoApi.update(apontamento.id, form)
      : apontamentoApi.create({ ...form, tarefaId }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tarefa', tarefaId] }); toast.success(apontamento ? 'Apontamento atualizado!' : 'Horas registradas!'); onDone() },
    onError: (e: Error) => toast.error(e.message),
  })

  const fieldClass = 'w-full px-3 py-2 rounded-lg bg-dark-blue-300 border border-border text-sm text-foreground focus:outline-none focus:border-neon-cyan/50 transition-all'

  return (
    <div className="glass rounded-lg p-4 space-y-3 border border-neon-cyan/20">
      <div className="grid grid-cols-3 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Data</label>
          <input type="date" className={fieldClass} value={form.data} onChange={e => set('data', e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Início</label>
          <input type="time" className={fieldClass} value={form.horaIni} onChange={e => set('horaIni', e.target.value)} />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Fim</label>
          <input type="time" className={fieldClass} value={form.horaFim} onChange={e => set('horaFim', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        {preview !== null && (
          <span className="text-xs neon-text-cyan">{preview}h calculadas</span>
        )}
        <div className="flex items-center gap-2 ml-auto">
          <button onClick={onCancel} className="p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors"><X size={16} /></button>
          <button onClick={() => mutation.mutate()} disabled={!form.horaIni || !form.horaFim || mutation.isPending}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neon-cyan text-dark-blue text-xs font-semibold disabled:opacity-50 hover:bg-neon-cyan-400 transition-all">
            <Check size={14} /> Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
