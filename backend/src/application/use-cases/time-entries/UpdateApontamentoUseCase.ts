import type { IApontamentoRepository } from '../../../domain/repositories/IApontamentoRepository.js'
import { calcTotalHoras } from '../../../domain/validators/index.js'

interface Input { id: string; data?: string; horaIni?: string; horaFim?: string }

export class UpdateApontamentoUseCase {
  constructor(private readonly repo: IApontamentoRepository) {}

  async execute(input: Input) {
    const atual = await this.repo.findById(input.id)
    if (!atual) throw new Error('Apontamento não encontrado')

    const horaIni = input.horaIni ?? atual.horaIni
    const horaFim = input.horaFim ?? atual.horaFim
    const totalHoras = calcTotalHoras(horaIni, horaFim)

    return this.repo.update(input.id, {
      data: input.data ? new Date(input.data) : undefined,
      horaIni,
      horaFim,
      totalHoras,
    })
  }
}
