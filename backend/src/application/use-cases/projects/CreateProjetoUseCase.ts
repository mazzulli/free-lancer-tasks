import { randomUUID } from 'crypto'
import type { IProjetoRepository } from '../../../domain/repositories/IProjetoRepository.js'
import type { IClienteRepository } from '../../../domain/repositories/IClienteRepository.js'

interface Input {
  clienteId: string
  titulo: string
  descricao?: string
  valorHora: number
}

export class CreateProjetoUseCase {
  constructor(
    private readonly projetoRepo: IProjetoRepository,
    private readonly clienteRepo: IClienteRepository,
  ) {}

  async execute(input: Input) {
    const cliente = await this.clienteRepo.findById(input.clienteId)
    if (!cliente) throw new Error('Cliente não encontrado')
    if (input.valorHora < 0) throw new Error('Valor por hora deve ser maior ou igual a zero')

    return this.projetoRepo.create({
      id: randomUUID(),
      clienteId: input.clienteId,
      titulo: input.titulo.trim(),
      descricao: input.descricao ?? null,
      valorHora: input.valorHora,
    })
  }
}
