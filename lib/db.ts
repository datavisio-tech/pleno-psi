import { Pool } from "pg";

function buildDatabaseUrl(): string | null {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT;
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DB;

  if (!host || !port || !user || !password || !database) return null;

  const encodedUser = encodeURIComponent(user);
  const encodedPass = encodeURIComponent(password);

  return `postgresql://${encodedUser}:${encodedPass}@${host}:${port}/${database}`;
}

const connectionString = buildDatabaseUrl();
if (!connectionString) {
  throw new Error(
    "DATABASE_URL ou variáveis POSTGRES_* não configuradas. Defina DATABASE_URL ou POSTGRES_HOST/PORT/USER/PASSWORD/DB.",
  );
}

export const pool = new Pool({ connectionString });

export async function query(text: string, params?: any[]) {
  return pool.query(text, params);
}
