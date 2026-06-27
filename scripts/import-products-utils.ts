type CatalogImageReference = {
  id: string;
  sourcePath: string;
};

type ExistingImageReference = {
  id: string;
  url: string;
};

export function shouldApplyProductImport(args: string[]): boolean {
  const unknownArgs = args.filter((arg) => arg !== "--apply");

  if (unknownArgs.length > 0) {
    throw new Error(`Argumento não reconhecido: ${unknownArgs.join(", ")}`);
  }

  return args.includes("--apply");
}

export function buildExistingUrlBySource(
  catalogImages: readonly CatalogImageReference[],
  existingImages: readonly ExistingImageReference[],
): Map<string, string> {
  const sourceById = new Map(catalogImages.map((image) => [image.id, image.sourcePath]));
  const urlBySource = new Map<string, string>();

  for (const image of existingImages) {
    const sourcePath = sourceById.get(image.id);

    if (!sourcePath) {
      continue;
    }

    const existingUrl = urlBySource.get(sourcePath);

    if (existingUrl && existingUrl !== image.url) {
      throw new Error(
        `O arquivo ${sourcePath} possui URLs divergentes nos registros gerenciados pelo importador.`,
      );
    }

    urlBySource.set(sourcePath, image.url);
  }

  return urlBySource;
}

export function getSourcesRequiringUpload(
  catalogImages: readonly CatalogImageReference[],
  existingImages: readonly ExistingImageReference[],
): string[] {
  const existingUrlBySource = buildExistingUrlBySource(catalogImages, existingImages);

  return [
    ...new Set(
      catalogImages
        .map((image) => image.sourcePath)
        .filter((sourcePath) => !existingUrlBySource.has(sourcePath)),
    ),
  ];
}

export function normalizeCatalogPrice(value: { toString(): string } | null): string | null {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value.toString());

  return Number.isFinite(parsedValue) ? parsedValue.toFixed(2) : null;
}
