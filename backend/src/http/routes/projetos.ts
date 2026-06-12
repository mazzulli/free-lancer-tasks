import type { FastifyInstance } from 'fastify'
import { PrismaProjetoRepository } from '../../infrastructure/repositories/PrismaProjetoRepository.js'
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository.js'
import { CreateProjetoUseCase } from '../../application/use-cases/projects/CreateProjetoUseCase.js'
import { UpdateProjetoUseCase } from '../../application/use-cases/projects/UpdateProjetoUseCase.js'
import { ListProjetosUseCase } from '../../application/use-cases/projects/ListProjetosUseCase.js'
import { GetProjetoUseCase } from '../../application/use-cases/projects/GetProjetoUseCase.js'
import { DeleteProjetoUseCase } from '../../application/use-cases/projects/DeleteProjetoUseCase.js'

export async function projetoRoutes(app: FastifyInstance) {
  const repo = new PrismaProjetoRepository()
  const clienteRepo = new PrismaClienteRepository()

  app.get<{ Querystring: { clienteId?: string } }>('/', async (req) => {
    return new ListProjetosUseCase(repo).execute(req.query.clienteId)
  })

  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try { return await new GetProjetoUseCase(repo).execute(req.params.id) }
    catch (e: unknown) { reply.code(404).send({ error: (e as Error).message }) }
  })

  app.post<{ Body: Record<string, unknown> }>('/', async (req, reply) => {
    try { return reply.code(201).send(await new CreateProjetoUseCase(repo, clienteRepo).execute(req.body as any)) }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })

  app.put<{ Params: { id: string }; Body: Record<string, unknown> }>('/:id', async (req, reply) => {
    try { return await new UpdateProjetoUseCase(repo).execute({ id: req.params.id, ...(req.body as any) }) }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try { await new DeleteProjetoUseCase(repo).execute(req.params.id); return reply.code(204).send() }
    catch (e: unknown) { reply.code(404).send({ error: (e as Error).message }) }
  })
}
