import { describe, expect, it } from "vitest";

import {
  createPasswordResetToken,
  createPasswordResetTokenExpiresAt,
  hashPasswordResetToken,
  isPasswordResetTokenFormatValid,
  PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES,
} from "@/lib/password-reset";

describe("password reset helpers", () => {
  it("gera token base64url com 32 bytes de entropia", () => {
    const token = createPasswordResetToken();

    expect(token).toHaveLength(43);
    expect(isPasswordResetTokenFormatValid(token)).toBe(true);
    expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("gera tokens diferentes a cada chamada", () => {
    expect(createPasswordResetToken()).not.toBe(createPasswordResetToken());
  });

  it("gera hash SHA-256 determinístico sem expor o token puro", () => {
    const token = "abcdefghijklmnopqrstuvwxyzABCDE0123456789_-abc";
    const tokenHash = hashPasswordResetToken(token);

    expect(tokenHash).toHaveLength(64);
    expect(tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(tokenHash).not.toBe(token);
    expect(hashPasswordResetToken(token)).toBe(tokenHash);
  });

  it("valida somente tokens no formato esperado", () => {
    expect(isPasswordResetTokenFormatValid("a".repeat(43))).toBe(true);
    expect(isPasswordResetTokenFormatValid("a".repeat(42))).toBe(false);
    expect(isPasswordResetTokenFormatValid("a".repeat(44))).toBe(false);
    expect(isPasswordResetTokenFormatValid("a".repeat(42) + "=")).toBe(false);
    expect(isPasswordResetTokenFormatValid("a".repeat(42) + "+")).toBe(false);
  });

  it("calcula expiração em 30 minutos", () => {
    const now = new Date("2026-06-15T12:00:00.000Z");
    const expiresAt = createPasswordResetTokenExpiresAt(now);

    expect(expiresAt.getTime() - now.getTime()).toBe(
      PASSWORD_RESET_TOKEN_EXPIRES_IN_MINUTES * 60 * 1000,
    );
  });
});
