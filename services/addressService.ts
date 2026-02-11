import { pool } from "@/lib/db";
import bcrypt from "bcryptjs";

export type AddressInput = {
  zip_code: string;
  street: string;
  number: string;
  neighborhood?: string | null;
  city: string;
  state: string;
  country_name: string;
  country_code: string;
  country_flag_svg?: string | null;
};

export type ResponsibleInput = {
  email: string;
  password: string;
  full_name: string;
  cpf?: string | null;
  phone?: string | null;
};

/**
 * Save address and optionally responsible for a patient.
 * Steps (transactional):
 * - Insert address
 * - Link address_id to existing person (found by user_id or email)
 * - If responsible provided: create users -> persons -> legal_responsibles -> patient_responsibles
 * Returns created rows info. Backend validation should be added later.
 */
export async function saveAddressAndResponsible(
  userId: string | null,
  email: string,
  address: AddressInput,
  responsible?: ResponsibleInput | null,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertAddress = `INSERT INTO addresses (street, number, city, state, zip_code, country, created_at)
      VALUES ($1,$2,$3,$4,$5,$6, now()) RETURNING id`;
    const addrRes = await client.query(insertAddress, [
      address.street,
      address.number,
      address.city,
      address.state,
      address.zip_code,
      address.country_name,
    ]);
    const addressId = addrRes.rows[0].id;

    // Link address to person's record
    // Try by user_id first, fallback to email
    let updateRes = null;
    if (userId) {
      updateRes = await client.query(
        `UPDATE persons SET address_id = $1 WHERE user_id = $2 RETURNING id`,
        [addressId, userId],
      );
    }
    if ((!updateRes || updateRes.rowCount === 0) && email) {
      updateRes = await client.query(
        `UPDATE persons SET address_id = $1 WHERE lower(email) = lower($2) RETURNING id`,
        [addressId, email],
      );
    }

    let responsibleResult: any = null;
    if (responsible) {
      // create user for responsible
      const pwdHash = await bcrypt.hash(responsible.password, 10);
      const insertUser = `INSERT INTO users (email, password_hash) VALUES ($1,$2) RETURNING id`;
      const ures = await client.query(insertUser, [responsible.email, pwdHash]);
      const responsibleUserId = ures.rows[0].id;

      // create person for responsible
      const insertPerson = `INSERT INTO persons (user_id, email, full_name, cpf, phone, created_at)
        VALUES ($1,$2,$3,$4,$5, now()) RETURNING id`;
      const pres = await client.query(insertPerson, [
        responsibleUserId,
        responsible.email,
        responsible.full_name,
        responsible.cpf || null,
        responsible.phone || null,
      ]);
      const responsiblePersonId = pres.rows[0].id;

      // create legal_responsibles
      const insertLegal = `INSERT INTO legal_responsibles (person_id, billing_address_id) VALUES ($1, $2) RETURNING id`;
      const lres = await client.query(insertLegal, [
        responsiblePersonId,
        addressId,
      ]);
      const legalId = lres.rows[0].id;

      // link patient -> legal_responsible via patient_responsibles
      // find patient id (from persons -> patients)
      const patientQ = await client.query(
        `SELECT p.id as person_id, pa.id as patient_id FROM persons p LEFT JOIN patients pa ON pa.person_id = p.id WHERE ${userId ? "p.user_id = $1" : "lower(p.email) = lower($1)"} LIMIT 1`,
        [userId || email],
      );
      let patientId = null;
      if (patientQ.rowCount) patientId = patientQ.rows[0].patient_id;
      if (patientId) {
        await client.query(
          `INSERT INTO patient_responsibles (patient_id, legal_responsible_id, type) VALUES ($1,$2,$3)`,
          [patientId, legalId, "guardian"],
        );
      }

      responsibleResult = { responsibleUserId, responsiblePersonId, legalId };
    }

    await client.query("COMMIT");
    return { ok: true, addressId, responsible: responsibleResult };
  } catch (err: any) {
    await client.query("ROLLBACK");
    return { ok: false, error: err.message || "Erro ao salvar address" };
  } finally {
    client.release();
  }
}

export default { saveAddressAndResponsible };
