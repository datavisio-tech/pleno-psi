import { NextResponse } from "next/server";
import { z } from "zod";
import { verifySessionToken } from "@/lib/session";
import { createClinicWithAddressAndAdmin } from "@/services/clinicService";

const schema = z.object({
  name: z.string().min(1),
  legal_name: z.string().optional(),
  cnpj: z.string().optional(),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    zip_code: z.string().optional(),
    country: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/pleno.sid=([^;]+)/);
    const token = match ? match[1] : null;
    const payload = token ? verifySessionToken(token) : null;
    if (!payload || !payload.email)
      return NextResponse.json(
        { success: false, message: "Não autorizado" },
        { status: 401 },
      );

    const body = await req.json();
    const parsed = schema.parse(body);

    const res = await createClinicWithAddressAndAdmin(
      payload.id ?? null,
      payload.email,
      parsed,
    );
    if (!res.ok) {
      console.error("create clinic error:", res.error);
      return NextResponse.json(
        { success: false, message: "Erro ao criar clínica" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { success: true, clinic: res.clinic },
      { status: 201 },
    );
  } catch (err: any) {
    if (err instanceof z.ZodError)
      return NextResponse.json(
        { success: false, message: "Dados inválidos", fieldErrors: err.errors },
        { status: 400 },
      );
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Erro interno" },
      { status: 500 },
    );
  }
}
