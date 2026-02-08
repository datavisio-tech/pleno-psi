# Migração em Produção — Guia Rápido

Este guia descreve como executar backup, testar conexão e aplicar as migrations no banco de produção.

AVISO: faça backup antes e confirme janela de manutenção. Reescrever dados em produção é irreversível.

Arquivos de ajuda criados:

- `scripts/prod_migrate.ps1` — PowerShell (Windows)
- `scripts/prod_migrate.sh` — Bash (Linux/macOS)

PowerShell (recomendado se estiver no Windows):

```powershell
# Executar (será pedida a senha postgres)
PowerShell example using `.env` values (preferred):

```powershell
# If you set POSTGRES_HOST/POSTGRES_PORT/POSTGRES_DB/POSTGRES_USER in .env, you can run without args
.\scripts\prod_migrate.ps1

# Or explicitly using environment variable values
.\scripts\prod_migrate.ps1 -Host $env:POSTGRES_HOST -Port $env:POSTGRES_PORT -Database $env:POSTGRES_DB -User $env:POSTGRES_USER
```

# Para pular o backup (não recomendado):
.\scripts\prod_migrate.ps1 -SkipBackup
```

Bash (Linux/macOS):

```bash
# Executar (será pedida a senha)
Shell example using environment variables (preferred):

```bash
# If POSTGRES_HOST/POSTGRES_PORT/POSTGRES_DB/POSTGRES_USER are set in the environment, run:
./scripts/prod_migrate.sh

# Or pass them explicitly:
HOST=${POSTGRES_HOST:-72.60.143.197} PORT=${POSTGRES_PORT:-5432} ./scripts/prod_migrate.sh ${POSTGRES_HOST:-72.60.143.197} ${POSTGRES_PORT:-5432} ${POSTGRES_DB:-datavisio} ${POSTGRES_USER:-postgres}
```
```

O que os scripts fazem:

1. Solicita a senha do usuário `postgres` de forma interativa.
2. Realiza um `pg_dump` em formato compactado (`.dump`) no diretório atual.
3. Define temporariamente `DATABASE_URL` para a sessão e executa `npm run db:test`.
4. Executa `npm run db:migrate` para aplicar as migrations existentes em `./migrations`.

Recomendações:

- Execute primeiro em um ambiente de staging com banco semelhante.
- Verifique disponibilidade de disco para os backups.
- Notifique usuários antes da janela de manutenção.

Se preferir, posso executar os passos para você a partir daqui (você precisará fornecer a senha). Caso contrário, rode os scripts localmente e me traga logs para eu analisar qualquer erro.
