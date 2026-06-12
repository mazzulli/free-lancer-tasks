import type { TarefaProps, TarefaStatus } from '../entities/Tarefa.js'
import type { ApontamentoProps } from '../entities/Apontamento.js'

export interface CreateTarefaDTO {
  id: string
  projetoId: string
  titulo: string
  descricao?: string | null
  status?: TarefaStatus
}

export interface UpdateTarefaDTO extends Partial<Omit<CreateTarefaDTO, 'id' | 'projetoId'>> {}

export interface DocumentoProps {
  id: string
  tarefaId: string
  nome: string
  tipo: string
  caminho: string
  tamanho: number
  createdAt: Date
}

export interface TarefaComDetalhes extends TarefaProps {
  apontamentos: ApontamentoProps[]
  documentos: DocumentoProps[]
  projeto: { id: string; titulo: string; valorHora: number; cliente: { id: string; nome: string } }
}

export interface ITarefaRepository {
  create(data: CreateTarefaDTO): Promise<TarefaProps>
  update(id: string, data: UpdateTarefaDTO): Promise<TarefaProps>
  findById(id: string): Promise<TarefaComDetalhes | null>
  findAll(filters?: { projetoId?: string; status?: TarefaStatus; clienteId?: string }): Promise<TarefaComDetalhes[]>
  delete(id: string): Promise<void>
  addDocumento(data: Omit<DocumentoProps, 'createdAt'>): Promise<DocumentoProps>
  deleteDocumento(docId: string): Promise<DocumentoProps>
  countByStatus(): Promise<Record<TarefaStatus, number>>
}
