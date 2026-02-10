import { pool } from "@/lib/db";

export type PersonInput = {
  full_name: string;
  nome_social?: string | null;
  cpf?: string | null;
  phone?: string | null;
  birth_date?: string | null;
  gender?: string | null;
};

export async function createPersonForUser(
  userId: string | null,
  email: string,
  input: PersonInput,
  role: "patient" | "professional",
  profession?: string | null,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertPersonText = `INSERT INTO persons (user_id, email, full_name, nome_social, cpf, phone, birth_date, gender)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id, full_name`;

    const res = await client.query(insertPersonText, [
      userId,
      email,
      input.full_name,
      input.nome_social || null,
      input.cpf || null,
      input.phone || null,
      input.birth_date || null,
      input.gender || null,
    ]);

    const person = res.rows[0];

    if (role === "professional") {
      const insertProf = `INSERT INTO professionals (person_id, specialty) VALUES ($1, $2) RETURNING id`;
      await client.query(insertProf, [person.id, profession || null]);
    }

    await client.query("COMMIT");
    return { ok: true, person };
  } catch (err: any) {
    await client.query("ROLLBACK");
    return { ok: false, error: err.message || "Erro ao criar person" };
  } finally {
    client.release();
  }
}

export default { createPersonForUser };

export async function getPersonForUser(userId: string | null, email: string) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      `SELECT p.*, pr.id as professional_id, pr.specialty FROM persons p LEFT JOIN professionals pr ON pr.person_id = p.id WHERE ${
        userId ? "p.user_id = $1" : "lower(p.email) = lower($1)"
      } LIMIT 1`,
      [userId || email],
    );
    if (res.rowCount === 0) return { ok: false, notFound: true };
    const row = res.rows[0];
    return {
      ok: true,
      person: {
        id: row.id,
        user_id: row.user_id,
        email: row.email,
        full_name: row.full_name,
        nome_social: row.nome_social,
        cpf: row.cpf,
        phone: row.phone,
        birth_date: row.birth_date
          ? row.birth_date.toISOString().slice(0, 10)
          : null,
        gender: row.gender,
        professional_id: row.professional_id || null,
        specialty: row.specialty || null,
      },
    };
  } catch (err: any) {
    return { ok: false, error: err.message || "Erro ao buscar person" };
  } finally {
    client.release();
  }
}
