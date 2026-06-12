import type { ITarefaRepository } from '../../../domain/repositories/ITarefaRepository.js'

export class GetTarefaUseCase {
  constructor(private readonly repo: ITarefaRepository) {}
  async execute(id: string) {
    const tarefa = await this.repo.findById(id)
    if (!tarefa) throw new Error('Tarefa não encontrada')
    return tarefa
  }
}
