import type { FastifyInstance } from 'fastify'
import path from 'path'
import { randomUUID } from 'crypto'
import { PrismaTarefaRepository } from '../../infrastructure/repositories/PrismaTarefaRepository.js'
import { PrismaProjetoRepository } from '../../infrastructure/repositories/PrismaProjetoRepository.js'
import { CreateTarefaUseCase } from '../../application/use-cases/tasks/CreateTarefaUseCase.js'
import { UpdateTarefaUseCase } from '../../application/use-cases/tasks/UpdateTarefaUseCase.js'
import { ListTarefasUseCase } from '../../application/use-cases/tasks/ListTarefasUseCase.js'
import { GetTarefaUseCase } from '../../application/use-cases/tasks/GetTarefaUseCase.js'
import { DeleteTarefaUseCase } from '../../application/use-cases/tasks/DeleteTarefaUseCase.js'
import { uploadToR2, deleteFromR2 } from '../../infrastructure/storage/r2.js'

export async function tarefaRoutes(app: FastifyInstance) {
  const repo = new PrismaTarefaRepository()
  const projetoRepo = new PrismaProjetoRepository()

  app.get<{ Querystring: { projetoId?: string; status?: string; clienteId?: string } }>('/', async (req) => {
    return new ListTarefasUseCase(repo).execute(req.query as any)
  })

  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try { return await new GetTarefaUseCase(repo).execute(req.params.id) }
    catch (e: unknown) { reply.code(404).send({ error: (e as Error).message }) }
  })

  app.post<{ Body: Record<string, unknown> }>('/', async (req, reply) => {
    try { return reply.code(201).send(await new CreateTarefaUseCase(repo, projetoRepo).execute(req.body as any)) }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })

  app.put<{ Params: { id: string }; Body: Record<string, unknown> }>('/:id', async (req, reply) => {
    try { return await new UpdateTarefaUseCase(repo).execute({ id: req.params.id, ...(req.body as any) }) }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    try {
      const docs = await new DeleteTarefaUseCase(repo).execute(req.params.id)
      await Promise.allSettled(docs.map(d => deleteFromR2(d.caminho)))
      return reply.code(204).send()
    }
    catch (e: unknown) { reply.code(404).send({ error: (e as Error).message }) }
  })

  app.post<{ Params: { id: string } }>('/:id/documentos', async (req, reply) => {
    try {
      const data = await req.file()
      if (!data) return reply.code(400).send({ error: 'Nenhum arquivo enviado' })

      const ext = path.extname(data.filename)
      const key = `${req.params.id}/${randomUUID()}${ext}`

      const buffer = await data.toBuffer()
      const caminho = await uploadToR2(key, buffer, data.mimetype)

      const doc = await repo.addDocumento({
        id: randomUUID(),
        tarefaId: req.params.id,
        nome: data.filename,
        tipo: data.mimetype,
        caminho,
        tamanho: buffer.length,
      })

      return reply.code(201).send(doc)
    }
    catch (e: unknown) { reply.code(400).send({ error: (e as Error).message }) }
  })

  app.delete<{ Params: { id: string; docId: string } }>('/:id/documentos/:docId', async (req, reply) => {
    try {
      const doc = await repo.deleteDocumento(req.params.docId)
      await deleteFromR2(doc.caminho).catch(() => {})
      return reply.code(204).send()
    }
    catch (e: unknown) { reply.code(404).send({ error: (e as Error).message }) }
  })
}
