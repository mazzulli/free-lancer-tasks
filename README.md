# Freelancer Manager Board

Sistema de controle de horas trabalhadas em tarefas freelancer, com geração de relatórios mensais por cliente para suporte à emissão de notas fiscais.

## Funcionalidades

- **Dashboard** — visão geral com contagem de tarefas por status, gráfico de horas por cliente, top clientes e acesso rápido a projetos recentes
- **Cadastro de Clientes** — dados completos conforme Cartão CNPJ, busca de endereço pelo CEP via ViaCEP
- **Cadastro de Projetos** — valor por hora atrelado ao projeto, descrição em Markdown
- **Kanban** — quadro com drag-and-drop por status (Nova, Em Andamento, Pronta, Fechada), filtros por cliente/projeto
- **Tarefas** — múltiplos apontamentos de horas por tarefa, upload de documentos (PDF e imagens)
- **Relatórios** — fechamento mensal por cliente com memória de cálculo detalhada por projeto e impressão

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js 22 + Fastify 5 + Prisma 6 |
| Banco de Dados | PostgreSQL (Neon — serverless, região `sa-east-1`) |
| Armazenamento de Arquivos | Cloudflare R2 (S3-compatible) |
| Frontend | React + Vite + TypeScript + Tailwind + shadcn/ui |
| Hospedagem | Render.com (containers Docker) |

## Pré-requisitos (desenvolvimento local)

- Node.js 20+
- npm 10+
- Banco PostgreSQL acessível (ex: instância Neon) ou local via Docker
- Bucket R2 na Cloudflare

## Configuração

### Backend — `backend/.env`

```env
# PostgreSQL (Neon usa URL com pooler para a app e URL direta para migrações)
DATABASE_URL="postgresql://user:password@host-pooler.region.aws.neon.tech/dbname?sslmode=require&channel_binding=require"
DIRECT_URL="postgresql://user:password@host.region.aws.neon.tech/dbname?sslmode=require"

# Autenticação da API
API_KEY="sua-chave-secreta-aqui"

# Porta do servidor
PORT=3001

# Cloudflare R2
R2_ACCOUNT_ID=seu_account_id
R2_ACCESS_KEY_ID=sua_access_key_id
R2_SECRET_ACCESS_KEY=sua_secret_access_key
R2_BUCKET_NAME=nome-do-bucket
R2_PUBLIC_URL=https://pub-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.r2.dev
R2_TOKEN=seu_r2_token
```

> `DATABASE_URL` aponta para o endpoint com pooling de conexões (usado em runtime).  
> `DIRECT_URL` aponta para o endpoint direto (usado pelo Prisma Migrate em deploys).

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:3001
VITE_API_KEY=sua-chave-secreta-aqui
```

Em produção, `VITE_API_URL` deve apontar para a URL do serviço de backend no Render.

## Instalação (desenvolvimento)

```bash
# Backend
cd backend
npm install
npm run db:migrate   # cria/atualiza tabelas no PostgreSQL

# Frontend
cd ../frontend
npm install
```

## Executando o Projeto

```bash
# Terminal 1 — Backend
cd backend && npm run dev   # http://localhost:3001

# Terminal 2 — Frontend
cd frontend && npm run dev  # http://localhost:5173
```

## Testes (Backend)

```bash
cd backend && npm test
```

Cobertura: validadores de domínio (CNPJ, CEP, e-mail), criação/reconstituição de entidades, regras de duplicidade.

## Deploy — Render.com

Cada serviço é deployado como um container Docker independente no Render.

### Backend

- **Dockerfile**: `backend/Dockerfile`
- **Build**: compila TypeScript, gera Prisma Client
- **Start**: executa `prisma migrate deploy` e inicia o servidor Node.js
- **Porta exposta**: `8000`
- **Variáveis de ambiente**: configurar no painel do Render com os mesmos valores do `backend/.env`

### Frontend

- **Dockerfile**: `frontend/Dockerfile`
- **Build**: gera bundle estático via Vite; as variáveis `VITE_API_KEY` e `VITE_API_URL` são passadas como `ARG` em tempo de build
- **Servidor**: Nginx na porta `80`
- **Variáveis de ambiente**: definir como Build Args no Render (`VITE_API_URL` com a URL do serviço backend)

### Comandos úteis de banco em produção

```bash
# Dentro do container backend (ou via Render Shell):
npx prisma migrate deploy   # aplica migrações pendentes
npx prisma studio           # interface visual (apenas dev)
```

## Estrutura do Projeto

```
├── backend/                # API Node.js + Fastify + Prisma
│   ├── prisma/             # Schema e migrações do banco
│   ├── src/
│   │   ├── domain/         # Entidades, validadores, interfaces
│   │   ├── application/    # Casos de uso (business logic)
│   │   ├── infrastructure/ # Implementações Prisma + R2
│   │   └── http/           # Rotas Fastify e servidor
│   ├── tests/              # Testes unitários (Vitest)
│   └── Dockerfile
├── frontend/               # React + Vite + TypeScript
│   └── src/
│       ├── components/     # Componentes reutilizáveis
│       ├── pages/          # Páginas da aplicação
│       ├── services/       # Chamadas à API
│       ├── types/          # Tipos TypeScript
│       ├── lib/            # Utilitários e formatadores BR
│       └── hooks/          # Hooks customizados
│   └── Dockerfile
```

## API

Todas as rotas exigem o header `X-API-Key` com a chave configurada no `.env`.

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/clientes | Listar clientes |
| POST | /api/clientes | Criar cliente |
| PUT | /api/clientes/:id | Atualizar cliente |
| DELETE | /api/clientes/:id | Excluir cliente |
| GET | /api/projetos | Listar projetos |
| POST | /api/projetos | Criar projeto |
| GET | /api/tarefas | Listar tarefas |
| POST | /api/tarefas | Criar tarefa |
| POST | /api/tarefas/:id/documentos | Upload de documento (armazenado no R2) |
| POST | /api/apontamentos | Registrar horas |
| POST | /api/relatorios/generate | Gerar relatório mensal |
| GET | /api/dashboard | Dados do dashboard |

## Regras de Negócio

- CNPJ e e-mail são únicos por cliente
- Valor por hora é por projeto, não por cliente
- CEP preenchido automaticamente via ViaCEP
- Múltiplos apontamentos por tarefa (data + hora início/fim)
- Relatório calcula: `total_horas × valor_hora_do_projeto`
- Documentos enviados para o bucket R2; URL pública retornada pela API
