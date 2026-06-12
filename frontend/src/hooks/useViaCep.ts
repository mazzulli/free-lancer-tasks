import { useState } from 'react'
import { stripNonDigits } from '@/lib/formatters'

interface ViaCepResult {
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export function useViaCep() {
  const [loading, setLoading] = useState(false)

  async function lookup(cep: string) {
    const digits = stripNonDigits(cep)
    if (digits.length !== 8) return null
    setLoading(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data: ViaCepResult = await res.json()
      if (data.erro) return null
      return {
        endereco: data.logradouro,
        complemento: data.complemento,
        bairro: data.bairro,
        cidade: data.localidade,
        estado: data.uf,
      }
    } catch {
      return null
    } finally {
      setLoading(false)
    }
  }

  return { lookup, loading }
}
