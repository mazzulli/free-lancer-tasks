import type { IProjetoRepository } from '../../../domain/repositories/IProjetoRepository.js'

interface Input { id: string; titulo?: string; descricao?: string; valorHora?: number }

export class UpdateProjetoUseCase {
  constructor(private readonly repo: IProjetoRepository) {}
  async execute(input: Input) {
    const projeto = await this.repo.findById(input.id)
    if (!projeto) throw new Error('Projeto não encontrado')
    if (input.valorHora !== undefined && input.valorHora < 0) throw new Error('Valor por hora deve ser maior ou igual a zero')
    return this.repo.update(input.id, { titulo: input.titulo?.trim(), descricao: input.descricao, valorHora: input.valorHora })
  }
}
