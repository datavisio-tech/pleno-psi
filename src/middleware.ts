import { getSessionCookie } from "better-auth/cookies";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function getOrCreateCorrelationId(req: NextRequest) {
  const header = req.headers.get("x-correlation-id");
  if (header) return header;
  try {
    // node 18+ / edge may support crypto
    // fallback to random string

    const { randomUUID } = require("crypto");
    return randomUUID();
  } catch (e) {
    return String(Math.floor(Math.random() * 1_000_000_000));
  }
}

export function middleware(request: NextRequest) {
  const correlationId = getOrCreateCorrelationId(request);
  // Allow public routes (authentication, auth API, next internals, favicon)
  const publicRoutes = [
    "/authentication",
    "/api/auth",
    "/_next",
    "/favicon.ico",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  if (isPublicRoute) {
    const res = NextResponse.next();
    res.headers.set("x-correlation-id", correlationId);
    return res;
  }
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    const res = NextResponse.redirect(new URL("/authentication", request.url));
    res.headers.set("x-correlation-id", correlationId);
    return res;
  }
  const res = NextResponse.next();
  res.headers.set("x-correlation-id", correlationId);
  return res;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/dashboard",
    "/patients",
    "/doctors",
    "/appointments",
    "/subscription",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
