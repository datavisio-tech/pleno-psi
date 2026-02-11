import { NextResponse } from "next/server";
import { z } from "zod";

import { verifySessionToken } from "@/lib/session";
import { saveAddressAndResponsible } from "@/services/addressService";

const addressSchema = z.object({
  zip_code: z.string().min(1),
  street: z.string().min(1),
  number: z.string().min(1),
  neighborhood: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().min(1),
  country_name: z.string().min(1),
  country_code: z.string().min(1),
  country_flag_svg: z.string().optional().nullable(),
  responsible: z
    .object({
      full_name: z.string().min(3),
      email: z.string().email(),
      cpf: z.string().optional().nullable(),
      phone: z.string().optional().nullable(),
      password: z.string().min(6),
    })
    .optional()
    .nullable(),
});

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/pleno.sid=([^;]+)/);
    const token = match ? match[1] : null;

    const payload = token ? verifySessionToken(token) : null;
    if (!payload || !payload.email) {
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const parsed = addressSchema.parse(body);

    // verify CEP with BrasilAPI but do not block saving if not found
    const warnings: Record<string, string> = {};
    try {
      const zip = String(parsed.zip_code || "").replace(/[^0-9]/g, "");
      if (zip) {
        if (zip.length !== 8) {
          warnings.zip_code = "CEP inválido (pode preencher manualmente)";
        } else {
          const cepRes = await fetch(
            `https://brasilapi.com.br/api/cep/v1/${zip}`,
          );
          if (!cepRes.ok) {
            warnings.zip_code =
              "CEP não encontrado (pode preencher manualmente)";
          }
        }
      }
    } catch (e: any) {
      warnings.zip_code = "Erro ao verificar CEP (pode preencher manualmente)";
    }

    const userId = payload.id ?? null;
    const email = payload.email;

    const result = await saveAddressAndResponsible(
      userId,
      email,
      {
        zip_code: parsed.zip_code,
        street: parsed.street,
        number: parsed.number,
        neighborhood: parsed.neighborhood ?? null,
        city: parsed.city,
        state: parsed.state,
        country_name: parsed.country_name,
        country_code: parsed.country_code,
        country_flag_svg: parsed.country_flag_svg ?? null,
      },
      parsed.responsible || (null as any),
    );

    if (!result.ok) {
      // log technical error server-side
      console.error("address save error:", result.error);
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao salvar endereço. Tente novamente mais tarde.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        warnings: Object.keys(warnings).length ? warnings : undefined,
      },
      { status: 201 },
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      err.errors.forEach((e) => {
        if (e.path && e.path[0]) fieldErrors[String(e.path[0])] = e.message;
      });
      return NextResponse.json(
        { success: false, message: "Dados inválidos", fieldErrors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, message: err?.message || "Erro interno" },
      { status: 500 },
    );
  }
}
