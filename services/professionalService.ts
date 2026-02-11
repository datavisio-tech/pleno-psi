import { pool } from "@/lib/db";

export type ProfessionalInput = {
  professional_license?: string | null;
  specialty?: string | null;
  price?: string | null;
};

export async function upsertProfessionalForUser(
  userId: string | null,
  email: string,
  input: ProfessionalInput,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const personQ = await client.query(
      `SELECT id FROM persons WHERE ${userId ? "user_id = $1" : "lower(email) = lower($1)"} LIMIT 1`,
      [userId || email],
    );
    if (personQ.rowCount === 0) {
      await client.query("ROLLBACK");
      return { ok: false, error: "Person not found" };
    }
    const personId = personQ.rows[0].id;

    const profQ = await client.query(
      `SELECT id FROM professionals WHERE person_id = $1 LIMIT 1`,
      [personId],
    );
    if (profQ.rowCount) {
      const upd = `UPDATE professionals SET professional_license = $1, specialty = $2, price = $3 WHERE person_id = $4 RETURNING id`;
      const res = await client.query(upd, [
        input.professional_license || null,
        input.specialty || null,
        input.price ? Number(String(input.price).replace(/,/g, ".")) : null,
        personId,
      ]);
      await client.query("COMMIT");
      return { ok: true, professional: { id: res.rows[0].id } };
    } else {
      const ins = `INSERT INTO professionals (person_id, professional_license, specialty, price) VALUES ($1,$2,$3,$4) RETURNING id`;
      const res = await client.query(ins, [
        personId,
        input.professional_license || null,
        input.specialty || null,
        input.price ? Number(String(input.price).replace(/,/g, ".")) : null,
      ]);
      await client.query("COMMIT");
      return { ok: true, professional: { id: res.rows[0].id } };
    }
  } catch (err: any) {
    await client.query("ROLLBACK");
    return { ok: false, error: err.message || "Erro ao salvar profissional" };
  } finally {
    client.release();
  }
}

export default { upsertProfessionalForUser };
