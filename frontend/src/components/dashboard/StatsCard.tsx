import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: 'cyan' | 'pink'
  sub?: string
}

export function StatsCard({ label, value, icon: Icon, accent = 'cyan', sub }: Props) {
  return (
    <div className="glass rounded-xl p-5 flex items-center gap-4">
      <div className={cn('p-3 rounded-xl shrink-0', accent === 'cyan' ? 'bg-neon-cyan/10' : 'bg-neon-pink/10')}>
        <Icon size={22} className={accent === 'cyan' ? 'text-neon-cyan' : 'text-neon-pink'} />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
