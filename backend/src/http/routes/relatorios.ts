import type { FastifyInstance } from 'fastify'
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository.js'
import { PrismaProjetoRepository } from '../../infrastructure/repositories/PrismaProjetoRepository.js'
import { PrismaApontamentoRepository } from '../../infrastructure/repositories/PrismaApontamentoRepository.js'
import { GenerateReportUseCase } from '../../application/use-cases/reports/GenerateReportUseCase.js'
import { ListReportsUseCase } from '../../application/use-cases/reports/ListReportsUseCase.js'

export async function relatorioRoutes(app: FastifyInstance) {
  const clienteRepo = new PrismaClienteRepository()
  const projetoRepo = new PrismaProjetoRepository()
  const apontamentoRepo = new PrismaApontamentoRepository()
  const listUC = new ListReportsUseCase()

  app.get<{ Querystring: { clienteId?: string } }>('/', async (req) => {
    return listUC.execute(req.query.clienteId)
  })

  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try { return await listUC.findById(req.params.id) }
    catch (e: unknown) { reply.code(404).send({ error: (e as Error).message }) }
  })

  app.post<{ Body: { clienteId: string; mes: number; ano: number } }>('/generate', async (req, reply) => {
    try {
      return reply.code(201).send(
        await new GenerateReportUseCase(clienteRepo, projetoRepo, apontamentoRepo).execute(req.body)
      )
    }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })
}
