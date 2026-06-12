import { describe, it, expect } from 'vitest'
import { CreateClienteUseCase } from '../../src/application/use-cases/clients/CreateClienteUseCase.js'
import type { IClienteRepository } from '../../src/domain/repositories/IClienteRepository.js'
import type { ClienteProps } from '../../src/domain/entities/Cliente.js'

const makeCliente = (overrides: Partial<ClienteProps> = {}): ClienteProps => ({
  id: '1', nome: 'X', razaoSocial: 'X LTDA', email: 'x@x.com', cnpj: '11222333000181',
  cep: null, endereco: null, numero: null, complemento: null, bairro: null, cidade: null, estado: null,
  createdAt: new Date(), updatedAt: new Date(), ...overrides,
})

function makeRepo(existing: ClienteProps | null = null): IClienteRepository {
  return {
    create: async (data) => makeCliente(data),
    update: async (id, data) => makeCliente({ id, ...data }),
    findById: async (id) => existing?.id === id ? existing : null,
    findByEmail: async (email) => existing?.email === email ? existing : null,
    findByCNPJ: async (cnpj) => existing?.cnpj === cnpj ? existing : null,
    findAll: async () => existing ? [existing] : [],
    delete: async () => {},
  }
}

describe('CreateClienteUseCase - duplicidade', () => {
  it('lança erro quando CNPJ já existe', async () => {
    const existente = makeCliente({ cnpj: '11222333000181', email: 'outro@x.com' })
    const uc = new CreateClienteUseCase(makeRepo(existente))
    await expect(uc.execute({ nome: 'Y', razaoSocial: 'Y', email: 'y@y.com', cnpj: '11222333000181' }))
      .rejects.toThrow('Já existe um cliente com este CNPJ')
  })

  it('lança erro quando e-mail já existe', async () => {
    const existente = makeCliente({ cnpj: '99999999000100', email: 'x@x.com' })
    const uc = new CreateClienteUseCase(makeRepo(existente))
    await expect(uc.execute({ nome: 'Y', razaoSocial: 'Y', email: 'x@x.com', cnpj: '11222333000181' }))
      .rejects.toThrow('Já existe um cliente com este e-mail')
  })

  it('lança erro para CNPJ inválido', async () => {
    const uc = new CreateClienteUseCase(makeRepo())
    await expect(uc.execute({ nome: 'Y', razaoSocial: 'Y', email: 'y@y.com', cnpj: '00000000000000' }))
      .rejects.toThrow('CNPJ inválido')
  })

  it('cria cliente com dados válidos', async () => {
    const uc = new CreateClienteUseCase(makeRepo())
    const result = await uc.execute({ nome: 'Y', razaoSocial: 'Y LTDA', email: 'y@y.com', cnpj: '11222333000181' })
    expect(result.email).toBe('y@y.com')
  })
})
