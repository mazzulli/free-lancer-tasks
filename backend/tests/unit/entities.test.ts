import { describe, it, expect } from 'vitest'
import { Cliente } from '../../src/domain/entities/Cliente.js'
import { Projeto } from '../../src/domain/entities/Projeto.js'
import { Tarefa } from '../../src/domain/entities/Tarefa.js'
import { Apontamento } from '../../src/domain/entities/Apontamento.js'

describe('Cliente entity', () => {
  it('cria um cliente com factory method', () => {
    const c = Cliente.create({ id: '1', nome: 'Empresa', razaoSocial: 'Empresa LTDA', email: 'a@b.com', cnpj: '11222333000181' })
    expect(c.nome).toBe('Empresa')
    expect(c.email).toBe('a@b.com')
    expect(c.createdAt).toBeInstanceOf(Date)
  })

  it('serializa para JSON', () => {
    const c = Cliente.create({ id: '1', nome: 'X', razaoSocial: 'X LTDA', email: 'x@x.com', cnpj: '11222333000181' })
    const json = c.toJSON()
    expect(json.nome).toBe('X')
    expect(json.id).toBe('1')
  })
})

describe('Projeto entity', () => {
  it('cria projeto e expõe propriedades', () => {
    const p = Projeto.create({ id: '2', clienteId: '1', titulo: 'Projeto A', valorHora: 150 })
    expect(p.valorHora).toBe(150)
    expect(p.clienteId).toBe('1')
  })
})

describe('Tarefa entity', () => {
  it('status padrão é NOVA', () => {
    const t = Tarefa.create({ id: '3', projetoId: '2', titulo: 'Task 1' })
    expect(t.status).toBe('NOVA')
  })

  it('aceita status customizado', () => {
    const t = Tarefa.create({ id: '3', projetoId: '2', titulo: 'Task 1', status: 'EM_ANDAMENTO' })
    expect(t.status).toBe('EM_ANDAMENTO')
  })
})

describe('Apontamento entity', () => {
  it('cria apontamento com totalHoras', () => {
    const a = Apontamento.create({ id: '4', tarefaId: '3', data: new Date(), horaIni: '08:00', horaFim: '10:00', totalHoras: 2 })
    expect(a.totalHoras).toBe(2)
  })
})
