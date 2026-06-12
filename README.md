# Freelancer Manager Board

Sistema de controle de horas trabalhadas em tarefas freelancer, com geração de relatórios mensais por cliente para suporte à emissão de notas fiscais.

## Funcionalidades

- **Dashboard** — visão geral com contagem de tarefas por status, gráfico de horas por cliente, top clientes e acesso rápido a projetos recentes
- **Cadastro de Clientes** — dados completos conforme Cartão CNPJ, busca de endereço pelo CEP via ViaCEP
- **Cadastro de Projetos** — valor por hora atrelado ao projeto, descrição em Markdown
- **Kanban** — quadro com drag-and-drop por status (Nova, Em Andamento, Pronta, Fechada), filtros por cliente/projeto
- **Tarefas** — múltiplos apontamentos de horas por tarefa, upload de documentos (PDF e imagens)
- **Relatórios** — fechamento mensal por cliente com memória de cálculo detalhada por projeto e impressão

## Pré-requisitos

- Node.js 20+
- npm 10+

## Instalação

### 1. Clone ou extraia o projeto

```bash
cd "g:\Dev\Freelancer Tasks"
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Copie o arquivo de configuração:

```bash
copy .env.example .env
```

Edite o `.env` e defina uma chave de API segura:

```
DATABASE_URL="file:../storage/database.db"
API_KEY="sua-chave-secreta-aqui"
PORT=3001
UPLOAD_DIR="../storage/uploads"
```

Crie a pasta de armazenamento e execute as migrações:

```bash
mkdir ..\storage
npm run db:migrate
```

> Quando solicitado o nome da migração, digite: `initial`

### 3. Configurar o Frontend

```bash
cd ..\frontend
npm install
```

Copie e configure o `.env`:

```bash
copy .env.example .env
```

Edite o `.env` com a mesma chave definida no backend:

```
VITE_API_URL=http://localhost:3001
VITE_API_KEY=sua-chave-secreta-aqui
```

Instale os componentes do shadcn/ui:

```bash
npx shadcn@latest add button card dialog input label select badge table tabs separator scroll-area tooltip popover dropdown-menu
```

## Executando o Projeto

### Backend (terminal 1)

```bash
cd backend
npm run dev
```

O servidor iniciará em `http://localhost:3001`

### Frontend (terminal 2)

```bash
cd frontend
npm run dev
```

O app abrirá em `http://localhost:5173`

## Executando os Testes (Backend)

```bash
cd backend
npm test
```

Os testes cobrem:
- Validação de CNPJ, CEP e e-mail
- Criação e reconstituição de entidades de domínio
- Regras de duplicidade (CNPJ e e-mail únicos)

## Estrutura do Projeto

```
├── backend/                # API Node.js + Fastify + Prisma
│   ├── prisma/             # Schema e migrações do banco
│   ├── src/
│   │   ├── domain/         # Entidades, validadores, interfaces
│   │   ├── application/    # Casos de uso (business logic)
│   │   ├── infrastructure/ # Implementações Prisma
│   │   └── http/           # Rotas Fastify e servidor
│   └── tests/              # Testes unitários (Vitest)
├── frontend/               # React + Vite + TypeScript
│   └── src/
│       ├── components/     # Componentes reutilizáveis
│       ├── pages/          # Páginas da aplicação
│       ├── services/       # Chamadas à API
│       ├── types/          # Tipos TypeScript
│       ├── lib/            # Utilitários e formatadores BR
│       └── hooks/          # Hooks customizados
└── storage/                # Banco SQLite e uploads (runtime, não versionado)
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
| POST | /api/tarefas/:id/documentos | Upload de documento |
| POST | /api/apontamentos | Registrar horas |
| POST | /api/relatorios/generate | Gerar relatório mensal |
| GET | /api/dashboard | Dados do dashboard |

## Regras de Negócio

- CNPJ e e-mail são únicos por cliente
- Valor por hora é por projeto, não por cliente
- CEP preenchido automaticamente via ViaCEP
- Múltiplos apontamentos por tarefa (data + hora início/fim)
- Relatório calcula: `total_horas × valor_hora_do_projeto`
- Documentos salvos em `storage/uploads/{tarefaId}/`
