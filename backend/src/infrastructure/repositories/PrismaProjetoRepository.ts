import type { IProjetoRepository, CreateProjetoDTO, UpdateProjetoDTO, ProjetoComCliente } from '../../domain/repositories/IProjetoRepository.js'
import type { ProjetoProps } from '../../domain/entities/Projeto.js'
import { prisma } from '../database/prisma-client.js'

const includeCliente = { cliente: { select: { id: true, nome: true, razaoSocial: true } } }

export class PrismaProjetoRepository implements IProjetoRepository {
  async create(data: CreateProjetoDTO): Promise<ProjetoProps> {
    return prisma.projeto.create({ data }) as Promise<ProjetoProps>
  }

  async update(id: string, data: UpdateProjetoDTO): Promise<ProjetoProps> {
    return prisma.projeto.update({ where: { id }, data }) as Promise<ProjetoProps>
  }

  async findById(id: string): Promise<ProjetoComCliente | null> {
    return prisma.projeto.findUnique({ where: { id }, include: includeCliente }) as Promise<ProjetoComCliente | null>
  }

  async findAll(clienteId?: string): Promise<ProjetoComCliente[]> {
    return prisma.projeto.findMany({
      where: clienteId ? { clienteId } : undefined,
      include: includeCliente,
      orderBy: { createdAt: 'desc' },
    }) as Promise<ProjetoComCliente[]>
  }

  async findRecentes(limit: number): Promise<ProjetoComCliente[]> {
    return prisma.projeto.findMany({
      include: includeCliente,
      orderBy: { updatedAt: 'desc' },
      take: limit,
    }) as Promise<ProjetoComCliente[]>
  }

  async delete(id: string): Promise<void> {
    await prisma.projeto.delete({ where: { id } })
  }
}
