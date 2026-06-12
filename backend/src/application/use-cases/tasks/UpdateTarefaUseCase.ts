import type { ITarefaRepository } from '../../../domain/repositories/ITarefaRepository.js'
import type { TarefaStatus } from '../../../domain/entities/Tarefa.js'

interface Input { id: string; titulo?: string; descricao?: string; status?: TarefaStatus }

export class UpdateTarefaUseCase {
  constructor(private readonly repo: ITarefaRepository) {}
  async execute(input: Input) {
    const tarefa = await this.repo.findById(input.id)
    if (!tarefa) throw new Error('Tarefa não encontrada')
    return this.repo.update(input.id, { titulo: input.titulo?.trim(), descricao: input.descricao, status: input.status })
  }
}
