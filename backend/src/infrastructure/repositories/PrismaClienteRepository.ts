import type { IClienteRepository, CreateClienteDTO, UpdateClienteDTO } from '../../domain/repositories/IClienteRepository.js'
import type { ClienteProps } from '../../domain/entities/Cliente.js'
import { prisma } from '../database/prisma-client.js'

export class PrismaClienteRepository implements IClienteRepository {
  async create(data: CreateClienteDTO): Promise<ClienteProps> {
    return prisma.cliente.create({ data }) as Promise<ClienteProps>
  }

  async update(id: string, data: UpdateClienteDTO): Promise<ClienteProps> {
    return prisma.cliente.update({ where: { id }, data }) as Promise<ClienteProps>
  }

  async findById(id: string): Promise<ClienteProps | null> {
    return prisma.cliente.findUnique({ where: { id } }) as Promise<ClienteProps | null>
  }

  async findByEmail(email: string): Promise<ClienteProps | null> {
    return prisma.cliente.findUnique({ where: { email } }) as Promise<ClienteProps | null>
  }

  async findByCNPJ(cnpj: string): Promise<ClienteProps | null> {
    return prisma.cliente.findUnique({ where: { cnpj } }) as Promise<ClienteProps | null>
  }

  async findAll(): Promise<ClienteProps[]> {
    return prisma.cliente.findMany({ orderBy: { nome: 'asc' } }) as Promise<ClienteProps[]>
  }

  async delete(id: string): Promise<void> {
    await prisma.cliente.delete({ where: { id } })
  }
}
