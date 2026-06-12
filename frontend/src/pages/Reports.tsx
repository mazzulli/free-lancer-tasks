import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { FileText, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'
import { relatorioApi, clienteApi } from '@/services/api'
import { formatMonth, formatCurrency, formatHours } from '@/lib/formatters'
import { ReportView } from '@/components/reports/ReportView'
import type { Relatorio } from '@/types'

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

const currentYear = new Date().getFullYear()
const ANOS = Array.from({ length: 5 }, (_, i) => currentYear - i)

export function Reports() {
  const qc = useQueryClient()
  const { data: clientes = [] } = useQuery({ queryKey: ['clientes'], queryFn: clienteApi.list })
  const { data: relatorios = [] } = useQuery({ queryKey: ['relatorios'], queryFn: () => relatorioApi.list() })

  const [selectedClienteId, setSelectedClienteId] = useState('')
  const [mes, setMes] = useState(new Date().getMonth() + 1)
  const [ano, setAno] = useState(currentYear)
  const [viewing, setViewing] = useState<Relatorio | null>(null)

  const generateMutation = useMutation({
    mutationFn: () => relatorioApi.generate({ clienteId: selectedClienteId, mes, ano }),
    onSuccess: (r) => { qc.invalidateQueries({ queryKey: ['relatorios'] }); toast.success('Relatório gerado!'); setViewing(r) },
    onError: (e: Error) => toast.error(e.message),
  })

  const viewMutation = useMutation({
    mutationFn: (id: string) => relatorioApi.get(id),
    onSuccess: setViewing,
    onError: (e: Error) => toast.error(e.message),
  })

  const fieldClass = 'px-3 py-2 rounded-lg bg-dark-blue-200 border border-border text-sm text-foreground focus:outline-none focus:border-neon-cyan/50 transition-all'

  if (viewing) {
    return (
      <div>
        <button onClick={() => setViewing(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
          ← Voltar
        </button>
        <ReportView relatorio={viewing} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold neon-text-cyan">Relatórios</h1>
        <p className="text-sm text-muted-foreground mt-1">Gere o fechamento mensal por cliente</p>
      </div>

      {/* Gerador */}
      <div className="glass rounded-xl p-6 space-y-4">
        <h2 className="font-semibold">Gerar Novo Relatório</h2>
        <div className="grid sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs text-muted-foreground">Cliente</label>
            <select className={`w-full ${fieldClass}`} value={selectedClienteId} onChange={e => setSelectedClienteId(e.target.value)}>
              <option value="">Selecione um cliente</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Mês</label>
            <select className={`w-full ${fieldClass}`} value={mes} onChange={e => setMes(Number(e.target.value))}>
              {MESES.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Ano</label>
            <select className={`w-full ${fieldClass}`} value={ano} onChange={e => setAno(Number(e.target.value))}>
              {ANOS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={() => generateMutation.mutate()}
          disabled={!selectedClienteId || generateMutation.isPending}
          className="px-6 py-2 rounded-lg bg-neon-cyan text-dark-blue font-semibold text-sm hover:bg-neon-cyan-400 disabled:opacity-50 transition-all shadow-neon-cyan"
        >
          {generateMutation.isPending ? 'Gerando...' : 'Gerar Fechamento'}
        </button>
      </div>

      {/* Histórico */}
      <div>
        <h2 className="font-semibold mb-3">Histórico de Relatórios</h2>
        <div className="space-y-2">
          {relatorios.length === 0 && (
            <div className="glass rounded-xl p-10 text-center text-muted-foreground">
              <FileText size={40} className="mx-auto mb-3 opacity-30" />
              <p>Nenhum relatório gerado ainda.</p>
            </div>
          )}
          {relatorios.map(r => (
            <button key={r.id} onClick={() => viewMutation.mutate(r.id)} className="w-full glass rounded-xl p-4 flex items-center gap-4 hover:neon-border-cyan transition-all text-left">
              <div className="p-2.5 rounded-lg bg-neon-cyan/10">
                <FileText size={18} className="text-neon-cyan" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{r.cliente.nome}</p>
                <p className="text-xs text-muted-foreground">{formatMonth(r.mes, r.ano)}</p>
              </div>
              <div className="text-right mr-2 hidden sm:block">
                <p className="text-sm neon-text-cyan font-semibold">{formatHours(r.totalHoras)}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(r.valorTotal)}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
