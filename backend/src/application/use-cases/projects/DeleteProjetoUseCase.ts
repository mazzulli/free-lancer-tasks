import type { IProjetoRepository } from '../../../domain/repositories/IProjetoRepository.js'

export class DeleteProjetoUseCase {
  constructor(private readonly repo: IProjetoRepository) {}
  async execute(id: string) {
    const projeto = await this.repo.findById(id)
    if (!projeto) throw new Error('Projeto não encontrado')
    await this.repo.delete(id)
  }
}
