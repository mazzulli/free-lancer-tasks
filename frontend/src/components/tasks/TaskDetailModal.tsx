import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Plus, Pencil, Trash2, Upload, FileText, Image, Clock } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import MDEditor from '@uiw/react-md-editor'
import type { Tarefa, Apontamento } from '@/types'
import { tarefaApi, apontamentoApi } from '@/services/api'
import { formatDate, formatHours } from '@/lib/formatters'
import { TimeEntryForm } from './TimeEntryForm'
import { ConfirmModal } from '@/components/ui/ConfirmModal'

interface Props {
  tarefaId: string | null
  onClose: () => void
}

const STATUS_LABELS: Record<string, string> = { NOVA: 'Nova', EM_ANDAMENTO: 'Em Andamento', PRONTA: 'Pronta', FECHADA: 'Fechada' }
const STATUS_COLORS: Record<string, string> = { NOVA: 'text-blue-400 bg-blue-400/10', EM_ANDAMENTO: 'text-yellow-400 bg-yellow-400/10', PRONTA: 'text-neon-cyan bg-neon-cyan/10', FECHADA: 'text-neon-pink bg-neon-pink/10' }

export function TaskDetailModal({ tarefaId, onClose }: Props) {
  const qc = useQueryClient()
  const [addingEntry, setAddingEntry] = useState(false)
  const [editingEntry, setEditingEntry] = useState<Apontamento | null>(null)
  const [deletingEntry, setDeletingEntry] = useState<Apontamento | null>(null)
  const [deletingDoc, setDeletingDoc] = useState<string | null>(null)

  const { data: tarefa } = useQuery({
    queryKey: ['tarefa', tarefaId],
    queryFn: () => tarefaApi.get(tarefaId!),
    enabled: !!tarefaId,
  })

  const deleteEntryMutation = useMutation({
    mutationFn: (id: string) => apontamentoApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tarefa', tarefaId] }); toast.success('Apontamento removido!'); setDeletingEntry(null) },
    onError: (e: Error) => toast.error(e.message),
  })

  const deleteDocMutation = useMutation({
    mutationFn: (docId: string) => tarefaApi.deleteDoc(tarefaId!, docId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tarefa', tarefaId] }); toast.success('Documento removido!'); setDeletingDoc(null) },
    onError: (e: Error) => toast.error(e.message),
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'], 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    onDrop: async (files) => {
      for (const file of files) {
        try { await tarefaApi.uploadDoc(tarefaId!, file); toast.success(`${file.name} enviado!`) }
        catch (e: unknown) { toast.error((e as Error).message) }
      }
      qc.invalidateQueries({ queryKey: ['tarefa', tarefaId] })
    },
  })

  const totalHoras = tarefa?.apontamentos.reduce((s, a) => s + a.totalHoras, 0) ?? 0

  return (
    <Dialog.Root open={!!tarefaId} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[90vh] overflow-y-auto glass rounded-xl shadow-glass animate-in fade-in zoom-in-95 scrollbar-thin">
          {!tarefa ? (
            <div className="p-10 text-center text-muted-foreground">Carregando...</div>
          ) : (
            <>
              <div className="flex items-start justify-between px-6 py-4 border-b border-border sticky top-0 bg-dark-blue-100/80 backdrop-blur-md rounded-t-xl z-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[tarefa.status]}`}>{STATUS_LABELS[tarefa.status]}</span>
                    <span className="text-xs text-muted-foreground">{tarefa.projeto.titulo}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{tarefa.projeto.cliente.nome}</span>
                  </div>
                  <Dialog.Title className="font-semibold text-foreground text-lg">{tarefa.titulo}</Dialog.Title>
                </div>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-1"><X size={18} /></button>
              </div>

              <div className="p-6 space-y-6">
                {tarefa.descricao && (
                  <div data-color-mode="dark">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Descrição</p>
                    <MDEditor.Markdown source={tarefa.descricao} style={{ background: 'transparent', color: '#e0f7fa' }} />
                  </div>
                )}

                {/* Apontamentos */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-neon-cyan" />
                      <p className="text-sm font-medium">Apontamentos</p>
                      <span className="text-xs text-neon-cyan bg-neon-cyan/10 px-2 py-0.5 rounded-full">{formatHours(totalHoras)} total</span>
                    </div>
                    <button onClick={() => { setAddingEntry(true); setEditingEntry(null) }} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-colors">
                      <Plus size={13} /> Adicionar
                    </button>
                  </div>

                  {(addingEntry || editingEntry) && (
                    <div className="mb-3">
                      <TimeEntryForm tarefaId={tarefa.id} apontamento={editingEntry} onDone={() => { setAddingEntry(false); setEditingEntry(null) }} onCancel={() => { setAddingEntry(false); setEditingEntry(null) }} />
                    </div>
                  )}

                  <div className="space-y-2">
                    {tarefa.apontamentos.length === 0 && !addingEntry && <p className="text-sm text-muted-foreground text-center py-4">Nenhum apontamento registrado.</p>}
                    {tarefa.apontamentos.map(ap => (
                      <div key={ap.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-blue-200 border border-border text-sm">
                        <span className="text-muted-foreground w-24 shrink-0">{formatDate(ap.data)}</span>
                        <span>{ap.horaIni} – {ap.horaFim}</span>
                        <span className="neon-text-cyan font-medium ml-auto">{formatHours(ap.totalHoras)}</span>
                        <button onClick={() => { setEditingEntry(ap); setAddingEntry(false) }} className="text-muted-foreground hover:text-neon-cyan transition-colors"><Pencil size={13} /></button>
                        <button onClick={() => setDeletingEntry(ap)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documentos */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={16} className="text-neon-pink" />
                    <p className="text-sm font-medium">Documentos</p>
                  </div>

                  <div {...getRootProps()} className={`rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-all ${isDragActive ? 'border-neon-cyan bg-neon-cyan/5' : 'border-border hover:border-neon-cyan/40'}`}>
                    <input {...getInputProps()} />
                    <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{isDragActive ? 'Solte os arquivos aqui' : 'Arraste arquivos ou clique para selecionar'}</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG, GIF (máx. 20MB)</p>
                  </div>

                  {tarefa.documentos.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {tarefa.documentos.map(doc => (
                        <div key={doc.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-blue-200 border border-border text-sm">
                          {doc.tipo.startsWith('image') ? <Image size={15} className="text-neon-cyan shrink-0" /> : <FileText size={15} className="text-neon-pink shrink-0" />}
                          <a href={`/uploads/${tarefaId}/${doc.caminho.split(/[\\/]/).pop()}`} target="_blank" rel="noreferrer" className="flex-1 truncate hover:text-neon-cyan transition-colors">{doc.nome}</a>
                          <span className="text-xs text-muted-foreground shrink-0">{(doc.tamanho / 1024).toFixed(0)} KB</span>
                          <button onClick={() => setDeletingDoc(doc.id)} className="text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <ConfirmModal open={!!deletingEntry} title="Remover apontamento" description="Deseja remover este apontamento?" confirmLabel="Remover" onConfirm={() => deletingEntry && deleteEntryMutation.mutate(deletingEntry.id)} onCancel={() => setDeletingEntry(null)} />
          <ConfirmModal open={!!deletingDoc} title="Remover documento" description="Deseja remover este documento? Esta ação não pode ser desfeita." confirmLabel="Remover" onConfirm={() => deletingDoc && deleteDocMutation.mutate(deletingDoc)} onCancel={() => setDeletingDoc(null)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
