import { prisma } from '../../../infrastructure/database/prisma-client.js'
import type { ITarefaRepository } from '../../../domain/repositories/ITarefaRepository.js'
import type { IProjetoRepository } from '../../../domain/repositories/IProjetoRepository.js'

export class GetDashboardUseCase {
  constructor(
    private readonly tarefaRepo: ITarefaRepository,
    private readonly projetoRepo: IProjetoRepository,
  ) {}

  async execute() {
    const [countsByStatus, recentProjects, topClientes] = await Promise.all([
      this.tarefaRepo.countByStatus(),
      this.projetoRepo.findRecentes(6),
      this.getTopClientes(),
    ])

    const horasPorClienteMes = await this.getHorasPorClienteMes()

    return { countsByStatus, recentProjects, topClientes, horasPorClienteMes }
  }

  private async getTopClientes() {
    const result = await prisma.apontamento.groupBy({
      by: ['tarefaId'],
      _sum: { totalHoras: true },
    })

    const clienteHoras: Record<string, { nome: string; totalHoras: number }> = {}

    for (const r of result) {
      const tarefa = await prisma.tarefa.findUnique({
        where: { id: r.tarefaId },
        include: { projeto: { include: { cliente: true } } },
      })
      if (!tarefa) continue
      const c = tarefa.projeto.cliente
      if (!clienteHoras[c.id]) clienteHoras[c.id] = { nome: c.nome, totalHoras: 0 }
      clienteHoras[c.id].totalHoras += r._sum.totalHoras ?? 0
    }

    return Object.entries(clienteHoras)
      .map(([id, v]) => ({ id, ...v }))
      .sort((a, b) => b.totalHoras - a.totalHoras)
      .slice(0, 5)
  }

  private async getHorasPorClienteMes() {
    const now = new Date()
    const meses = Array.from({ length: 3 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      return { mes: d.getMonth() + 1, ano: d.getFullYear() }
    }).reverse()

    const resultado: Array<{ mes: number; ano: number; clientes: Array<{ nome: string; horas: number }> }> = []

    for (const { mes, ano } of meses) {
      const inicio = new Date(ano, mes - 1, 1)
      const fim = new Date(ano, mes, 0, 23, 59, 59)

      const aps = await prisma.apontamento.findMany({
        where: { data: { gte: inicio, lte: fim } },
        include: { tarefa: { include: { projeto: { include: { cliente: true } } } } },
      })

      const horas: Record<string, { nome: string; horas: number }> = {}
      for (const ap of aps) {
        const c = ap.tarefa.projeto.cliente
        if (!horas[c.id]) horas[c.id] = { nome: c.nome, horas: 0 }
        horas[c.id].horas += ap.totalHoras
      }

      resultado.push({ mes, ano, clientes: Object.values(horas) })
    }

    return resultado
  }
}
