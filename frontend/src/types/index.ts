export type TarefaStatus = 'NOVA' | 'EM_ANDAMENTO' | 'PRONTA' | 'FECHADA'

export interface Cliente {
  id: string
  nome: string
  razaoSocial: string
  email: string
  cnpj: string
  cep?: string | null
  endereco?: string | null
  numero?: string | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  createdAt: string
  updatedAt: string
}

export interface Projeto {
  id: string
  clienteId: string
  titulo: string
  descricao?: string | null
  valorHora: number
  createdAt: string
  updatedAt: string
  cliente: { id: string; nome: string; razaoSocial: string }
}

export interface Apontamento {
  id: string
  tarefaId: string
  data: string
  horaIni: string
  horaFim: string
  totalHoras: number
  createdAt: string
  updatedAt: string
}

export interface Documento {
  id: string
  tarefaId: string
  nome: string
  tipo: string
  caminho: string
  tamanho: number
  createdAt: string
}

export interface Tarefa {
  id: string
  projetoId: string
  titulo: string
  descricao?: string | null
  status: TarefaStatus
  createdAt: string
  updatedAt: string
  apontamentos: Apontamento[]
  documentos: Documento[]
  projeto: { id: string; titulo: string; valorHora: number; cliente: { id: string; nome: string } }
}

export interface RelatorioProjeto {
  projetoId: string
  titulo: string
  valorHora: number
  totalHorasProjeto: number
  valorTotalProjeto: number
  tarefas: Array<{
    tarefaId: string
    titulo: string
    totalHoras: number
    apontamentos: Array<{ data: string; horaIni: string; horaFim: string; totalHoras: number }>
  }>
}

export interface RelatorioDados {
  cliente: Cliente
  periodo: { mes: number; ano: number }
  projetos: RelatorioProjeto[]
  totalHorasGeral: number
  valorTotalGeral: number
}

export interface Relatorio {
  id: string
  clienteId: string
  mes: number
  ano: number
  dados: RelatorioDados
  totalHoras: number
  valorTotal: number
  createdAt: string
  cliente: { id: string; nome: string; razaoSocial: string }
}

export interface DashboardData {
  countsByStatus: Record<TarefaStatus, number>
  recentProjects: Projeto[]
  topClientes: Array<{ id: string; nome: string; totalHoras: number }>
  horasPorClienteMes: Array<{
    mes: number
    ano: number
    clientes: Array<{ nome: string; horas: number }>
  }>
}
