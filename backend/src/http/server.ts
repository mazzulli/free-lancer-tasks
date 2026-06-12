import 'dotenv/config'
import path from 'path'
import fs from 'fs/promises'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import { authMiddleware } from './middlewares/auth.js'
import { clienteRoutes } from './routes/clientes.js'
import { projetoRoutes } from './routes/projetos.js'
import { tarefaRoutes } from './routes/tarefas.js'
import { apontamentoRoutes } from './routes/apontamentos.js'
import { relatorioRoutes } from './routes/relatorios.js'
import { dashboardRoutes } from './routes/dashboard.js'

async function bootstrap() {
  const uploadDir = path.resolve(process.env.UPLOAD_DIR ?? '../storage/uploads')
  const storageDir = path.dirname(uploadDir)

  await fs.mkdir(storageDir, { recursive: true })
  await fs.mkdir(uploadDir, { recursive: true })

  const app = Fastify({ logger: true })

  await app.register(cors, { origin: true })
  await app.register(multipart, { limits: { fileSize: 20 * 1024 * 1024 } })
  await app.register(staticFiles, { root: uploadDir, prefix: '/uploads/' })

  app.addHook('preHandler', authMiddleware)

  app.get('/health', async () => ({ status: 'ok' }))

  await app.register(clienteRoutes, { prefix: '/api/clientes' })
  await app.register(projetoRoutes, { prefix: '/api/projetos' })
  await app.register(tarefaRoutes, { prefix: '/api/tarefas' })
  await app.register(apontamentoRoutes, { prefix: '/api/apontamentos' })
  await app.register(relatorioRoutes, { prefix: '/api/relatorios' })
  await app.register(dashboardRoutes, { prefix: '/api/dashboard' })

  const port = Number(process.env.PORT ?? 3001)
  await app.listen({ port, host: '0.0.0.0' })
  console.log(`Servidor rodando na porta ${port}`)
}

bootstrap().catch(err => {
  console.error(err)
  process.exit(1)
})
