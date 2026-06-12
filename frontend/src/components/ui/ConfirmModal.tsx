import * as Dialog from '@radix-ui/react-dialog'
import { AlertTriangle } from 'lucide-react'

interface Props {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning'
}

export function ConfirmModal({ open, title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', onConfirm, onCancel, variant = 'danger' }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md glass rounded-xl p-6 shadow-glass animate-in fade-in zoom-in-95">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-lg ${variant === 'danger' ? 'bg-destructive/20 text-destructive' : 'bg-yellow-500/20 text-yellow-400'}`}>
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <Dialog.Title className="font-semibold text-foreground mb-1">{title}</Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">{description}</Dialog.Description>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                variant === 'danger'
                  ? 'bg-destructive text-white hover:bg-destructive/80'
                  : 'bg-yellow-500 text-black hover:bg-yellow-400'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
