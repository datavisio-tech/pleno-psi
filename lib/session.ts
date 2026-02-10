import crypto from "crypto";

const SECRET =
  process.env.SESSION_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "dev-secret-change-me";
const TOKEN_TTL = 60 * 60 * 24 * 7; // 7 days

function base64UrlEncode(buf: Buffer) {
  return buf
    .toString("base64")
    .replace(/=+$/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return Buffer.from(str, "base64");
}

export function createSessionToken(payload: Record<string, any>) {
  const data = { ...payload, iat: Math.floor(Date.now() / 1000) };
  const json = JSON.stringify(data);
  const payloadB = Buffer.from(json, "utf8");
  const payloadBase = base64UrlEncode(payloadB);
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payloadBase)
    .digest("hex");
  return `${payloadBase}.${sig}`;
}

export function verifySessionToken(token: string) {
  try {
    const [payloadBase, sig] = token.split(".");
    if (!payloadBase || !sig) return null;
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payloadBase)
      .digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig)))
      return null;
    const payloadBuf = base64UrlDecode(payloadBase);
    const data = JSON.parse(payloadBuf.toString("utf8"));
    // optional: check expiry (iat + TTL)
    if (data.iat && Number.isFinite(data.iat)) {
      const age = Math.floor(Date.now() / 1000) - Number(data.iat);
      if (age > TOKEN_TTL) return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

export function buildSetCookieHeader(token: string) {
  const secure = process.env.NODE_ENV === "production";
  const maxAge = TOKEN_TTL;
  const parts = [
    `pleno.sid=${token}`,
    `HttpOnly`,
    `Path=/`,
    `Max-Age=${maxAge}`,
    `SameSite=Lax`,
  ];
  if (secure) parts.push("Secure");
  return parts.join("; ");
}

export function buildClearCookieHeader() {
  return `pleno.sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}
