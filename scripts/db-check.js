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
    console.log(
      "Querying persons with full_name = Integration Test User (latest 5)",
    );
    const res = await client.query(
      "SELECT id, user_id, email, full_name, nome_social, cpf, phone, created_at FROM persons WHERE full_name = $1 ORDER BY created_at DESC LIMIT 5",
      ["Integration Test User"],
    );
    console.dir(res.rows, { depth: null });

    console.log("\nQuerying professionals linked to those persons");
    if (res.rows.length) {
      const ids = res.rows.map((r) => r.id);
      const profRes = await client.query(
        `SELECT * FROM professionals WHERE person_id = ANY($1::uuid[]) ORDER BY created_at DESC`,
        [ids],
      );
      console.dir(profRes.rows, { depth: null });
    } else {
      console.log("No persons found to check professionals.");
    }
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
