import { randomUUID } from 'crypto'
import { prisma } from '../../../infrastructure/database/prisma-client.js'
import type { IClienteRepository } from '../../../domain/repositories/IClienteRepository.js'
import type { IApontamentoRepository } from '../../../domain/repositories/IApontamentoRepository.js'
import type { IProjetoRepository } from '../../../domain/repositories/IProjetoRepository.js'

interface Input { clienteId: string; mes: number; ano: number }

export class GenerateReportUseCase {
  constructor(
    private readonly clienteRepo: IClienteRepository,
    private readonly projetoRepo: IProjetoRepository,
    private readonly apontamentoRepo: IApontamentoRepository,
  ) {}

  async execute(input: Input) {
    const cliente = await this.clienteRepo.findById(input.clienteId)
    if (!cliente) throw new Error('Cliente não encontrado')

    const apontamentos = await this.apontamentoRepo.findByPeriodo(input.clienteId, input.mes, input.ano)
    const projetos = await this.projetoRepo.findAll(input.clienteId)

    // Group apontamentos by projeto
    const porProjeto: Record<string, { projeto: (typeof projetos)[0]; tarefas: Record<string, { titulo: string; horas: number; apontamentos: typeof apontamentos }> }> = {}

    for (const ap of apontamentos) {
      const projeto = projetos.find(p => p.id === ap.tarefa.projetoId)
      if (!projeto) continue

      if (!porProjeto[projeto.id]) {
        porProjeto[projeto.id] = { projeto, tarefas: {} }
      }

      const pp = porProjeto[projeto.id]
      if (!pp.tarefas[ap.tarefaId]) {
        pp.tarefas[ap.tarefaId] = { titulo: ap.tarefa.titulo, horas: 0, apontamentos: [] }
      }
      pp.tarefas[ap.tarefaId].horas += ap.totalHoras
      pp.tarefas[ap.tarefaId].apontamentos.push(ap)
    }

    let totalHorasGeral = 0
    let valorTotalGeral = 0

    const dadosProjetos = Object.values(porProjeto).map(({ projeto, tarefas }) => {
      const totalHorasProjeto = Object.values(tarefas).reduce((s, t) => s + t.horas, 0)
      const valorTotalProjeto = Math.round(totalHorasProjeto * projeto.valorHora * 100) / 100
      totalHorasGeral += totalHorasProjeto
      valorTotalGeral += valorTotalProjeto

      return {
        projetoId: projeto.id,
        titulo: projeto.titulo,
        valorHora: projeto.valorHora,
        totalHorasProjeto: Math.round(totalHorasProjeto * 100) / 100,
        valorTotalProjeto,
        tarefas: Object.entries(tarefas).map(([id, t]) => ({
          tarefaId: id,
          titulo: t.titulo,
          totalHoras: Math.round(t.horas * 100) / 100,
          apontamentos: t.apontamentos.map(a => ({
            data: a.data,
            horaIni: a.horaIni,
            horaFim: a.horaFim,
            totalHoras: a.totalHoras,
          })),
        })),
      }
    })

    const dados = {
      cliente,
      periodo: { mes: input.mes, ano: input.ano },
      projetos: dadosProjetos,
      totalHorasGeral: Math.round(totalHorasGeral * 100) / 100,
      valorTotalGeral: Math.round(valorTotalGeral * 100) / 100,
    }

    return prisma.relatorio.create({
      data: {
        id: randomUUID(),
        clienteId: input.clienteId,
        mes: input.mes,
        ano: input.ano,
        dados: JSON.stringify(dados),
        totalHoras: dados.totalHorasGeral,
        valorTotal: dados.valorTotalGeral,
      },
    })
  }
}
