// Lightweight single-admin session, signed with ADMIN_PASSWORD so the
// secret never has to be stored anywhere but the one env var.
// Uses Web Crypto (available in both the Node and Edge runtimes) so this
// file works from middleware.js as well as from route handlers.

export const ADMIN_COOKIE = "gg_admin_session";

async function hmac(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Buffer.from(sig).toString("hex");
}

// Token = "<expiry>.<hmac(expiry, ADMIN_PASSWORD)>". Stateless, no DB needed.
export async function createAdminToken() {
  const secret = process.env.ADMIN_PASSWORD || "";
  const expiry = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const sig = await hmac(secret, String(expiry));
  return `${expiry}.${sig}`;
}

export async function verifyAdminToken(token) {
  if (!token) return false;
  const secret = process.env.ADMIN_PASSWORD || "";
  if (!secret) return false;
  const [expiry, sig] = token.split(".");
  if (!expiry || !sig) return false;
  if (Number(expiry) < Date.now()) return false;
  const expected = await hmac(secret, expiry);
  return expected === sig;
}
