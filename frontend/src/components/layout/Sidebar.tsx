import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, FolderKanban, Columns, FileText, ChevronRight, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/projetos', label: 'Projetos', icon: FolderKanban },
  { to: '/kanban', label: 'Kanban', icon: Columns },
  { to: '/relatorios', label: 'Relatórios', icon: FileText },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <aside
      className={cn(
        // Base: fixed drawer (mobile-first), overlays content
        'fixed inset-y-0 left-0 z-50 flex flex-col w-64 glass border-r border-neon-cyan/20',
        'transition-transform duration-300 ease-in-out',
        // Mobile/tablet: slide in/out
        open ? 'translate-x-0' : '-translate-x-full',
        // Desktop (lg+): always visible, static in flow
        'lg:relative lg:translate-x-0 lg:z-auto',
      )}
    >
      {/* Header */}
      <div className="px-5 py-5 border-b border-neon-cyan/15 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold neon-text-cyan tracking-widest uppercase">Freelancer</h1>
          <p className="text-xs text-muted-foreground tracking-wider mt-0.5">Manager Board</p>
        </div>
        {/* Close button — only visible on mobile/tablet */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group',
                isActive
                  ? 'bg-neon-cyan/10 neon-text-cyan neon-border-cyan border'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={cn('shrink-0', isActive && 'drop-shadow-[0_0_6px_#00e5ff]')} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-6 py-4 border-t border-neon-cyan/15">
        <p className="text-xs text-muted-foreground">v1.0.0</p>
      </div>
    </aside>
  )
}
