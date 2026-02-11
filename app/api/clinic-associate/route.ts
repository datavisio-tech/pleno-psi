import { NextResponse } from "next/server";
import { z } from "zod";
import { verifySessionToken } from "@/lib/session";
import { associateProfessionalToClinic } from "@/services/clinicService";

const schema = z.object({ clinic_id: z.string().uuid() });

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

    const res = await associateProfessionalToClinic(
      payload.id ?? null,
      payload.email,
      parsed.clinic_id,
    );
    if (!res.ok) {
      console.error("associate error", res.error);
      return NextResponse.json(
        { success: false, message: "Erro ao associar clínica" },
        { status: 500 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err instanceof z.ZodError)
      return NextResponse.json(
        { success: false, message: "Dados inválidos" },
        { status: 400 },
      );
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Erro interno" },
      { status: 500 },
    );
  }
}
