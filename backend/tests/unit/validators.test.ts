import { describe, it, expect } from 'vitest'
import {
  isValidCNPJ,
  isValidCEP,
  isValidEmail,
  formatCNPJ,
  formatCEP,
  calcTotalHoras,
  stripNonDigits,
} from '../../src/domain/validators/index.js'

describe('isValidCNPJ', () => {
  it('aceita CNPJ válido', () => {
    expect(isValidCNPJ('11222333000181')).toBe(true)
  })
  it('rejeita CNPJ com dígitos iguais', () => {
    expect(isValidCNPJ('11111111111111')).toBe(false)
  })
  it('rejeita CNPJ com menos de 14 dígitos', () => {
    expect(isValidCNPJ('1234567800018')).toBe(false)
  })
  it('rejeita CNPJ inválido (dígito verificador errado)', () => {
    expect(isValidCNPJ('11222333000100')).toBe(false)
  })
  it('aceita CNPJ formatado', () => {
    expect(isValidCNPJ('11.222.333/0001-81')).toBe(true)
  })
})

describe('isValidCEP', () => {
  it('aceita CEP com 8 dígitos', () => {
    expect(isValidCEP('12345678')).toBe(true)
  })
  it('aceita CEP formatado', () => {
    expect(isValidCEP('12345-678')).toBe(true)
  })
  it('rejeita CEP com menos de 8 dígitos', () => {
    expect(isValidCEP('1234567')).toBe(false)
  })
})

describe('isValidEmail', () => {
  it('aceita e-mail válido', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
  })
  it('rejeita e-mail sem @', () => {
    expect(isValidEmail('userexample.com')).toBe(false)
  })
  it('rejeita e-mail sem domínio', () => {
    expect(isValidEmail('user@')).toBe(false)
  })
})

describe('formatCNPJ', () => {
  it('formata corretamente', () => {
    expect(formatCNPJ('11222333000181')).toBe('11.222.333/0001-81')
  })
})

describe('formatCEP', () => {
  it('formata corretamente', () => {
    expect(formatCEP('12345678')).toBe('12345-678')
  })
})

describe('calcTotalHoras', () => {
  it('calcula corretamente 1h30min', () => {
    expect(calcTotalHoras('08:00', '09:30')).toBe(1.5)
  })
  it('lança erro se fim <= início', () => {
    expect(() => calcTotalHoras('09:00', '08:00')).toThrow()
  })
})

describe('stripNonDigits', () => {
  it('remove caracteres não numéricos', () => {
    expect(stripNonDigits('12.345.678/0001-81')).toBe('12345678000181')
  })
})
