import { randomUUID } from 'crypto'
import type { IClienteRepository, CreateClienteDTO } from '../../../domain/repositories/IClienteRepository.js'
import { isValidCNPJ, isValidEmail, isValidCEP, stripNonDigits } from '../../../domain/validators/index.js'

interface Input {
  nome: string
  razaoSocial: string
  email: string
  cnpj: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
}

export class CreateClienteUseCase {
  constructor(private readonly repo: IClienteRepository) {}

  async execute(input: Input) {
    const cnpj = stripNonDigits(input.cnpj)
    const email = input.email.trim().toLowerCase()

    if (!isValidCNPJ(cnpj)) throw new Error('CNPJ inválido')
    if (!isValidEmail(email)) throw new Error('E-mail inválido')
    if (input.cep && !isValidCEP(input.cep)) throw new Error('CEP inválido')

    const existeCNPJ = await this.repo.findByCNPJ(cnpj)
    if (existeCNPJ) throw new Error('Já existe um cliente com este CNPJ')

    const existeEmail = await this.repo.findByEmail(email)
    if (existeEmail) throw new Error('Já existe um cliente com este e-mail')

    const data: CreateClienteDTO = {
      id: randomUUID(),
      nome: input.nome.trim(),
      razaoSocial: input.razaoSocial.trim(),
      email,
      cnpj,
      cep: input.cep ? stripNonDigits(input.cep) : null,
      endereco: input.endereco ?? null,
      numero: input.numero ?? null,
      complemento: input.complemento ?? null,
      bairro: input.bairro ?? null,
      cidade: input.cidade ?? null,
      estado: input.estado ?? null,
    }

    return this.repo.create(data)
  }
}
