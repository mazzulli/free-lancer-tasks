import type { ProjetoProps } from '../entities/Projeto.js'

export interface CreateProjetoDTO {
  id: string
  clienteId: string
  titulo: string
  descricao?: string | null
  valorHora: number
}

export interface UpdateProjetoDTO extends Partial<Omit<CreateProjetoDTO, 'id' | 'clienteId'>> {}

export interface ProjetoComCliente extends ProjetoProps {
  cliente: { id: string; nome: string; razaoSocial: string }
}

export interface IProjetoRepository {
  create(data: CreateProjetoDTO): Promise<ProjetoProps>
  update(id: string, data: UpdateProjetoDTO): Promise<ProjetoProps>
  findById(id: string): Promise<ProjetoComCliente | null>
  findAll(clienteId?: string): Promise<ProjetoComCliente[]>
  findRecentes(limit: number): Promise<ProjetoComCliente[]>
  delete(id: string): Promise<void>
}
