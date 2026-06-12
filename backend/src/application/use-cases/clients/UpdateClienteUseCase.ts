import type { IClienteRepository } from '../../../domain/repositories/IClienteRepository.js'
import { isValidCNPJ, isValidEmail, isValidCEP, stripNonDigits } from '../../../domain/validators/index.js'

interface Input {
  id: string
  nome?: string
  razaoSocial?: string
  email?: string
  cnpj?: string
  cep?: string
  endereco?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
}

export class UpdateClienteUseCase {
  constructor(private readonly repo: IClienteRepository) {}

  async execute(input: Input) {
    const cliente = await this.repo.findById(input.id)
    if (!cliente) throw new Error('Cliente não encontrado')

    const cnpj = input.cnpj ? stripNonDigits(input.cnpj) : undefined
    const email = input.email ? input.email.trim().toLowerCase() : undefined

    if (cnpj && !isValidCNPJ(cnpj)) throw new Error('CNPJ inválido')
    if (email && !isValidEmail(email)) throw new Error('E-mail inválido')
    if (input.cep && !isValidCEP(input.cep)) throw new Error('CEP inválido')

    if (cnpj && cnpj !== cliente.cnpj) {
      const existe = await this.repo.findByCNPJ(cnpj)
      if (existe) throw new Error('Já existe um cliente com este CNPJ')
    }

    if (email && email !== cliente.email) {
      const existe = await this.repo.findByEmail(email)
      if (existe) throw new Error('Já existe um cliente com este e-mail')
    }

    return this.repo.update(input.id, {
      nome: input.nome?.trim(),
      razaoSocial: input.razaoSocial?.trim(),
      email,
      cnpj,
      cep: input.cep ? stripNonDigits(input.cep) : undefined,
      endereco: input.endereco,
      numero: input.numero,
      complemento: input.complemento,
      bairro: input.bairro,
      cidade: input.cidade,
      estado: input.estado,
    })
  }
}
