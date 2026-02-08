#!/usr/bin/env node
require("dotenv").config();
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const migrationsDir = path.join(__dirname, "..", "migrations");

function buildDatabaseUrlFromEnv() {
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT || "5432";
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD || "";
  const db = process.env.POSTGRES_DB;
  if (host && user && db) {
    return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${db}?sslmode=disable`;
  }
  return null;
}

function parseDatabaseUrl(connStr) {
  try {
    const u = new URL(connStr);
    return {
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      host: u.hostname,
      port: u.port || process.env.POSTGRES_PORT || "5432",
      database:
        u.pathname && u.pathname.length > 1 ? u.pathname.slice(1) : null,
      params: u.searchParams,
    };
  } catch (e) {
    return null;
  }
}

async function ensureDatabaseExists(adminConnConfig, targetDb) {
  const adminClient = new Client(adminConnConfig);
  await adminClient.connect();
  try {
    const r = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [targetDb],
    );
    if (r.rowCount === 0) {
      console.log(`Database '${targetDb}' not found — creating...`);
      await adminClient.query(`CREATE DATABASE "${targetDb}"`);
      console.log(`Database '${targetDb}' created.`);
    } else {
      console.log(`Database '${targetDb}' already exists.`);
    }
  } finally {
    await adminClient.end();
  }
}

function migrationNumber(name) {
  const m = name.match(/^(\d+)_/);
  return m ? parseInt(m[1], 10) : null;
}

async function main() {
  const connStr = process.env.DATABASE_URL || buildDatabaseUrlFromEnv();
  if (!connStr) {
    console.error(
      "Please set DATABASE_URL or POSTGRES_HOST/POSTGRES_USER/POSTGRES_DB in environment",
    );
    process.exit(1);
  }

  const parsed = parseDatabaseUrl(connStr);
  if (!parsed) {
    console.error("Invalid DATABASE_URL");
    process.exit(1);
  }

  const targetDb = process.env.MIGRATE_DB || parsed.database || "plenopsi";

  const adminConn = {
    host: parsed.host,
    port: parsed.port,
    user: parsed.user,
    password: parsed.password,
    database: "postgres",
  };

  await ensureDatabaseExists(adminConn, targetDb);

  const targetConn = Object.assign({}, adminConn, { database: targetDb });
  const client = new Client({
    host: targetConn.host,
    port: targetConn.port,
    user: targetConn.user,
    password: targetConn.password,
    database: targetConn.database,
  });
  await client.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id serial PRIMARY KEY,
        name text NOT NULL UNIQUE,
        applied_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const appliedRes = await client.query("SELECT name FROM migrations");
    const appliedNames = new Set(appliedRes.rows.map((r) => r.name));
    const appliedNums = Array.from(appliedNames)
      .map((n) => migrationNumber(n))
      .filter((x) => x !== null);
    const maxApplied = appliedNums.length ? Math.max(...appliedNums) : 0;

    const fileNums = files.map((f) => ({
      name: f,
      num: migrationNumber(f) || 0,
    }));
    const maxFile = fileNums.length
      ? Math.max(...fileNums.map((f) => f.num))
      : 0;

    console.log(
      `Max applied migration: ${maxApplied}, Max available migration: ${maxFile}`,
    );

    if (maxFile <= maxApplied) {
      console.log("Database schema is up to date — no migrations to apply.");
      return;
    }

    for (const file of files) {
      const name = file;
      if (appliedNames.has(name)) {
        console.log(`Skipping already applied: ${name}`);
        continue;
      }

      console.log(`Applying migration: ${name}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO migrations(name) VALUES($1)", [name]);
        await client.query("COMMIT");
        console.log(`Applied: ${name}`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`Failed to apply ${name}:`, err.message);
        throw err;
      }
    }

    console.log("All pending migrations applied");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
