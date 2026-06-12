import { useQuery } from '@tanstack/react-query'
import { Users, FolderKanban, CheckCircle, Clock, ListTodo, Zap } from 'lucide-react'
import { dashboardApi } from '@/services/api'
import { formatHours } from '@/lib/formatters'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { HoursChart } from '@/components/dashboard/HoursChart'
import { RecentProjects } from '@/components/dashboard/RecentProjects'

export function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['dashboard'], queryFn: dashboardApi.get })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60">
        <div className="animate-pulse-neon neon-text-cyan text-sm">Carregando dashboard...</div>
      </div>
    )
  }

  if (!data) return null

  const { countsByStatus, recentProjects, topClientes, horasPorClienteMes } = data
  const totalTarefas = Object.values(countsByStatus).reduce((s, v) => s + v, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold neon-text-cyan">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral do seu trabalho freelancer</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="Total de Tarefas" value={totalTarefas} icon={ListTodo} accent="cyan" />
        <StatsCard label="Em Andamento" value={countsByStatus.EM_ANDAMENTO} icon={Zap} accent="pink" />
        <StatsCard label="Prontas" value={countsByStatus.PRONTA} icon={CheckCircle} accent="cyan" />
        <StatsCard label="Fechadas" value={countsByStatus.FECHADA} icon={Clock} accent="pink" />
      </div>

      {/* Status breakdown */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Novas', val: countsByStatus.NOVA, color: 'bg-blue-400' },
          { label: 'Em Andamento', val: countsByStatus.EM_ANDAMENTO, color: 'bg-yellow-400' },
          { label: 'Prontas', val: countsByStatus.PRONTA, color: 'bg-neon-cyan' },
          { label: 'Fechadas', val: countsByStatus.FECHADA, color: 'bg-neon-pink' },
        ].map(({ label, val, color }) => {
          const pct = totalTarefas ? Math.round((val / totalTarefas) * 100) : 0
          return (
            <div key={label} className="glass rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <p className="text-2xl font-bold">{val}</p>
              <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
                <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">{pct}%</p>
            </div>
          )
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart */}
        <div className="lg:col-span-2">
          <HoursChart data={horasPorClienteMes} />
        </div>

        {/* Top Clientes */}
        <div className="glass rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users size={16} className="text-neon-pink" />
            <p className="text-sm font-medium">Top Clientes</p>
          </div>
          <div className="space-y-3">
            {topClientes.length === 0 && <p className="text-xs text-muted-foreground">Sem dados ainda.</p>}
            {topClientes.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <span className="text-xs font-mono text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{c.nome}</p>
                  <div className="h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-neon-pink rounded-full" style={{ width: `${topClientes[0] ? (c.totalHoras / topClientes[0].totalHoras) * 100 : 0}%` }} />
                  </div>
                </div>
                <span className="text-xs neon-text-pink shrink-0">{formatHours(c.totalHoras)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div className="glass rounded-xl p-5">
          <RecentProjects projects={recentProjects} />
        </div>
      )}
    </div>
  )
}
