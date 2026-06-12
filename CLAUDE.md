# Freelancer Manager Board — Memória do Projeto

## Visão Geral

Sistema single-user de controle de horas freelancer. Sem login (autenticação via X-API-Key). Backend Fastify + Prisma + SQLite. Frontend React + Vite + Tailwind + shadcn/ui.

## Arquitetura Backend

**Clean Architecture** com 4 camadas:

1. `domain/` — pura lógica de negócio, zero dependências externas
   - `entities/`: classes com static factory methods (`create`, `reconstitute`)
   - `repositories/`: interfaces (contratos) sem implementação
   - `validators/`: funções puras de validação (CNPJ, CEP, email)

2. `application/use-cases/` — orquestração de regras de negócio
   - Cada use case recebe repositórios via constructor (DI)
   - Método `execute()` como ponto de entrada

3. `infrastructure/` — implementações concretas
   - `PrismaClienteRepository`, `PrismaProjetoRepository`, etc.
   - `prisma-client.ts`: singleton do PrismaClient

4. `http/` — Fastify routes + middlewares
   - Cada route file instancia repositórios e use cases diretamente
   - Auth via `preHandler` hook global (`X-API-Key`)

## Banco de Dados

- SQLite em `../storage/database.db` (relativo ao diretório `backend/`)
- Migrações via `npm run db:migrate` (Prisma v6)
- Entidades: `Cliente`, `Projeto`, `Tarefa`, `Apontamento`, `Documento`, `Relatorio`
- Todos os IDs são UUIDs (`crypto.randomUUID()`)
- `Relatorio.dados` armazena JSON serializado com a memória de cálculo completa

## Storage

- **Nunca modifique a pasta `storage/` manualmente** — é dados de usuário em runtime
- Uploads: `../storage/uploads/{tarefaId}/{uuid}.ext`
- O servidor cria a pasta `storage/` automaticamente na inicialização

## Autenticação

- Header: `X-API-Key` com valor definido em `backend/.env` → `API_KEY`
- Frontend lê de `frontend/.env` → `VITE_API_KEY`
- Middleware em `src/http/middlewares/auth.ts` — aplicado globalmente via `app.addHook('preHandler', ...)`

## Frontend

### Tema Visual
- Fundo: `#050d1a` (azul muito escuro)
- Neon primário: `#00e5ff` (cyan)
- Neon secundário: `#ff2d78` (pink)
- Glassmorphism: `backdrop-filter: blur(12px)` + `rgba(10,30,80,0.65)` de fundo
- Classes utilitárias: `.glass`, `.neon-border-cyan`, `.neon-border-pink`, `.neon-text-cyan`, `.neon-text-pink`

### Padrões de Componentes
- Modais: `@radix-ui/react-dialog` (não usar `alert()`/`confirm()`)
- Notificações: `sonner` com tema dark configurado em `Layout.tsx`
- Confirmações: componente `ConfirmModal` em `src/components/ui/`
- Editor Markdown: `@uiw/react-md-editor` com `data-color-mode="dark"` no wrapper
- Drag-and-drop: `@dnd-kit/core` + `@dnd-kit/sortable`
- Gráficos: `recharts`
- Ícones: `lucide-react`

### Formatadores Brasileiros
Todos em `src/lib/formatters.ts`:
- `formatCNPJ()`, `maskCNPJ()` — exibição e máscara de input
- `formatCEP()`, `maskCEP()` — exibição e máscara de input
- `formatCurrency()` — R$ 1.234,56
- `formatDate()` — dd/MM/yyyy
- `formatHours()` — 2h 30min
- `formatMonth()` — Junho/2026

### Busca de CEP
Hook `useViaCep` em `src/hooks/useViaCep.ts` — usa `https://viacep.com.br/ws/{cep}/json/`

### State Management
- Server state: `@tanstack/react-query` v5
- Query keys: `['clientes']`, `['projetos', clienteFilter]`, `['tarefas-kanban', ...]`, `['tarefa', id]`, `['relatorios']`, `['dashboard']`

## Como Executar em Dev

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend  
cd frontend && npm run dev
```

## Como Adicionar uma Nova Entidade

1. Criar entidade em `backend/src/domain/entities/`
2. Criar interface de repositório em `backend/src/domain/repositories/`
3. Criar implementação Prisma em `backend/src/infrastructure/repositories/`
4. Adicionar model no `prisma/schema.prisma` e rodar `npm run db:migrate`
5. Criar use cases em `backend/src/application/use-cases/`
6. Criar routes em `backend/src/http/routes/` e registrar em `server.ts`
7. Adicionar tipo em `frontend/src/types/index.ts`
8. Adicionar chamadas em `frontend/src/services/api.ts`
9. Criar componentes e/ou página

## Testes

```bash
cd backend && npm test
```

Cobertura: validadores de domínio, criação de entidades, regras de duplicidade (via mock repositories).
