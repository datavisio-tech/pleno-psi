import { NextResponse } from "next/server";
import { z } from "zod";
import { loginUser } from "@/services/userService";
import { createSessionToken, buildSetCookieHeader } from "@/lib/session";

const bodySchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = bodySchema.parse(body);

    const result = await loginUser(parsed.email, parsed.password);

    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 401 },
      );
    }

    // create session token and set HttpOnly cookie
    const token = createSessionToken({
      id: result.user?.id,
      email: result.user?.email,
    });
    const setCookie = buildSetCookieHeader(token);

    return NextResponse.json(
      { success: true, message: "Autenticado", user: result.user },
      { status: 200, headers: { "Set-Cookie": setCookie } },
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
