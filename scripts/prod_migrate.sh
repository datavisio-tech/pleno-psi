#!/usr/bin/env bash
set -euo pipefail

HOST=${1:-${POSTGRES_HOST:-72.60.143.197}}
PORT=${2:-${POSTGRES_PORT:-5432}}
DB=${3:-${POSTGRES_DB:-datavisio}}
USER=${4:-${POSTGRES_USER:-postgres}}

read -s -p "Senha do usuário $USER: " PGPASSWORD
echo

BACKUP_FILE="backup_${DB}_$(date +%Y%m%d-%H%M).dump"
echo "Fazendo backup em: $BACKUP_FILE"
PGPASSWORD="$PGPASSWORD" pg_dump -h "$HOST" -p "$PORT" -U "$USER" -d "$DB" -F c -b -v -f "$BACKUP_FILE"

export DATABASE_URL="postgresql://$USER:$PGPASSWORD@$HOST:$PORT/$DB?sslmode=disable"

echo "Testando conexão..."
npm run db:test

echo "Aplicando migrations..."
npm run db:migrate

echo "Concluído"
