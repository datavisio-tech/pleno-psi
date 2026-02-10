import { NextResponse } from "next/server";
import { getUserProfile } from "@/services/userService";
import { verifySessionToken } from "@/lib/session";

function parseCookies(cookieHeader?: string | null) {
  if (!cookieHeader) return {} as Record<string, string>;
  return Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, ...v] = c.trim().split("=");
      return [k, decodeURIComponent(v.join("="))];
    }),
  );
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const emailParam = url.searchParams.get("email") || undefined;
    const idParam = url.searchParams.get("id") || undefined;

    // Try cookie-based session first
    const cookieHeader = req.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const token = cookies["pleno.sid"];

    let email: string | undefined = undefined;
    let id: string | undefined = undefined;

    if (token) {
      const payload = verifySessionToken(token);
      if (payload) {
        email = payload.email || undefined;
        id = payload.id || undefined;
      }
    }

    // fallback to query params for compatibility
    if (!email && !id) {
      email = emailParam;
      id = idParam;
    }

    if (!email && !id) {
      return NextResponse.json(
        { success: false, message: "email or id required" },
        { status: 400 },
      );
    }

    const result = await getUserProfile({ id, email });
    if (!result.ok) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      user: result.user,
      needsProfileCompletion: result.needsProfileCompletion,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Erro interno" },
      { status: 500 },
    );
  }
}
