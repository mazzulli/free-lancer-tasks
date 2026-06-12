import type { FastifyInstance } from 'fastify'
import { PrismaApontamentoRepository } from '../../infrastructure/repositories/PrismaApontamentoRepository.js'
import { PrismaTarefaRepository } from '../../infrastructure/repositories/PrismaTarefaRepository.js'
import { CreateApontamentoUseCase } from '../../application/use-cases/time-entries/CreateApontamentoUseCase.js'
import { UpdateApontamentoUseCase } from '../../application/use-cases/time-entries/UpdateApontamentoUseCase.js'
import { DeleteApontamentoUseCase } from '../../application/use-cases/time-entries/DeleteApontamentoUseCase.js'

export async function apontamentoRoutes(app: FastifyInstance) {
  const repo = new PrismaApontamentoRepository()
  const tarefaRepo = new PrismaTarefaRepository()

  app.post<{ Body: Record<string, unknown> }>('/', async (req, reply) => {
    try { return reply.code(201).send(await new CreateApontamentoUseCase(repo, tarefaRepo).execute(req.body as any)) }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })

  app.put<{ Params: { id: string }; Body: Record<string, unknown> }>('/:id', async (req, reply) => {
    try { return await new UpdateApontamentoUseCase(repo).execute({ id: req.params.id, ...(req.body as any) }) }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try { await new DeleteApontamentoUseCase(repo).execute(req.params.id); return reply.code(204).send() }
    catch (e: unknown) { reply.code(404).send({ error: (e as Error).message }) }
  })
}
