import { createHash, randomBytes } from "crypto";

export const PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES = 30;

export function createPasswordResetToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashPasswordResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createPasswordResetTokenExpiresAt(now = new Date()): Date {
  return new Date(now.getTime() + PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000);
}
