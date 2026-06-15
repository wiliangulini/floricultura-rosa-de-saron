import { createHash, randomBytes } from "crypto";

export const PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES = 30;

const PASSWORD_RESET_TOKEN_PATTERN = /^[A-Za-z0-9_-]{43}$/;

export function createPasswordResetToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashPasswordResetToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function isPasswordResetTokenFormatValid(token: string): boolean {
  return PASSWORD_RESET_TOKEN_PATTERN.test(token);
}

export function createPasswordResetTokenExpiresAt(now = new Date()): Date {
  return new Date(now.getTime() + PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000);
}
