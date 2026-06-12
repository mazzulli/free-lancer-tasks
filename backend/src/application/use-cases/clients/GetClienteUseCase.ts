import type { IClienteRepository } from '../../../domain/repositories/IClienteRepository.js'

export class GetClienteUseCase {
  constructor(private readonly repo: IClienteRepository) {}
  async execute(id: string) {
    const cliente = await this.repo.findById(id)
    if (!cliente) throw new Error('Cliente não encontrado')
    return cliente
  }
}
