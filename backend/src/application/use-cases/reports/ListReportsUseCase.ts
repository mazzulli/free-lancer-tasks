import { prisma } from '../../../infrastructure/database/prisma-client.js'

export class ListReportsUseCase {
  async execute(clienteId?: string) {
    return prisma.relatorio.findMany({
      where: clienteId ? { clienteId } : undefined,
      include: { cliente: { select: { id: true, nome: true, razaoSocial: true } } },
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
    })
  }

  async findById(id: string) {
    const r = await prisma.relatorio.findUnique({
      where: { id },
      include: { cliente: true },
    })
    if (!r) throw new Error('Relatório não encontrado')
    return { ...r, dados: JSON.parse(r.dados) }
  }
}
