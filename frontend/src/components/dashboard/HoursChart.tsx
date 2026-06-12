import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import { formatMonth } from '@/lib/formatters'

interface Props {
  data: Array<{ mes: number; ano: number; clientes: Array<{ nome: string; horas: number }> }>
}

const COLORS = ['#00e5ff', '#ff2d78', '#00ffcc', '#ff79a8', '#00b8d4']

export function HoursChart({ data }: Props) {
  const allClients = Array.from(new Set(data.flatMap(d => d.clientes.map(c => c.nome))))

  const chartData = data.map(d => {
    const entry: Record<string, string | number> = { periodo: formatMonth(d.mes, d.ano) }
    for (const c of d.clientes) entry[c.nome] = Math.round(c.horas * 100) / 100
    return entry
  })

  return (
    <div className="glass rounded-xl p-5">
      <p className="text-sm font-medium mb-4 neon-text-cyan">Horas por Cliente (últimos 3 meses)</p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="periodo" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: 'rgba(10,25,60,0.95)', border: '1px solid rgba(0,229,255,0.2)', borderRadius: 8, color: '#e0f7fa', fontSize: 12 }}
            cursor={{ fill: 'rgba(0,229,255,0.05)' }}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: '#6b7280' }} />
          {allClients.map((c, i) => (
            <Bar key={c} dataKey={c} fill={COLORS[i % COLORS.length]} radius={[3, 3, 0, 0]} maxBarSize={40} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
