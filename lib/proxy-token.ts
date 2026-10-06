import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

// Proxy URLs carry the upstream image address encrypted (AES-256-GCM), so the
// source isn't visible in the page, and the proxy only fetches addresses this
// server issued. A token also carries its expiry, so a copied link stops
// working after a while (the platforms' own signed URLs expire anyway). The key comes from PROXY_SECRET; it must be the same on every
// server instance, so set it in production.

let warned = false;

function key(): Buffer {
  const secret = process.env.PROXY_SECRET;
  if (secret) return createHash("sha256").update(secret).digest();
  if (!warned) {
    warned = true;
    console.warn("[proxy] PROXY_SECRET is not set; using a per-process key (links break across instances)");
  }
  return fallbackKey;
}

const fallbackKey = randomBytes(32);

/** How long a proxy link stays valid. */
export const TOKEN_TTL_SECONDS = 2 * 60 * 60;

export function sealUrl(url: string, now = Date.now()): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  // "<expiry in unix seconds>\n<url>"; URLs never contain a newline.
  const payload = `${Math.floor(now / 1000) + TOKEN_TTL_SECONDS}\n${url}`;
  const body = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  return Buffer.concat([iv, body, cipher.getAuthTag()]).toString("base64url");
}

/** The original URL, or null when the token is malformed, tampered with, from another key or expired. */
export function openUrl(token: string, now = Date.now()): string | null {
  try {
    const data = Buffer.from(token, "base64url");
    if (data.length < 12 + 16 + 1) return null;
    const decipher = createDecipheriv("aes-256-gcm", key(), data.subarray(0, 12));
    decipher.setAuthTag(data.subarray(data.length - 16));
    const payload = Buffer.concat([decipher.update(data.subarray(12, data.length - 16)), decipher.final()]).toString("utf8");
    const split = payload.indexOf("\n");
    const expiresAt = Number(payload.slice(0, split));
    if (split < 1 || !Number.isInteger(expiresAt) || expiresAt * 1000 <= now) return null;
    return payload.slice(split + 1);
  } catch {
    return null;
  }
}
