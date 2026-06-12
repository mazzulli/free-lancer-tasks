import type { IApontamentoRepository } from '../../../domain/repositories/IApontamentoRepository.js'

export class DeleteApontamentoUseCase {
  constructor(private readonly repo: IApontamentoRepository) {}
  async execute(id: string) {
    const ap = await this.repo.findById(id)
    if (!ap) throw new Error('Apontamento não encontrado')
    await this.repo.delete(id)
  }
}
