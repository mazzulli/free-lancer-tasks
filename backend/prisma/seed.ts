import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  await prisma.apontamento.deleteMany()
  await prisma.documento.deleteMany()
  await prisma.tarefa.deleteMany()
  await prisma.relatorio.deleteMany()
  await prisma.projeto.deleteMany()
  await prisma.cliente.deleteMany()
  console.log('🗑️  Dados anteriores removidos')

  // ── CLIENTES ─────────────────────────────────────────────────────────────

  const [techSolutions, agenciaPlus, constRapida, clinicaVida, startupHub] =
    await Promise.all([
      prisma.cliente.create({
        data: {
          nome: 'TechSolutions',
          razaoSocial: 'TechSolutions Sistemas Ltda',
          email: 'contato@techsolutions.com.br',
          cnpj: '12.345.678/0001-95',
          cep: '01310-100',
          endereco: 'Av. Paulista',
          numero: '1000',
          bairro: 'Bela Vista',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      }),
      prisma.cliente.create({
        data: {
          nome: 'Agência Digital Plus',
          razaoSocial: 'Agência Digital Plus Comunicação Ltda',
          email: 'projetos@agenciadigitalplus.com.br',
          cnpj: '23.456.789/0001-09',
          cep: '20040-020',
          endereco: 'Av. Rio Branco',
          numero: '156',
          bairro: 'Centro',
          cidade: 'Rio de Janeiro',
          estado: 'RJ',
        },
      }),
      prisma.cliente.create({
        data: {
          nome: 'Construtora Rápida',
          razaoSocial: 'Construtora Rápida Engenharia S.A.',
          email: 'ti@construtorarapida.com.br',
          cnpj: '34.567.890/0001-18',
          cep: '30130-110',
          endereco: 'Av. Afonso Pena',
          numero: '3500',
          bairro: 'Centro',
          cidade: 'Belo Horizonte',
          estado: 'MG',
        },
      }),
      prisma.cliente.create({
        data: {
          nome: 'Clínica Vida e Saúde',
          razaoSocial: 'Clínica Vida e Saúde Ltda',
          email: 'sistemas@clinicavidasaude.com.br',
          cnpj: '45.678.901/0001-27',
          cep: '90040-060',
          endereco: 'Av. Ipiranga',
          numero: '780',
          bairro: 'Azenha',
          cidade: 'Porto Alegre',
          estado: 'RS',
        },
      }),
      prisma.cliente.create({
        data: {
          nome: 'StartupHub Brasil',
          razaoSocial: 'StartupHub Brasil Aceleradora Ltda',
          email: 'dev@startuphub.com.br',
          cnpj: '56.789.012/0001-36',
          cep: '04543-907',
          endereco: 'Av. Brigadeiro Faria Lima',
          numero: '4300',
          complemento: 'Sala 1102',
          bairro: 'Itaim Bibi',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      }),
    ])

  console.log('✅ 5 clientes criados')

  // ── PROJETOS ─────────────────────────────────────────────────────────────

  const [
    websiteInst,
    appMobile,
    campanhaSocial,
    redesignPortal,
    sistemaObras,
    appAcomp,
    prontuario,
    portalPaciente,
    plataformaSaas,
    landingPage,
  ] = await Promise.all([
    prisma.projeto.create({
      data: {
        clienteId: techSolutions.id,
        titulo: 'Website Institucional 2026',
        descricao: 'Redesign completo do site institucional com novo branding e CMS headless.',
        valorHora: 150,
      },
    }),
    prisma.projeto.create({
      data: {
        clienteId: techSolutions.id,
        titulo: 'App Mobile iOS/Android',
        descricao: 'Desenvolvimento de app híbrido em React Native para gestão interna.',
        valorHora: 180,
      },
    }),
    prisma.projeto.create({
      data: {
        clienteId: agenciaPlus.id,
        titulo: 'Campanha Social Media Q2 2026',
        descricao: 'Criação e agendamento de conteúdo para Instagram, LinkedIn e YouTube.',
        valorHora: 120,
      },
    }),
    prisma.projeto.create({
      data: {
        clienteId: agenciaPlus.id,
        titulo: 'Redesign Portal Corporativo',
        descricao: 'Reestruturação completa do portal com novo design system e performance.',
        valorHora: 140,
      },
    }),
    prisma.projeto.create({
      data: {
        clienteId: constRapida.id,
        titulo: 'Sistema de Gestão de Obras v2',
        descricao: 'Nova versão do sistema ERP interno com módulo de cronograma e relatórios.',
        valorHora: 160,
      },
    }),
    prisma.projeto.create({
      data: {
        clienteId: constRapida.id,
        titulo: 'App de Acompanhamento de Obras',
        descricao: 'App para engenheiros e mestres de obra registrarem avanço em campo.',
        valorHora: 170,
      },
    }),
    prisma.projeto.create({
      data: {
        clienteId: clinicaVida.id,
        titulo: 'Prontuário Eletrônico Digital',
        descricao: 'Sistema de prontuário digital integrado com TISS e CFM.',
        valorHora: 200,
      },
    }),
    prisma.projeto.create({
      data: {
        clienteId: clinicaVida.id,
        titulo: 'Portal do Paciente Online',
        descricao: 'Portal web para agendamento, exames e comunicação com médicos.',
        valorHora: 190,
      },
    }),
    prisma.projeto.create({
      data: {
        clienteId: startupHub.id,
        titulo: 'Plataforma SaaS MVP',
        descricao: 'MVP da plataforma de gestão de startups com dashboard e pipeline de captação.',
        valorHora: 220,
      },
    }),
    prisma.projeto.create({
      data: {
        clienteId: startupHub.id,
        titulo: 'Landing Page de Captação',
        descricao: 'Landing page otimizada para conversão com A/B testing e analytics.',
        valorHora: 130,
      },
    }),
  ])

  console.log('✅ 10 projetos criados')

  // ── TAREFAS ───────────────────────────────────────────────────────────────

  const tarefas = await Promise.all([
    // Website Institucional
    prisma.tarefa.create({ data: { projetoId: websiteInst.id, titulo: 'Levantamento de requisitos e briefing', descricao: 'Reunião com stakeholders para definir escopo, personas e objetivos do site.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: websiteInst.id, titulo: 'Criação de wireframes e protótipo', descricao: 'Wireframes de todas as páginas no Figma com fluxo de navegação.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: websiteInst.id, titulo: 'Desenvolvimento frontend Next.js', descricao: 'Implementação das páginas com componentes reutilizáveis e animações.', status: 'EM_ANDAMENTO' } }),
    prisma.tarefa.create({ data: { projetoId: websiteInst.id, titulo: 'Integração CMS Headless (Contentful)', descricao: 'Configurar Contentful, modelar conteúdo e integrar com o frontend.', status: 'NOVA' } }),

    // App Mobile
    prisma.tarefa.create({ data: { projetoId: appMobile.id, titulo: 'Setup do projeto React Native + Expo', descricao: 'Configuração do ambiente, navegação, tema e bibliotecas base.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: appMobile.id, titulo: 'Módulo de autenticação (JWT)', descricao: 'Telas de login, recuperação de senha e refresh token seguro.', status: 'EM_ANDAMENTO' } }),
    prisma.tarefa.create({ data: { projetoId: appMobile.id, titulo: 'Dashboard e relatórios', descricao: 'Tela principal com gráficos de KPIs e exportação PDF.', status: 'NOVA' } }),

    // Campanha Social Media
    prisma.tarefa.create({ data: { projetoId: campanhaSocial.id, titulo: 'Calendário editorial maio/junho', descricao: 'Planejamento de 30 posts por mês com temas, formatos e horários.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: campanhaSocial.id, titulo: 'Produção de artes gráficas', descricao: 'Design de 60 cards e 10 reels no padrão do novo branding.', status: 'EM_ANDAMENTO' } }),
    prisma.tarefa.create({ data: { projetoId: campanhaSocial.id, titulo: 'Relatório de métricas Q2', descricao: 'Compilar alcance, engajamento e conversões no período.', status: 'NOVA' } }),

    // Redesign Portal
    prisma.tarefa.create({ data: { projetoId: redesignPortal.id, titulo: 'Auditoria de UX e heatmaps', descricao: 'Análise do portal atual com Hotjar e entrevistas com usuários.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: redesignPortal.id, titulo: 'Design system e componentes', descricao: 'Criar design system no Figma com tokens de cor, tipografia e componentes.', status: 'EM_REVISAO' } }),
    prisma.tarefa.create({ data: { projetoId: redesignPortal.id, titulo: 'Desenvolvimento e migração de conteúdo', descricao: 'Implementar novo layout e migrar 200+ páginas de conteúdo.', status: 'NOVA' } }),

    // Sistema de Obras
    prisma.tarefa.create({ data: { projetoId: sistemaObras.id, titulo: 'Modelagem do banco de dados v2', descricao: 'Novo modelo relacional com suporte a múltiplas obras e usuários.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: sistemaObras.id, titulo: 'API REST de cronogramas', descricao: 'Endpoints para criação e atualização de cronograma em Gantt.', status: 'EM_ANDAMENTO' } }),
    prisma.tarefa.create({ data: { projetoId: sistemaObras.id, titulo: 'Módulo de relatórios PDF', descricao: 'Geração automática de relatórios de progresso e financeiro.', status: 'NOVA' } }),

    // App Acompanhamento
    prisma.tarefa.create({ data: { projetoId: appAcomp.id, titulo: 'Protótipo e validação com usuários', descricao: 'Protótipo navegável e sessões de teste com 5 engenheiros de campo.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: appAcomp.id, titulo: 'Módulo de checklist de inspeção', descricao: 'Checklists customizáveis com fotos, assinaturas e geolocalização.', status: 'EM_ANDAMENTO' } }),
    prisma.tarefa.create({ data: { projetoId: appAcomp.id, titulo: 'Sincronização offline-first', descricao: 'Implementar cache local com WatermelonDB e sync ao reconectar.', status: 'NOVA' } }),

    // Prontuário
    prisma.tarefa.create({ data: { projetoId: prontuario.id, titulo: 'Arquitetura e compliance LGPD', descricao: 'Definir arquitetura segura com criptografia em repouso e em trânsito.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: prontuario.id, titulo: 'CRUD de pacientes e histórico', descricao: 'Módulo completo de cadastro de pacientes com histórico clínico.', status: 'EM_ANDAMENTO' } }),
    prisma.tarefa.create({ data: { projetoId: prontuario.id, titulo: 'Integração TISS/XML', descricao: 'Envio e recebimento de guias TISS para operadoras de plano de saúde.', status: 'NOVA' } }),

    // Portal Paciente
    prisma.tarefa.create({ data: { projetoId: portalPaciente.id, titulo: 'Autenticação e perfil do paciente', descricao: 'Login com CPF + OTP via SMS, edição de dados e foto.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: portalPaciente.id, titulo: 'Agendamento de consultas online', descricao: 'Agenda integrada com Google Calendar e confirmação automática.', status: 'EM_REVISAO' } }),
    prisma.tarefa.create({ data: { projetoId: portalPaciente.id, titulo: 'Visualização de exames e laudos', descricao: 'Download seguro de PDFs e visualização de imagens DICOM.', status: 'NOVA' } }),

    // Plataforma SaaS
    prisma.tarefa.create({ data: { projetoId: plataformaSaas.id, titulo: 'Setup infra AWS + CI/CD', descricao: 'ECS Fargate, RDS, S3, CloudFront e pipeline no GitHub Actions.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: plataformaSaas.id, titulo: 'Multi-tenancy e planos de assinatura', descricao: 'Isolamento por tenant, planos Free/Pro/Enterprise e integração Stripe.', status: 'EM_ANDAMENTO' } }),
    prisma.tarefa.create({ data: { projetoId: plataformaSaas.id, titulo: 'Dashboard de métricas e funil', descricao: 'Painel de KPIs com gráficos de MRR, churn e pipeline de startups.', status: 'NOVA' } }),

    // Landing Page
    prisma.tarefa.create({ data: { projetoId: landingPage.id, titulo: 'Copywriting e estratégia de conversão', descricao: 'Definir proposta de valor, headline, CTAs e estrutura da página.', status: 'CONCLUIDA' } }),
    prisma.tarefa.create({ data: { projetoId: landingPage.id, titulo: 'Desenvolvimento e animações', descricao: 'Implementação com Astro + TailwindCSS e animações com Framer Motion.', status: 'EM_ANDAMENTO' } }),
    prisma.tarefa.create({ data: { projetoId: landingPage.id, titulo: 'Configuração de A/B testing', descricao: 'Setup de testes A/B no Vercel com 2 variantes e tracking de conversão.', status: 'NOVA' } }),
  ])

  console.log(`✅ ${tarefas.length} tarefas criadas`)

  // ── APONTAMENTOS (para tarefas CONCLUÍDAS e EM_ANDAMENTO) ──────────────────

  const tarefasConcluidas = tarefas.filter(t => t.status === 'CONCLUIDA')
  const tarefasAndamento = tarefas.filter(t => t.status === 'EM_ANDAMENTO')

  const apontamentosData = [
    ...tarefasConcluidas.flatMap(t => [
      { tarefaId: t.id, data: new Date('2026-05-05'), horaIni: '09:00', horaFim: '12:00', totalHoras: 3 },
      { tarefaId: t.id, data: new Date('2026-05-06'), horaIni: '14:00', horaFim: '18:00', totalHoras: 4 },
      { tarefaId: t.id, data: new Date('2026-05-07'), horaIni: '10:00', horaFim: '12:30', totalHoras: 2.5 },
    ]),
    ...tarefasAndamento.flatMap(t => [
      { tarefaId: t.id, data: new Date('2026-06-09'), horaIni: '09:00', horaFim: '13:00', totalHoras: 4 },
      { tarefaId: t.id, data: new Date('2026-06-10'), horaIni: '14:00', horaFim: '17:00', totalHoras: 3 },
    ]),
  ]

  await prisma.apontamento.createMany({ data: apontamentosData })
  console.log(`✅ ${apontamentosData.length} apontamentos criados`)

  const totalHoras = apontamentosData.reduce((acc, a) => acc + a.totalHoras, 0)
  console.log(`\n🎉 Seed concluído! ${tarefas.length} tarefas | ${apontamentosData.length} apontamentos | ${totalHoras}h registradas`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
