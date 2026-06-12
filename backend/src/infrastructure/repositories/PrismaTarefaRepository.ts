import type { ITarefaRepository, CreateTarefaDTO, UpdateTarefaDTO, TarefaComDetalhes, DocumentoProps } from '../../domain/repositories/ITarefaRepository.js'
import type { TarefaProps, TarefaStatus } from '../../domain/entities/Tarefa.js'
import { prisma } from '../database/prisma-client.js'

const includeDetalhes = {
  apontamentos: { orderBy: { data: 'asc' as const } },
  documentos: true,
  projeto: { select: { id: true, titulo: true, valorHora: true, cliente: { select: { id: true, nome: true } } } },
}

export class PrismaTarefaRepository implements ITarefaRepository {
  async create(data: CreateTarefaDTO): Promise<TarefaProps> {
    return prisma.tarefa.create({ data }) as Promise<TarefaProps>
  }

  async update(id: string, data: UpdateTarefaDTO): Promise<TarefaProps> {
    return prisma.tarefa.update({ where: { id }, data }) as Promise<TarefaProps>
  }

  async findById(id: string): Promise<TarefaComDetalhes | null> {
    return prisma.tarefa.findUnique({ where: { id }, include: includeDetalhes }) as Promise<TarefaComDetalhes | null>
  }

  async findAll(filters?: { projetoId?: string; status?: TarefaStatus; clienteId?: string }): Promise<TarefaComDetalhes[]> {
    const where: Record<string, unknown> = {}
    if (filters?.projetoId) where.projetoId = filters.projetoId
    if (filters?.status) where.status = filters.status
    if (filters?.clienteId) where.projeto = { is: { clienteId: filters.clienteId } }
    return prisma.tarefa.findMany({ where, include: includeDetalhes, orderBy: { createdAt: 'desc' } }) as Promise<TarefaComDetalhes[]>
  }

  async delete(id: string): Promise<void> {
    await prisma.tarefa.delete({ where: { id } })
  }

  async addDocumento(data: Omit<DocumentoProps, 'createdAt'>): Promise<DocumentoProps> {
    return prisma.documento.create({ data }) as Promise<DocumentoProps>
  }

  async deleteDocumento(docId: string): Promise<DocumentoProps> {
    return prisma.documento.delete({ where: { id: docId } }) as Promise<DocumentoProps>
  }

  async countByStatus(): Promise<Record<TarefaStatus, number>> {
    const counts = await prisma.tarefa.groupBy({ by: ['status'], _count: { id: true } })
    const result: Record<string, number> = { NOVA: 0, EM_ANDAMENTO: 0, PRONTA: 0, FECHADA: 0 }
    for (const c of counts) result[c.status] = c._count.id
    return result as Record<TarefaStatus, number>
  }
}
