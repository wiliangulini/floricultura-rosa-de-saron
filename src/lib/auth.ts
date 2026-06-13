export const ADMIN_SESSION_COOKIE = "floricultura_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const ADMIN_SESSION_DURATION_MS = ADMIN_SESSION_MAX_AGE_SECONDS * 1000;
const AUTH_SECRET_MIN_LENGTH = 32;
const SESSION_VERSION = 1;
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

type AdminSessionRole = "ADMIN";

type AdminSessionPayload = {
  email: string;
  expiresAt: number;
  issuedAt: number;
  lastActivityAt: number;
  role: AdminSessionRole;
  userId: string;
  version: typeof SESSION_VERSION;
};

export type AdminSession = {
  email: string;
  expiresAt: Date;
  issuedAt: Date;
  lastActivityAt: Date;
  userId: string;
};

export class AuthConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthConfigurationError";
  }
}

export function getAdminSessionCookieOptions(maxAge = ADMIN_SESSION_MAX_AGE_SECONDS) {
  return {
    httpOnly: true,
    maxAge,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}

export function getExpiredAdminSessionCookieOptions() {
  return {
    ...getAdminSessionCookieOptions(0),
    expires: new Date(0),
  };
}

export async function createAdminSessionCookie(
  user: Pick<AdminSession, "email" | "userId">,
  now = Date.now(),
  issuedAt = now,
) {
  const payload: AdminSessionPayload = {
    email: user.email,
    expiresAt: now + ADMIN_SESSION_DURATION_MS,
    issuedAt,
    lastActivityAt: now,
    role: "ADMIN",
    userId: user.userId,
    version: SESSION_VERSION,
  };

  return signSessionPayload(payload);
}

export async function refreshAdminSessionCookie(session: AdminSession, now = Date.now()) {
  return createAdminSessionCookie(
    {
      email: session.email,
      userId: session.userId,
    },
    now,
    session.issuedAt.getTime(),
  );
}

export async function readAdminSessionCookie(cookieValue: string | undefined) {
  if (!cookieValue) {
    return null;
  }

  const sessionParts = cookieValue.split(".");

  if (sessionParts.length !== 2) {
    return null;
  }

  const [encodedPayload, signature] = sessionParts;

  if (!encodedPayload || !signature) {
    return null;
  }

  try {
    const expectedSignature = await createSignature(encodedPayload);

    if (!timingSafeEqual(signature, expectedSignature)) {
      return null;
    }

    const payload = parseSessionPayload(encodedPayload);

    if (!payload || payload.expiresAt <= Date.now()) {
      return null;
    }

    return {
      email: payload.email,
      expiresAt: new Date(payload.expiresAt),
      issuedAt: new Date(payload.issuedAt),
      lastActivityAt: new Date(payload.lastActivityAt),
      userId: payload.userId,
    };
  } catch {
    return null;
  }
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret || secret.length < AUTH_SECRET_MIN_LENGTH) {
    throw new AuthConfigurationError(
      "AUTH_SECRET deve ter pelo menos 32 caracteres para assinar a sessão administrativa.",
    );
  }

  return secret;
}

async function signSessionPayload(payload: AdminSessionPayload) {
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signature = await createSignature(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

async function createSignature(value: string) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    textEncoder.encode(getAuthSecret()),
    {
      hash: "SHA-256",
      name: "HMAC",
    },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, textEncoder.encode(value));

  return bytesToBase64Url(new Uint8Array(signature));
}

function parseSessionPayload(encodedPayload: string) {
  const parsedValue: unknown = JSON.parse(decodeBase64Url(encodedPayload));

  if (!isAdminSessionPayload(parsedValue)) {
    return null;
  }

  return parsedValue;
}

function isAdminSessionPayload(value: unknown): value is AdminSessionPayload {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.version === SESSION_VERSION &&
    value.role === "ADMIN" &&
    typeof value.userId === "string" &&
    value.userId.length > 0 &&
    typeof value.email === "string" &&
    value.email.length > 0 &&
    typeof value.issuedAt === "number" &&
    Number.isFinite(value.issuedAt) &&
    typeof value.lastActivityAt === "number" &&
    Number.isFinite(value.lastActivityAt) &&
    typeof value.expiresAt === "number" &&
    Number.isFinite(value.expiresAt) &&
    value.expiresAt > value.lastActivityAt &&
    value.lastActivityAt >= value.issuedAt
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function encodeBase64Url(value: string) {
  return bytesToBase64Url(textEncoder.encode(value));
}

function decodeBase64Url(value: string) {
  const base64 = value.replaceAll("-", "+").replaceAll("_", "/");
  const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  const binaryValue = atob(paddedBase64);
  const bytes = new Uint8Array(binaryValue.length);

  for (let index = 0; index < binaryValue.length; index += 1) {
    bytes[index] = binaryValue.charCodeAt(index);
  }

  return textDecoder.decode(bytes);
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binaryValue = "";

  for (let index = 0; index < bytes.length; index += 1) {
    binaryValue += String.fromCharCode(bytes[index]);
  }

  return btoa(binaryValue).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function timingSafeEqual(value: string, expectedValue: string) {
  if (value.length !== expectedValue.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < value.length; index += 1) {
    result |= value.charCodeAt(index) ^ expectedValue.charCodeAt(index);
  }

  return result === 0;
}
