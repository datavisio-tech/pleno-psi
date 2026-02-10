import { NextResponse } from "next/server";
import { z } from "zod";

import { buildSetCookieHeader, createSessionToken } from "@/lib/session";
import { registerUser } from "@/services/userService";

const bodySchema = z
  .object({
    email: z.string().min(1).email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "As senhas devem coincidir",
    path: ["confirmPassword"],
  });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bodySchema.parse(body);

    // Normalizar email
    const email = String(parsed.email).trim().toLowerCase();

    const result = await registerUser(email, parsed.password);

    if (!result.ok) {
      // Field errors (validation / conflicts) -> 409 Conflict
      const status = result.fieldErrors ? 409 : 500;
      return NextResponse.json(
        {
          success: false,
          message: result.error,
          fieldErrors: result.fieldErrors,
        },
        { status },
      );
    }

    // create session cookie on successful registration (auto-login)
    const token = createSessionToken({
      id: result.user?.id,
      email: result.user?.email,
    });
    const setCookie = buildSetCookieHeader(token);

    return NextResponse.json(
      { success: true, message: "Conta criada com sucesso", user: result.user },
      { status: 201, headers: { "Set-Cookie": setCookie } },
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
