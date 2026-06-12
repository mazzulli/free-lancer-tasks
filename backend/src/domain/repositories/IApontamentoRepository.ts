import type { ApontamentoProps } from '../entities/Apontamento.js'

export interface CreateApontamentoDTO {
  id: string
  tarefaId: string
  data: Date
  horaIni: string
  horaFim: string
  totalHoras: number
}

export interface UpdateApontamentoDTO extends Partial<Omit<CreateApontamentoDTO, 'id' | 'tarefaId'>> {}

export interface IApontamentoRepository {
  create(data: CreateApontamentoDTO): Promise<ApontamentoProps>
  update(id: string, data: UpdateApontamentoDTO): Promise<ApontamentoProps>
  findById(id: string): Promise<ApontamentoProps | null>
  findByTarefa(tarefaId: string): Promise<ApontamentoProps[]>
  findByPeriodo(clienteId: string, mes: number, ano: number): Promise<Array<ApontamentoProps & { tarefa: { id: string; titulo: string; projetoId: string } }>>
  delete(id: string): Promise<void>
}
