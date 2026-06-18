import nodemailer from "nodemailer";

type PasswordResetEmailInput = {
  expiresInMinutes: number;
  resetUrl: string;
  to: string;
};

type PasswordResetEmailContent = Omit<PasswordResetEmailInput, "to">;

type SmtpConfig = {
  from: string;
  host: string;
  pass: string;
  port: number;
  user: string;
};

export type EmailDeliveryErrorDetails = {
  code?: string;
  command?: string;
  responseCode?: number;
};

export type SmtpDiagnostics = {
  configured: {
    from: boolean;
    host: boolean;
    pass: boolean;
    port: boolean;
    user: boolean;
  };
  host?: string;
  port?: number;
  secure: boolean;
};

export class EmailConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EmailConfigurationError";
  }
}

export class EmailDeliveryError extends Error {
  cause?: unknown;
  details: EmailDeliveryErrorDetails;

  constructor(
    message: string,
    options: { cause?: unknown; details?: EmailDeliveryErrorDetails } = {},
  ) {
    super(message);
    this.name = "EmailDeliveryError";
    this.cause = options.cause;
    this.details = options.details ?? {};
  }
}

export async function sendPasswordResetEmail({
  expiresInMinutes,
  resetUrl,
  to,
}: PasswordResetEmailInput): Promise<void> {
  const config = getSmtpConfig();
  const transporter = nodemailer.createTransport({
    auth: {
      pass: config.pass,
      user: config.user,
    },
    host: config.host,
    port: config.port,
    secure: config.port === 465,
  });

  try {
    await transporter.sendMail({
      from: config.from,
      html: createPasswordResetHtml({ expiresInMinutes, resetUrl }),
      subject: "Redefinição de senha do painel",
      text: createPasswordResetText({ expiresInMinutes, resetUrl }),
      to,
    });
  } catch (error) {
    throw new EmailDeliveryError("Não foi possível enviar o email de redefinição de senha.", {
      cause: error,
      details: getEmailDeliveryErrorDetails(error),
    });
  }
}

export function getSmtpDiagnostics(): SmtpDiagnostics {
  const host = process.env.SMTP_HOST?.trim();
  const portValue = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim();
  const port = portValue ? Number(portValue) : NaN;
  const isValidPort = Number.isInteger(port) && port > 0 && port <= 65535;

  return {
    configured: {
      from: Boolean(from),
      host: Boolean(host),
      pass: Boolean(pass),
      port: Boolean(portValue && isValidPort),
      user: Boolean(user),
    },
    host: host || undefined,
    port: isValidPort ? port : undefined,
    secure: port === 465,
  };
}

function getSmtpConfig(): SmtpConfig {
  const host = process.env.SMTP_HOST?.trim();
  const portValue = process.env.SMTP_PORT?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from = process.env.SMTP_FROM?.trim();
  const port = portValue ? Number(portValue) : NaN;

  if (!host || !portValue || !Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new EmailConfigurationError("Configuração SMTP incompleta ou inválida.");
  }

  if (!user || !pass || !from) {
    throw new EmailConfigurationError("Configuração SMTP incompleta ou inválida.");
  }

  return {
    from,
    host,
    pass,
    port,
    user,
  };
}

function createPasswordResetText({
  expiresInMinutes,
  resetUrl,
}: PasswordResetEmailContent): string {
  return [
    "Recebemos uma solicitação para redefinir a senha do painel administrativo.",
    "",
    `Acesse o link abaixo para continuar. Ele expira em ${expiresInMinutes} minutos:`,
    resetUrl,
    "",
    "Se você não solicitou a redefinição, ignore este email.",
  ].join("\n");
}

function createPasswordResetHtml({
  expiresInMinutes,
  resetUrl,
}: PasswordResetEmailContent): string {
  return [
    "<p>Recebemos uma solicitação para redefinir a senha do painel administrativo.</p>",
    `<p>Acesse o link abaixo para continuar. Ele expira em ${expiresInMinutes} minutos:</p>`,
    `<p><a href="${escapeHtml(resetUrl)}">Redefinir senha</a></p>`,
    "<p>Se você não solicitou a redefinição, ignore este email.</p>",
  ].join("");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getEmailDeliveryErrorDetails(error: unknown): EmailDeliveryErrorDetails {
  if (!isRecord(error)) {
    return {};
  }

  const details: EmailDeliveryErrorDetails = {};

  if (typeof error.code === "string") {
    details.code = error.code;
  }

  if (typeof error.command === "string") {
    details.command = error.command;
  }

  if (typeof error.responseCode === "number") {
    details.responseCode = error.responseCode;
  }

  return details;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
