import type { ITarefaRepository } from '../../../domain/repositories/ITarefaRepository.js'
import type { TarefaStatus } from '../../../domain/entities/Tarefa.js'

export class ListTarefasUseCase {
  constructor(private readonly repo: ITarefaRepository) {}
  async execute(filters?: { projetoId?: string; status?: TarefaStatus; clienteId?: string }) {
    return this.repo.findAll(filters)
  }
}
