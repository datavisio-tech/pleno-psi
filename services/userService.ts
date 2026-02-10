import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export type RegisterResult =
  | { ok: true; user: { id: string; email: string; created_at: string } }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function registerUser(
  email: string,
  password: string,
): Promise<RegisterResult> {
  const normalized = String(email).trim().toLowerCase();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const passwordHash = await bcrypt.hash(password, 10);

    const insertText = `INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at`;
    const res = await client.query(insertText, [normalized, passwordHash]);

    await client.query("COMMIT");
    return { ok: true, user: res.rows[0] };
  } catch (err: any) {
    await client.query("ROLLBACK");
    // Unique violation (email already exists)
    if (err && err.code === "23505") {
      return {
        ok: false,
        error: "E-mail já cadastrado",
        fieldErrors: { email: "E-mail já existe" },
      };
    }

    return { ok: false, error: "Erro interno ao criar usuário" };
  } finally {
    client.release();
  }
}

export type LoginResult =
  | { ok: true; user: { id: string; email: string; created_at: string } }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResult> {
  const normalized = String(email).trim().toLowerCase();
  const client = await pool.connect();
  try {
    const res = await client.query(
      "SELECT id, email, password_hash, created_at FROM users WHERE email = $1",
      [normalized],
    );
    if (res.rowCount === 0) {
      return { ok: false, error: "Credenciais inválidas" };
    }

    const user = res.rows[0];
    const bcrypt = require("bcryptjs");
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return { ok: false, error: "Credenciais inválidas" };
    }

    return {
      ok: true,
      user: { id: user.id, email: user.email, created_at: user.created_at },
    };
  } catch (err: any) {
    return { ok: false, error: "Erro interno" };
  } finally {
    client.release();
  }
}

export type UserProfileResult =
  | {
      ok: true;
      user: { id: string; email: string; name?: string };
      needsProfileCompletion: boolean;
    }
  | { ok: false; error: string };

export async function getUserProfile(identifier: {
  id?: string;
  email?: string;
}): Promise<UserProfileResult> {
  const client = await pool.connect();
  try {
    let res;
    if (identifier.id) {
      res = await client.query(
        `SELECT u.id as user_id, u.email as user_email, p.full_name as person_name FROM users u LEFT JOIN persons p ON lower(p.email)=lower(u.email) WHERE u.id = $1`,
        [identifier.id],
      );
    } else if (identifier.email) {
      res = await client.query(
        `SELECT u.id as user_id, u.email as user_email, p.full_name as person_name FROM users u LEFT JOIN persons p ON lower(p.email)=lower(u.email) WHERE lower(u.email) = lower($1)`,
        [identifier.email],
      );
    } else {
      return { ok: false, error: "Missing identifier" };
    }

    if (!res || res.rowCount === 0) {
      return { ok: false, error: "Usuário não encontrado" };
    }

    const row = res.rows[0];
    const user = {
      id: row.user_id,
      email: row.user_email,
      name: row.person_name ?? undefined,
    };
    const needsProfileCompletion = !row.person_name;
    return { ok: true, user, needsProfileCompletion };
  } catch (err: any) {
    return { ok: false, error: "Erro interno" };
  } finally {
    client.release();
  }
}
