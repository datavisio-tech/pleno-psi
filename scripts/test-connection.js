#!/usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");

let connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  // Build from individual POSTGRES_* variables if provided
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT || "5432";
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const db = process.env.POSTGRES_DB;

  if (host && user && db) {
    connectionString = `postgresql://${user}:${password || ""}@${host}:${port}/${db}?sslmode=disable`;
  }

  if (!connectionString) {
    console.error(
      "Please set DATABASE_URL or POSTGRES_HOST/POSTGRES_USER/POSTGRES_DB environment variables",
    );
    process.exit(1);
  }
}

async function main() {
  const client = new Client({ connectionString });
  await client.connect();
  try {
    const res = await client.query("SELECT version()");
    console.log("Connected to:", res.rows[0].version);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
