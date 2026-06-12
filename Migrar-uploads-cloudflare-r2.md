Ready for review
Select text to add comments on the plan
Plano: Migrar uploads para Cloudflare R2
Contexto
Os arquivos anexados às tarefas são salvos no filesystem local do servidor (/storage/uploads). Isso é problemático em plataformas de cloud como o Render, que possuem filesystem efêmero. O objetivo é migrar para o bucket R2 freelance-task-files da Cloudflare, que é compatível com a API S3. Acesso via URL pública direta (bucket público).

Decisão sobre o campo caminho
O campo Documento.caminho hoje armazena o path local (ex: /storage/uploads/task-id/uuid.jpg).
Após a migração, passará a armazenar a URL pública completa do R2 (ex: https://pub-xxx.r2.dev/task-id/uuid.jpg).

Vantagem: zero mudança na estrutura do banco; frontend usa doc.caminho diretamente como href
Deleção no R2: extrair a key com caminho.replace(R2_PUBLIC_URL + '/', '')
Mudanças
1. Dependência (backend/package.json)
Adicionar em dependencies:

"@aws-sdk/client-s3": "^3"
Não precisa de s3-request-presigner (bucket público).

2. Variáveis de ambiente (backend/.env)
Adicionar:

R2_ACCOUNT_ID=<account-id-do-cloudflare>
R2_ACCESS_KEY_ID=<r2-access-key>
R2_SECRET_ACCESS_KEY=<r2-secret-key>
R2_BUCKET_NAME=freelance-task-files
R2_PUBLIC_URL=https://pub-<hash>.r2.dev
Remover: UPLOAD_DIR (não há mais storage local).

3. Novo serviço R2 — backend/src/infrastructure/storage/r2.ts (arquivo novo)
Singleton do S3Client + dois helpers:

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

export async function uploadToR2(key: string, body: Buffer, contentType: string) {
  await r2.send(new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
    Body: body,
    ContentType: contentType,
  }))
  return `${process.env.R2_PUBLIC_URL}/${key}`  // retorna a URL pública
}

export async function deleteFromR2(publicUrl: string) {
  const key = publicUrl.replace(process.env.R2_PUBLIC_URL! + '/', '')
  await r2.send(new DeleteObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
  }))
}
4. Rota de upload — backend/src/http/routes/tarefas.ts
Substituir no handler POST /:id/documentos:

Antes	Depois
fs.mkdir + fs.writeFile para disco	file.toBuffer() + uploadToR2(key, buffer, mimetype)
caminho = path.join(uploadDir, tarefaId, filename)	caminho = url pública retornada por uploadToR2
A key do R2 segue o mesmo padrão atual: {tarefaId}/{randomUUID}.{ext}.

5. Rota de deleção de documento — backend/src/http/routes/tarefas.ts
Substituir no handler DELETE /:id/documentos/:docId:

Antes	Depois
fs.unlink(doc.caminho)	deleteFromR2(doc.caminho)
6. Rota de deleção de tarefa — backend/src/http/routes/tarefas.ts
Substituir no loop de limpeza de arquivos ao deletar uma tarefa:

Antes	Depois
for (doc of docs) fs.unlink(doc.caminho)	await Promise.allSettled(docs.map(d => deleteFromR2(d.caminho)))
7. Servidor — backend/src/http/server.ts
Remover:

Import e registro de @fastify/static
Criação dos diretórios storageDir e uploadDir no bootstrap
Variável uploadDir e storageDir
Manter: @fastify/multipart (ainda necessário para receber o arquivo).

8. Middleware de auth — backend/src/http/middlewares/auth.ts
Remover /uploads/ de PUBLIC_PREFIXES (arquivos já são servidos pelo R2, não pelo backend).

9. Frontend — frontend/src/components/tasks/TaskDetailModal.tsx
Substituir a construção da URL do arquivo:

// Antes
href={`/uploads/${tarefaId}/${doc.caminho.split(/[\\/]/).pop()}`}

// Depois
href={doc.caminho}
doc.caminho agora é a URL pública do R2 — pode ser usada diretamente como href.

10. Docker Compose — docker-compose.yml
Remover o bloco volumes do serviço backend (não há mais storage local de uploads).

Configuração no R2 (pré-requisito manual)
Antes de rodar, o usuário precisa:

No painel R2 → bucket freelance-task-files → Settings → Public Access → Allow
Copiar a Public Bucket URL (formato https://pub-xxx.r2.dev) para R2_PUBLIC_URL
Criar um API Token R2 com permissão de leitura/escrita e copiar as credenciais
Verificação
cd backend && npm install
Subir backend: npm run dev
Subir frontend: cd frontend && npm run dev
Abrir uma tarefa no kanban → arrastar ou clicar para subir um arquivo (JPG ou PDF)
Verificar no painel do R2 que o objeto foi criado em freelance-task-files/{tarefaId}/{uuid}.ext
Clicar no arquivo listado na tarefa → deve abrir diretamente a URL do R2 numa nova aba
Deletar o arquivo → verificar que o objeto some do bucket R2
Deletar a tarefa → verificar que todos os objetos associados somem do bucket R2