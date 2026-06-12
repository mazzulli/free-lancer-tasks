import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './components/layout/Layout'
import { Dashboard } from './pages/Dashboard'
import { Clients } from './pages/Clients'
import { Projects } from './pages/Projects'
import { Kanban } from './pages/Kanban'
import { Reports } from './pages/Reports'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/clientes" element={<Clients />} />
            <Route path="/projetos" element={<Projects />} />
            <Route path="/kanban" element={<Kanban />} />
            <Route path="/relatorios" element={<Reports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
