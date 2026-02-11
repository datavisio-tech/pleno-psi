#!/usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

function buildDatabaseUrlFromEnv() {
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT || "5432";
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD || "";
  const db = process.env.POSTGRES_DB;
  if (host && user && db) {
    return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${db}?sslmode=disable`;
  }
  return process.env.DATABASE_URL || null;
}

async function main() {
  const connStr = buildDatabaseUrlFromEnv();
  if (!connStr) {
    console.error("No connection string found. Set POSTGRES_* or DATABASE_URL");
    process.exit(1);
  }
  const client = new Client({ connectionString: connStr });
  await client.connect();
  try {
    console.log("Latest addresses:");
    const res = await client.query(
      "SELECT id, street, number, city, state, zip_code, country, created_at FROM addresses ORDER BY created_at DESC LIMIT 10",
    );
    console.dir(res.rows, { depth: null });

    console.log("\nPersons with addresses:");
    const p = await client.query(
      "SELECT id, user_id, email, full_name, address_id FROM persons WHERE address_id IS NOT NULL ORDER BY created_at DESC LIMIT 10",
    );
    console.dir(p.rows, { depth: null });
  } catch (e) {
    console.error("Error querying DB:", e.message || e);
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
