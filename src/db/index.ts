import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Environment variable DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });

export async function testConnection() {
  const client = await pool.connect();
  try {
    const res = await client.query("SELECT NOW()");
    return res.rows[0];
  } finally {
    client.release();
  }
}

export default pool;
