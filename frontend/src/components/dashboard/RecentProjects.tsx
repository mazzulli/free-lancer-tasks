import { useNavigate } from 'react-router-dom'
import { FolderKanban, ArrowRight } from 'lucide-react'
import type { Projeto } from '@/types'
import { formatCurrency } from '@/lib/formatters'

interface Props { projects: Projeto[] }

export function RecentProjects({ projects }: Props) {
  const navigate = useNavigate()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium neon-text-cyan">Projetos Recentes</p>
        <button onClick={() => navigate('/projetos')} className="text-xs text-muted-foreground hover:text-neon-cyan flex items-center gap-1 transition-colors">
          Ver todos <ArrowRight size={12} />
        </button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => (
          <button
            key={p.id}
            onClick={() => navigate(`/kanban?projeto=${p.id}`)}
            className="glass rounded-xl p-4 text-left hover:neon-border-pink transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-neon-pink/10 group-hover:bg-neon-pink/20 transition-colors">
                <FolderKanban size={16} className="text-neon-pink" />
              </div>
              <span className="text-xs text-muted-foreground truncate">{p.cliente.nome}</span>
            </div>
            <p className="font-medium text-sm truncate">{p.titulo}</p>
            <p className="text-xs neon-text-pink mt-1">{formatCurrency(p.valorHora)}/h</p>
          </button>
        ))}
      </div>
    </div>
  )
}
