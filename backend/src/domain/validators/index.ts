export function isValidCNPJ(cnpj: string): boolean {
  const digits = cnpj.replace(/\D/g, '')
  if (digits.length !== 14) return false
  if (/^(\d)\1+$/.test(digits)) return false

  const calc = (len: number) => {
    let sum = 0
    let pos = len - 7
    for (let i = len; i >= 1; i--) {
      sum += parseInt(digits[len - i]) * pos--
      if (pos < 2) pos = 9
    }
    const result = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    return result === parseInt(digits[len])
  }

  return calc(12) && calc(13)
}

export function isValidCEP(cep: string): boolean {
  const digits = cep.replace(/\D/g, '')
  return digits.length === 8
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatCNPJ(cnpj: string): string {
  const d = stripNonDigits(cnpj)
  return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
}

export function formatCEP(cep: string): string {
  const d = stripNonDigits(cep)
  return d.replace(/^(\d{5})(\d{3})$/, '$1-$2')
}

export function calcTotalHoras(horaIni: string, horaFim: string): number {
  const [hIni, mIni] = horaIni.split(':').map(Number)
  const [hFim, mFim] = horaFim.split(':').map(Number)
  const ini = hIni * 60 + mIni
  const fim = hFim * 60 + mFim
  if (fim <= ini) throw new Error('Hora fim deve ser maior que hora início')
  return Math.round(((fim - ini) / 60) * 100) / 100
}
