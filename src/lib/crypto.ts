import "server-only";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * AES-256-GCM vault for sensitive values (game logins, license keys).
 * Format: base64(iv[12] | tag[16] | ciphertext)
 */
function key() {
  const raw = process.env.VAULT_KEY || "globalpool-default-vault-encryption-key-2026";
  // Normalise any provided secret to 32 bytes.
  return createHash("sha256").update(raw).digest();
}

export function encrypt(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64");
}

export function decrypt(payload: string): string {
  const buf = Buffer.from(payload, "base64");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

export function randomCode(len = 6) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(len);
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}

export const newTrackingId = () => `GPS-${randomCode(6)}`;
export const newReferralCode = () => randomCode(8);
