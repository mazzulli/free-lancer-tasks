import { Printer } from 'lucide-react'
import type { Relatorio } from '@/types'
import { formatCNPJ, formatCEP, formatCurrency, formatHours, formatMonth, formatDate } from '@/lib/formatters'

interface Props { relatorio: Relatorio }

export function ReportView({ relatorio }: Props) {
  const { dados } = relatorio
  const { cliente, periodo, projetos } = dados

  return (
    <div className="glass rounded-xl print:bg-white print:shadow-none">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border print:hidden">
        <h2 className="font-semibold neon-text-cyan">Relatório — {formatMonth(periodo.mes, periodo.ano)}</h2>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-neon-cyan/30 transition-colors">
          <Printer size={15} /> Imprimir
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Cabeçalho do cliente */}
        <div className="glass rounded-lg p-5 space-y-1 print:bg-gray-50 print:text-gray-800">
          <h3 className="font-bold text-foreground text-lg">{cliente.razaoSocial}</h3>
          <p className="text-sm text-muted-foreground">{cliente.nome}</p>
          <div className="flex flex-wrap gap-4 text-sm mt-2">
            <span><span className="text-muted-foreground">CNPJ:</span> {formatCNPJ(cliente.cnpj)}</span>
            <span><span className="text-muted-foreground">E-mail:</span> {cliente.email}</span>
            {cliente.cep && <span><span className="text-muted-foreground">CEP:</span> {formatCEP(cliente.cep)}</span>}
          </div>
          {cliente.endereco && (
            <p className="text-sm text-muted-foreground">
              {cliente.endereco}{cliente.numero ? `, ${cliente.numero}` : ''}{cliente.complemento ? ` — ${cliente.complemento}` : ''}
              {cliente.bairro ? `, ${cliente.bairro}` : ''}{cliente.cidade ? ` — ${cliente.cidade}/${cliente.estado}` : ''}
            </p>
          )}
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-sm font-medium">Período de referência: <span className="neon-text-cyan">{formatMonth(periodo.mes, periodo.ano)}</span></p>
          </div>
        </div>

        {/* Memória de cálculo por projeto */}
        {projetos.map(p => (
          <div key={p.projetoId} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold neon-text-pink">{p.titulo}</h4>
              <span className="text-sm text-muted-foreground">{formatCurrency(p.valorHora)}/h</span>
            </div>

            <div className="glass rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">Tarefa</th>
                    <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">Data</th>
                    <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">Início</th>
                    <th className="text-left px-4 py-2 text-xs text-muted-foreground font-medium">Fim</th>
                    <th className="text-right px-4 py-2 text-xs text-muted-foreground font-medium">Horas</th>
                  </tr>
                </thead>
                <tbody>
                  {p.tarefas.flatMap(t =>
                    t.apontamentos.map((ap, i) => (
                      <tr key={`${t.tarefaId}-${i}`} className="border-b border-border/50">
                        <td className="px-4 py-2 text-foreground">{i === 0 ? t.titulo : ''}</td>
                        <td className="px-4 py-2 text-muted-foreground">{formatDate(ap.data)}</td>
                        <td className="px-4 py-2 text-muted-foreground">{ap.horaIni}</td>
                        <td className="px-4 py-2 text-muted-foreground">{ap.horaFim}</td>
                        <td className="px-4 py-2 text-right">{formatHours(ap.totalHoras)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t border-border bg-neon-cyan/5">
                    <td colSpan={4} className="px-4 py-2 text-sm font-semibold">Total do projeto</td>
                    <td className="px-4 py-2 text-right font-bold neon-text-cyan">{formatHours(p.totalHorasProjeto)}</td>
                  </tr>
                  <tr className="bg-neon-pink/5">
                    <td colSpan={4} className="px-4 py-2 text-sm font-semibold">Valor do projeto</td>
                    <td className="px-4 py-2 text-right font-bold neon-text-pink">{formatCurrency(p.valorTotalProjeto)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ))}

        {/* Totalização */}
        <div className="glass rounded-xl p-5 border border-neon-cyan/20">
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-lg">Total Geral de Horas</span>
            <span className="text-2xl font-bold neon-text-cyan">{formatHours(dados.totalHorasGeral)}</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="font-semibold text-lg">Valor Total a Pagar</span>
            <span className="text-2xl font-bold neon-text-pink">{formatCurrency(dados.valorTotalGeral)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
