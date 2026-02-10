import { NextResponse } from "next/server";
import { z } from "zod";

import { verifySessionToken } from "@/lib/session";
import { createPersonForUser } from "@/services/profileService";
import { getPersonForUser } from "@/services/profileService";

const bodySchema = z.object({
  full_name: z.string().min(3),
  nome_social: z.string().optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  gender: z.string().optional(),
  role: z.enum(["patient", "professional"]),
  profession: z.string().optional(),
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
    const parsed = bodySchema.parse(body);

    const userId = payload.id ?? null;
    const email = payload.email;

    const result = await createPersonForUser(
      userId,
      email,
      parsed,
      parsed.role,
      parsed.profession || null,
    );

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, person: result.person },
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
      { success: false, message: "Erro interno" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
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

    const userId = payload.id ?? null;
    const email = payload.email;

    const result = await getPersonForUser(userId, email);
    if (!result.ok) {
      if (result.notFound)
        return NextResponse.json(
          { success: true, person: null },
          { status: 200 },
        );
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, person: result.person },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Erro interno" },
      { status: 500 },
    );
  }
}
