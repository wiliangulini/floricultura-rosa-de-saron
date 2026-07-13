const BRAZIL_COUNTRY_CODE = "55";

/**
 * Formata um telefone brasileiro para exibição, ex.: "5546999197294" →
 * "(46) 99919-7294". O valor de negócio (dígitos para tel:/wa.me) não muda;
 * apenas a apresentação. Retorna o valor original quando não reconhecido.
 */
export function formatPhoneForDisplay(value: string | null | undefined): string | null {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  const digits = trimmedValue.replace(/\D/g, "");

  if (!digits) {
    return trimmedValue;
  }

  const localDigits =
    digits.startsWith(BRAZIL_COUNTRY_CODE) && digits.length >= 12
      ? digits.slice(BRAZIL_COUNTRY_CODE.length)
      : digits;

  if (localDigits.length === 11) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 7)}-${localDigits.slice(7)}`;
  }

  if (localDigits.length === 10) {
    return `(${localDigits.slice(0, 2)}) ${localDigits.slice(2, 6)}-${localDigits.slice(6)}`;
  }

  return trimmedValue;
}
