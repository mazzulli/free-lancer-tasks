import axios from 'axios'
import type { Cliente, Projeto, Tarefa, Apontamento, Relatorio, DashboardData } from '@/types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  headers: { 'X-API-Key': import.meta.env.VITE_API_KEY ?? '' },
})

api.interceptors.response.use(
  r => r,
  err => {
    const msg = err.response?.data?.error ?? err.message ?? 'Erro desconhecido'
    return Promise.reject(new Error(msg))
  }
)

// Clientes
export const clienteApi = {
  list: () => api.get<Cliente[]>('/api/clientes').then(r => r.data),
  get: (id: string) => api.get<Cliente>(`/api/clientes/${id}`).then(r => r.data),
  create: (data: Partial<Cliente>) => api.post<Cliente>('/api/clientes', data).then(r => r.data),
  update: (id: string, data: Partial<Cliente>) => api.put<Cliente>(`/api/clientes/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/api/clientes/${id}`),
}

// Projetos
export const projetoApi = {
  list: (clienteId?: string) => api.get<Projeto[]>('/api/projetos', { params: { clienteId } }).then(r => r.data),
  get: (id: string) => api.get<Projeto>(`/api/projetos/${id}`).then(r => r.data),
  create: (data: Partial<Projeto>) => api.post<Projeto>('/api/projetos', data).then(r => r.data),
  update: (id: string, data: Partial<Projeto>) => api.put<Projeto>(`/api/projetos/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/api/projetos/${id}`),
}

// Tarefas
export const tarefaApi = {
  list: (filters?: { projetoId?: string; status?: string; clienteId?: string }) =>
    api.get<Tarefa[]>('/api/tarefas', { params: filters }).then(r => r.data),
  get: (id: string) => api.get<Tarefa>(`/api/tarefas/${id}`).then(r => r.data),
  create: (data: Partial<Tarefa>) => api.post<Tarefa>('/api/tarefas', data).then(r => r.data),
  update: (id: string, data: Partial<Tarefa>) => api.put<Tarefa>(`/api/tarefas/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/api/tarefas/${id}`),
  uploadDoc: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/api/tarefas/${id}/documentos`, form, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data)
  },
  deleteDoc: (id: string, docId: string) => api.delete(`/api/tarefas/${id}/documentos/${docId}`),
}

// Apontamentos
export const apontamentoApi = {
  create: (data: Partial<Apontamento>) => api.post<Apontamento>('/api/apontamentos', data).then(r => r.data),
  update: (id: string, data: Partial<Apontamento>) => api.put<Apontamento>(`/api/apontamentos/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/api/apontamentos/${id}`),
}

// Relatórios
export const relatorioApi = {
  list: (clienteId?: string) => api.get<Relatorio[]>('/api/relatorios', { params: { clienteId } }).then(r => r.data),
  get: (id: string) => api.get<Relatorio>(`/api/relatorios/${id}`).then(r => r.data),
  generate: (data: { clienteId: string; mes: number; ano: number }) =>
    api.post<Relatorio>('/api/relatorios/generate', data).then(r => r.data),
}

// Dashboard
export const dashboardApi = {
  get: () => api.get<DashboardData>('/api/dashboard').then(r => r.data),
}

export default api
