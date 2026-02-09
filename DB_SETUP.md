# Banco de Dados — Setup e Migrações

Este documento descreve como configurar a conexão com PostgreSQL e aplicar as migrations locais.

Requisitos:

- PostgreSQL 12+
- Node.js 18+

Instalação de dependências:

```powershell
# No Windows / PowerShell
npm install
# ou instalar apenas pg
npm install pg
```

Variável de ambiente necessária:

- `DATABASE_URL` — URL de conexão no formato `postgres://user:pass@host:port/dbname`

Testar conexão:

```powershell
# Defina a variável de ambiente na sessão atual
$env:POSTGRES_PORT = 5432 # default port if you don't set it explicitly
$env:DATABASE_URL = "postgres://user:pass@localhost:${env:POSTGRES_PORT:-5432}/plenopsi"
npm run db:test
```

Rodar migrações:

```powershell
# Aplica todas as migrations em ./migrations
npm run db:migrate
```

Observações:

- O runner registra migrations aplicadas na tabela `migrations`.
- A migração inicial `src/migrations/001_initial.sql` ativa a extensão `pgcrypto` (usa `gen_random_uuid()`), cria tabelas, constraints, índices e a tabela `migrations`.
- Ajuste permissões e parâmetros de acordo com seu ambiente de produção.
