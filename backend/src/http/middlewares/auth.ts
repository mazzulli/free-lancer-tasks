import type { FastifyRequest, FastifyReply } from 'fastify'

const PUBLIC_PATHS = ['/health']

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  if (PUBLIC_PATHS.includes(request.url)) return

  const apiKey = request.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.API_KEY) {
    reply.code(401).send({ error: 'Não autorizado. X-API-Key inválida.' })
  }
}
