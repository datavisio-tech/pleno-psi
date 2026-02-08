
#!/usr/bin/env bash
set -euo pipefail

# =========================
# Load environment variables
# =========================
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# =========================
# Required variables check
# =========================
: "${POSTGRES_HOST:?POSTGRES_HOST não definido}"
: "${POSTGRES_PORT:?POSTGRES_PORT não definido}"
: "${POSTGRES_DB:?POSTGRES_DB não definido}"
: "${POSTGRES_USER:?POSTGRES_USER não definido}"

# =========================
# Read password securely
# =========================
read -s -p "Senha do usuário $POSTGRES_USER: " PGPASSWORD
echo

# =========================
# Backup
# =========================
BACKUP_FILE="backup_${POSTGRES_DB}_$(date +%Y%m%d-%H%M).dump"

echo "📦 Fazendo backup em: $BACKUP_FILE"
PGPASSWORD="$PGPASSWORD" pg_dump \
  -h "$POSTGRES_HOST" \
  -p "$POSTGRES_PORT" \
  -U "$POSTGRES_USER" \
  -d "$POSTGRES_DB" \
  -F c -b -v \
  -f "$BACKUP_FILE"

# =========================
# Database URL
# =========================
export DATABASE_URL="postgresql://${POSTGRES_USER}:${PGPASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}?sslmode=disable"

# =========================
# Test connection
# =========================
echo "🔍 Testando conexão..."
npm run db:test

# =========================
# Run migrations
# =========================
echo "🚀 Aplicando migrations..."
npm run db:migrate

echo "✅ Concluído com sucesso"
