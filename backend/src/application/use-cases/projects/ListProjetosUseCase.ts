import type { IProjetoRepository } from '../../../domain/repositories/IProjetoRepository.js'

export class ListProjetosUseCase {
  constructor(private readonly repo: IProjetoRepository) {}
  async execute(clienteId?: string) { return this.repo.findAll(clienteId) }
}
