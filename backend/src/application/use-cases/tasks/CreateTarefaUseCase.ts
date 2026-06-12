import { randomUUID } from 'crypto'
import type { ITarefaRepository } from '../../../domain/repositories/ITarefaRepository.js'
import type { IProjetoRepository } from '../../../domain/repositories/IProjetoRepository.js'
import type { TarefaStatus } from '../../../domain/entities/Tarefa.js'

interface Input {
  projetoId: string
  titulo: string
  descricao?: string
  status?: TarefaStatus
}

export class CreateTarefaUseCase {
  constructor(
    private readonly tarefaRepo: ITarefaRepository,
    private readonly projetoRepo: IProjetoRepository,
  ) {}

  async execute(input: Input) {
    const projeto = await this.projetoRepo.findById(input.projetoId)
    if (!projeto) throw new Error('Projeto não encontrado')

    return this.tarefaRepo.create({
      id: randomUUID(),
      projetoId: input.projetoId,
      titulo: input.titulo.trim(),
      descricao: input.descricao ?? null,
      status: input.status ?? 'NOVA',
    })
  }
}
