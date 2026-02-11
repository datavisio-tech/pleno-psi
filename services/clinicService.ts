import { pool } from "@/lib/db";

export type ClinicInput = {
  name: string;
  legal_name?: string | null;
  cnpj?: string | null;
  address: {
    street: string;
    number: string;
    city: string;
    state: string;
    zip_code?: string | null;
    country?: string | null;
  };
};

export async function createClinicWithAddressAndAdmin(
  adminUserId: string | null,
  email: string,
  input: ClinicInput,
) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const insertAddress = `INSERT INTO addresses (street, number, city, state, zip_code, country, created_at) VALUES ($1,$2,$3,$4,$5,$6, now()) RETURNING id`;
    const addrRes = await client.query(insertAddress, [
      input.address.street,
      input.address.number,
      input.address.city,
      input.address.state,
      input.address.zip_code || null,
      input.address.country || null,
    ]);
    const addressId = addrRes.rows[0].id;

    const insertClinic = `INSERT INTO clinics (name, legal_name, cnpj, address_id, created_at) VALUES ($1,$2,$3,$4, now()) RETURNING id`;
    const clinicRes = await client.query(insertClinic, [
      input.name,
      input.legal_name || null,
      input.cnpj || null,
      addressId,
    ]);
    const clinicId = clinicRes.rows[0].id;

    // link admin user if exists
    if (adminUserId) {
      await client.query(
        `INSERT INTO clinic_users (clinic_id, user_id, role) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
        [clinicId, adminUserId, "admin"],
      );
    } else {
      // try find user by email
      const ures = await client.query(
        `SELECT id FROM users WHERE lower(email)=lower($1) LIMIT 1`,
        [email],
      );
      if (ures.rowCount) {
        await client.query(
          `INSERT INTO clinic_users (clinic_id, user_id, role) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
          [clinicId, ures.rows[0].id, "admin"],
        );
      }
    }

    await client.query("COMMIT");
    return { ok: true, clinic: { id: clinicId, address_id: addressId } };
  } catch (err: any) {
    await client.query("ROLLBACK");
    return { ok: false, error: err.message || "Erro ao criar clínica" };
  } finally {
    client.release();
  }
}

export async function searchClinics(q: string) {
  const client = await pool.connect();
  try {
    const like = `%${q}%`;
    const res = await client.query(
      `SELECT id, name, cnpj FROM clinics WHERE name ILIKE $1 OR cnpj ILIKE $1 LIMIT 10`,
      [like],
    );
    return { ok: true, items: res.rows };
  } catch (err: any) {
    return { ok: false, error: err.message || "Erro na busca" };
  } finally {
    client.release();
  }
}

export async function associateProfessionalToClinic(
  userId: string | null,
  email: string,
  clinicId: string,
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
    if (profQ.rowCount === 0) {
      await client.query("ROLLBACK");
      return { ok: false, error: "Professional not found" };
    }
    const professionalId = profQ.rows[0].id;

    await client.query(
      `INSERT INTO clinic_professionals (clinic_id, professional_id, active) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING`,
      [clinicId, professionalId, true],
    );
    await client.query("COMMIT");
    return { ok: true };
  } catch (err: any) {
    await client.query("ROLLBACK");
    return { ok: false, error: err.message || "Erro ao associar" };
  } finally {
    client.release();
  }
}

export default {
  createClinicWithAddressAndAdmin,
  searchClinics,
  associateProfessionalToClinic,
};
