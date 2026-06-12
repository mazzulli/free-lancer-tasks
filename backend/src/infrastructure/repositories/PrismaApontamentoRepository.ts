import type { IApontamentoRepository, CreateApontamentoDTO, UpdateApontamentoDTO } from '../../domain/repositories/IApontamentoRepository.js'
import type { ApontamentoProps } from '../../domain/entities/Apontamento.js'
import { prisma } from '../database/prisma-client.js'

export class PrismaApontamentoRepository implements IApontamentoRepository {
  async create(data: CreateApontamentoDTO): Promise<ApontamentoProps> {
    return prisma.apontamento.create({ data }) as Promise<ApontamentoProps>
  }

  async update(id: string, data: UpdateApontamentoDTO): Promise<ApontamentoProps> {
    return prisma.apontamento.update({ where: { id }, data }) as Promise<ApontamentoProps>
  }

  async findById(id: string): Promise<ApontamentoProps | null> {
    return prisma.apontamento.findUnique({ where: { id } }) as Promise<ApontamentoProps | null>
  }

  async findByTarefa(tarefaId: string): Promise<ApontamentoProps[]> {
    return prisma.apontamento.findMany({ where: { tarefaId }, orderBy: { data: 'asc' } }) as Promise<ApontamentoProps[]>
  }

  async findByPeriodo(clienteId: string, mes: number, ano: number) {
    const inicio = new Date(ano, mes - 1, 1)
    const fim = new Date(ano, mes, 0, 23, 59, 59)
    return prisma.apontamento.findMany({
      where: {
        data: { gte: inicio, lte: fim },
        tarefa: { projeto: { clienteId } },
      },
      include: { tarefa: { select: { id: true, titulo: true, projetoId: true } } },
      orderBy: { data: 'asc' },
    }) as Promise<Array<ApontamentoProps & { tarefa: { id: string; titulo: string; projetoId: string } }>>
  }

  async delete(id: string): Promise<void> {
    await prisma.apontamento.delete({ where: { id } })
  }
}
