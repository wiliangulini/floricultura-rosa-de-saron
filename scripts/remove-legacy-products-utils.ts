export const LEGACY_DEMO_PRODUCT_SLUGS = [
  "arranjo-de-flores-do-campo",
  "buque-de-rosas-vermelhas",
  "cesta-especial-com-flores",
  "orquidea-presenteavel",
] as const;

export function shouldApplyLegacyProductRemoval(args: string[]): boolean {
  const unknownArgs = args.filter((arg) => arg !== "--apply");

  if (unknownArgs.length > 0) {
    throw new Error(`Argumento não reconhecido: ${unknownArgs.join(", ")}`);
  }

  return args.includes("--apply");
}

export function getLegacyProductSlugsToRemove(existingSlugs: readonly string[]): string[] {
  const legacySlugs = new Set<string>(LEGACY_DEMO_PRODUCT_SLUGS);

  return existingSlugs.filter((slug) => legacySlugs.has(slug));
}

