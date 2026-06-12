import type { FastifyInstance } from 'fastify'
import { PrismaClienteRepository } from '../../infrastructure/repositories/PrismaClienteRepository.js'
import { CreateClienteUseCase } from '../../application/use-cases/clients/CreateClienteUseCase.js'
import { UpdateClienteUseCase } from '../../application/use-cases/clients/UpdateClienteUseCase.js'
import { ListClientesUseCase } from '../../application/use-cases/clients/ListClientesUseCase.js'
import { GetClienteUseCase } from '../../application/use-cases/clients/GetClienteUseCase.js'
import { DeleteClienteUseCase } from '../../application/use-cases/clients/DeleteClienteUseCase.js'

export async function clienteRoutes(app: FastifyInstance) {
  const repo = new PrismaClienteRepository()

  app.get('/', async () => {
    return new ListClientesUseCase(repo).execute()
  })

  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try { return await new GetClienteUseCase(repo).execute(req.params.id) }
    catch (e: unknown) { reply.code(404).send({ error: (e as Error).message }) }
  })

  app.post<{ Body: Record<string, unknown> }>('/', async (req, reply) => {
    try { return reply.code(201).send(await new CreateClienteUseCase(repo).execute(req.body as any)) }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })

  app.put<{ Params: { id: string }; Body: Record<string, unknown> }>('/:id', async (req, reply) => {
    try { return await new UpdateClienteUseCase(repo).execute({ id: req.params.id, ...(req.body as any) }) }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try { await new DeleteClienteUseCase(repo).execute(req.params.id); return reply.code(204).send() }
    catch (e: unknown) { reply.code(404).send({ error: (e as Error).message }) }
  })
}
