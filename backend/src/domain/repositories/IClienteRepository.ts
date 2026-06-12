import type { ClienteProps } from '../entities/Cliente.js'

export interface CreateClienteDTO {
  id: string
  nome: string
  razaoSocial: string
  email: string
  cnpj: string
  cep?: string | null
  endereco?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
}

export interface UpdateClienteDTO extends Partial<Omit<CreateClienteDTO, 'id'>> {}

export interface IClienteRepository {
  create(data: CreateClienteDTO): Promise<ClienteProps>
  update(id: string, data: UpdateClienteDTO): Promise<ClienteProps>
  findById(id: string): Promise<ClienteProps | null>
  findByEmail(email: string): Promise<ClienteProps | null>
  findByCNPJ(cnpj: string): Promise<ClienteProps | null>
  findAll(): Promise<ClienteProps[]>
  delete(id: string): Promise<void>
}
