import { NextResponse } from "next/server";
import { buildClearCookieHeader } from "@/lib/session";

export async function POST() {
  const setCookie = buildClearCookieHeader();
  return NextResponse.json(
    { success: true, message: "Session cookie cleared" },
    { status: 200, headers: { "Set-Cookie": setCookie } },
  );
}

export async function GET() {
  const setCookie = buildClearCookieHeader();
  return NextResponse.json(
    { success: true, message: "Session cookie cleared" },
    { status: 200, headers: { "Set-Cookie": setCookie } },
  );
}
