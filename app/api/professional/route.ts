import { NextResponse } from "next/server";
import { z } from "zod";
import { verifySessionToken } from "@/lib/session";
import { upsertProfessionalForUser } from "@/services/professionalService";

const schema = z.object({
  professional_license: z.string().optional(),
  specialty: z.string().optional(),
  price: z.string().optional(),
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

    const res = await upsertProfessionalForUser(
      payload.id ?? null,
      payload.email,
      parsed,
    );
    if (!res.ok) {
      console.error("professional save error:", res.error);
      return NextResponse.json(
        { success: false, message: "Erro ao salvar dados profissionais" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { success: true, professional: res.professional },
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
