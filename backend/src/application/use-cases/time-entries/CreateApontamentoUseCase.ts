import { randomUUID } from 'crypto'
import type { IApontamentoRepository } from '../../../domain/repositories/IApontamentoRepository.js'
import type { ITarefaRepository } from '../../../domain/repositories/ITarefaRepository.js'
import { calcTotalHoras } from '../../../domain/validators/index.js'

interface Input {
  tarefaId: string
  data: string
  horaIni: string
  horaFim: string
}

export class CreateApontamentoUseCase {
  constructor(
    private readonly apontamentoRepo: IApontamentoRepository,
    private readonly tarefaRepo: ITarefaRepository,
  ) {}

  async execute(input: Input) {
    const tarefa = await this.tarefaRepo.findById(input.tarefaId)
    if (!tarefa) throw new Error('Tarefa não encontrada')

    const totalHoras = calcTotalHoras(input.horaIni, input.horaFim)

    return this.apontamentoRepo.create({
      id: randomUUID(),
      tarefaId: input.tarefaId,
      data: new Date(input.data),
      horaIni: input.horaIni,
      horaFim: input.horaFim,
      totalHoras,
    })
  }
}
