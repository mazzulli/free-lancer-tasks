import { useState, useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import type { Cliente } from '@/types'
import { clienteApi } from '@/services/api'
import { useViaCep } from '@/hooks/useViaCep'
import { maskCNPJ, maskCEP, stripNonDigits } from '@/lib/formatters'

interface Props {
  open: boolean
  cliente?: Cliente | null
  onClose: () => void
  onSaved: () => void
}

const empty = { nome: '', razaoSocial: '', email: '', cnpj: '', cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' }

export function ClientForm({ open, cliente, onClose, onSaved }: Props) {
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const { lookup, loading: cepLoading } = useViaCep()
  const numeroRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (cliente) {
      setForm({
        nome: cliente.nome,
        razaoSocial: cliente.razaoSocial,
        email: cliente.email,
        cnpj: maskCNPJ(cliente.cnpj),
        cep: cliente.cep ? maskCEP(cliente.cep) : '',
        endereco: cliente.endereco ?? '',
        numero: cliente.numero ?? '',
        complemento: cliente.complemento ?? '',
        bairro: cliente.bairro ?? '',
        cidade: cliente.cidade ?? '',
        estado: cliente.estado ?? '',
      })
    } else {
      setForm(empty)
    }
  }, [cliente, open])

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function handleCepBlur(cep: string) {
    const result = await lookup(cep)
    if (result) {
      setForm(f => ({ ...f, ...result }))
      setTimeout(() => numeroRef.current?.focus(), 50)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form, cnpj: stripNonDigits(form.cnpj), cep: stripNonDigits(form.cep) }
      if (cliente) {
        await clienteApi.update(cliente.id, payload)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        await clienteApi.create(payload)
        toast.success('Cliente criado com sucesso!')
      }
      onSaved()
      onClose()
    } catch (err: unknown) {
      toast.error((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const fieldClass = 'w-full px-3 py-2 rounded-lg bg-dark-blue-200 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-neon-cyan/50 focus:shadow-neon-cyan transition-all'

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-xl shadow-glass animate-in fade-in zoom-in-95 scrollbar-thin">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-dark-blue-100/80 backdrop-blur-md rounded-t-xl z-10">
            <Dialog.Title className="font-semibold neon-text-cyan">{cliente ? 'Editar Cliente' : 'Novo Cliente'}</Dialog.Title>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Nome Fantasia *</label>
                <input required className={fieldClass} value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Nome fantasia" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">Razão Social *</label>
                <input required className={fieldClass} value={form.razaoSocial} onChange={e => set('razaoSocial', e.target.value)} placeholder="Razão social" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">CNPJ *</label>
                <input required className={fieldClass} value={form.cnpj} onChange={e => set('cnpj', maskCNPJ(e.target.value))} placeholder="00.000.000/0001-00" maxLength={18} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground uppercase tracking-wider">E-mail *</label>
                <input required type="email" className={fieldClass} value={form.email} onChange={e => set('email', e.target.value)} placeholder="contato@empresa.com.br" />
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Endereço</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">CEP</label>
                  <input className={fieldClass} value={form.cep} onChange={e => set('cep', maskCEP(e.target.value))} onBlur={e => handleCepBlur(e.target.value)} placeholder="00000-000" maxLength={9} />
                  {cepLoading && <p className="text-xs text-neon-cyan animate-pulse">Buscando CEP...</p>}
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs text-muted-foreground">Logradouro</label>
                  <input className={fieldClass} value={form.endereco} onChange={e => set('endereco', e.target.value)} placeholder="Rua, Av..." />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Número</label>
                  <input ref={numeroRef} className={fieldClass} value={form.numero} onChange={e => set('numero', e.target.value)} placeholder="123" />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-xs text-muted-foreground">Complemento</label>
                  <input className={fieldClass} value={form.complemento} onChange={e => set('complemento', e.target.value)} placeholder="Sala, Andar..." />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Bairro</label>
                  <input className={fieldClass} value={form.bairro} onChange={e => set('bairro', e.target.value)} placeholder="Bairro" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Cidade</label>
                  <input className={fieldClass} value={form.cidade} onChange={e => set('cidade', e.target.value)} placeholder="Cidade" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Estado</label>
                  <input className={fieldClass} value={form.estado} onChange={e => set('estado', e.target.value)} placeholder="SP" maxLength={2} />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors">Cancelar</button>
              <button type="submit" disabled={saving} className="px-6 py-2 text-sm rounded-lg bg-neon-cyan text-dark-blue font-semibold hover:bg-neon-cyan-400 disabled:opacity-50 transition-all shadow-neon-cyan">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
