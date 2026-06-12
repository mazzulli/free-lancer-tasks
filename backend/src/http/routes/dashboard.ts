import type { FastifyInstance } from 'fastify'
import { PrismaTarefaRepository } from '../../infrastructure/repositories/PrismaTarefaRepository.js'
import { PrismaProjetoRepository } from '../../infrastructure/repositories/PrismaProjetoRepository.js'
import { GetDashboardUseCase } from '../../application/use-cases/dashboard/GetDashboardUseCase.js'

export async function dashboardRoutes(app: FastifyInstance) {
  const tarefaRepo = new PrismaTarefaRepository()
  const projetoRepo = new PrismaProjetoRepository()

  app.get('/', async () => {
    return new GetDashboardUseCase(tarefaRepo, projetoRepo).execute()
  })
}
