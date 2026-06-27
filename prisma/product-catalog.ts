export type ProductCatalogImage = {
  altText: string;
  isMain: boolean;
  sortOrder: number;
  sourcePath: string;
};

export type ProductCatalogItem = {
  categorySlug: "buques" | "flores-naturais" | "folhagens" | "orquideas";
  description: string;
  images: readonly ProductCatalogImage[];
  name: string;
  price: string;
  seoDescription: string;
  seoTitle: string;
  shortDescription: string;
  slug: string;
};

const imageRoot = "src/assets/images/Categorias";

function productImage(
  sourcePath: string,
  altText: string,
  sortOrder = 0,
): ProductCatalogImage {
  return {
    altText,
    isMain: sortOrder === 0,
    sortOrder,
    sourcePath: `${imageRoot}/${sourcePath}`,
  };
}

export const productCatalog = [
  {
    name: "Buquê 6 Rosas Vermelhas",
    slug: "buque-6-rosas-vermelhas",
    categorySlug: "buques",
    price: "158.00",
    shortDescription: "Buquê preparado com seis rosas vermelhas.",
    description: "Buquê com seis rosas vermelhas para presentear em ocasiões especiais.",
    seoTitle: "Buquê com 6 Rosas Vermelhas em Coronel Vivida | Floricultura",
    seoDescription: "Buquê com seis rosas vermelhas disponível em Coronel Vivida.",
    images: [
      productImage(
        "Buquês/buque-6-rosas-vermelhas-158.jpeg",
        "Buquê com seis rosas vermelhas",
      ),
      productImage(
        "Buquês/buque-6-rosas-vermelhas-158(1).jpeg",
        "Buquê com seis rosas vermelhas em outra perspectiva",
        1,
      ),
    ],
  },
  {
    name: "Buquê de Astromélias Rosas",
    slug: "buque-de-astromelias-rosas",
    categorySlug: "buques",
    price: "178.00",
    shortDescription: "Buquê preparado com astromélias rosas.",
    description: "Buquê de astromélias rosas para presentear em diferentes ocasiões.",
    seoTitle: "Buquê de Astromélias Rosas em Coronel Vivida | Floricultura",
    seoDescription: "Buquê de astromélias rosas disponível em Coronel Vivida.",
    images: [
      productImage(
        "Buquês/buque-de-astromelias-rosas-178.jpeg",
        "Buquê de astromélias rosas",
      ),
    ],
  },
  {
    name: "Buquê de Lírio",
    slug: "buque-de-lirio",
    categorySlug: "buques",
    price: "148.00",
    shortDescription: "Buquê preparado com lírio.",
    description: "Buquê de lírio para presentear em ocasiões especiais.",
    seoTitle: "Buquê de Lírio em Coronel Vivida | Floricultura",
    seoDescription: "Buquê de lírio disponível em Coronel Vivida.",
    images: [productImage("Buquês/buque-de-lirio-148.jpeg", "Buquê de lírio")],
  },
  {
    name: "Buquê Impacto",
    slug: "buque-impacto",
    categorySlug: "buques",
    price: "138.00",
    shortDescription: "Buquê Impacto para presentear.",
    description: "Buquê Impacto preparado para presentear em diferentes ocasiões.",
    seoTitle: "Buquê Impacto em Coronel Vivida | Floricultura",
    seoDescription: "Buquê Impacto disponível em Coronel Vivida.",
    images: [productImage("Buquês/buque-inpacto-138.jpeg", "Buquê Impacto")],
  },
  {
    name: "Antúrio",
    slug: "anturio-75",
    categorySlug: "flores-naturais",
    price: "75.00",
    shortDescription: "Antúrio natural para presentear ou decorar.",
    description: "Antúrio natural indicado para presentear e decorar ambientes.",
    seoTitle: "Antúrio em Coronel Vivida | Floricultura",
    seoDescription: "Antúrio natural disponível em Coronel Vivida.",
    images: [productImage("Flores naturais/anturio-75.jpeg", "Antúrio natural")],
  },
  {
    name: "Antúrio com Cachepô",
    slug: "anturio-com-cachepo-95",
    categorySlug: "flores-naturais",
    price: "95.00",
    shortDescription: "Antúrio natural apresentado com cachepô.",
    description: "Antúrio natural com cachepô para presentear ou decorar ambientes.",
    seoTitle: "Antúrio com Cachepô em Coronel Vivida | Floricultura",
    seoDescription: "Antúrio natural com cachepô disponível em Coronel Vivida.",
    images: [
      productImage(
        "Flores naturais/anturio-com-cachepo-95.jpeg",
        "Antúrio natural com cachepô",
      ),
    ],
  },
  {
    name: "Antúrio sem Cachepô",
    slug: "anturio-sem-cachepo-45",
    categorySlug: "flores-naturais",
    price: "45.00",
    shortDescription: "Antúrio natural sem cachepô.",
    description: "Antúrio natural na opção sem cachepô.",
    seoTitle: "Antúrio sem Cachepô em Coronel Vivida | Floricultura",
    seoDescription: "Antúrio natural sem cachepô disponível em Coronel Vivida.",
    images: [
      productImage(
        "Flores naturais/anturios-sem-cachepo-45-com-cachepo-65.jpeg",
        "Antúrios naturais disponíveis sem cachepô",
      ),
    ],
  },
  {
    name: "Antúrio com Cachepô",
    slug: "anturio-com-cachepo-65",
    categorySlug: "flores-naturais",
    price: "65.00",
    shortDescription: "Antúrio natural apresentado com cachepô.",
    description: "Antúrio natural na opção com cachepô.",
    seoTitle: "Antúrio com Cachepô em Coronel Vivida | Floricultura",
    seoDescription: "Antúrio natural com cachepô disponível em Coronel Vivida.",
    images: [
      productImage(
        "Flores naturais/anturios-sem-cachepo-45-com-cachepo-65.jpeg",
        "Antúrios naturais disponíveis com cachepô",
      ),
    ],
  },
  {
    name: "Begônia",
    slug: "begonia-75",
    categorySlug: "flores-naturais",
    price: "75.00",
    shortDescription: "Begônia natural para presentear ou decorar.",
    description: "Begônia natural indicada para presentear e decorar ambientes.",
    seoTitle: "Begônia em Coronel Vivida | Floricultura",
    seoDescription: "Begônia natural disponível em Coronel Vivida.",
    images: [productImage("Flores naturais/begonia-75.jpeg", "Begônia natural")],
  },
  {
    name: "Calandiva com Cachepô",
    slug: "calandiva-com-cachepo-29",
    categorySlug: "flores-naturais",
    price: "29.00",
    shortDescription: "Calandiva natural apresentada com cachepô.",
    description: "Calandiva natural com cachepô para presentear ou decorar.",
    seoTitle: "Calandiva com Cachepô em Coronel Vivida | Floricultura",
    seoDescription: "Calandiva natural com cachepô disponível em Coronel Vivida.",
    images: [
      productImage(
        "Flores naturais/calandiva-com-cachepo-29.jpeg",
        "Calandiva natural com cachepô",
      ),
    ],
  },
  {
    name: "Calandiva com Cachepô",
    slug: "calandiva-com-cachepo-60",
    categorySlug: "flores-naturais",
    price: "60.00",
    shortDescription: "Calandiva natural apresentada com cachepô.",
    description: "Calandiva natural com cachepô para presentear ou decorar.",
    seoTitle: "Calandiva com Cachepô em Coronel Vivida | Floricultura",
    seoDescription: "Calandiva natural com cachepô disponível em Coronel Vivida.",
    images: [
      productImage(
        "Flores naturais/calandiva-com-cachepo-60.jpeg",
        "Calandiva natural com cachepô",
      ),
    ],
  },
  {
    name: "Aglaonema",
    slug: "aglaonema-45",
    categorySlug: "folhagens",
    price: "45.00",
    shortDescription: "Aglaonema natural para decorar ambientes.",
    description: "Aglaonema natural indicada para trazer verde aos ambientes.",
    seoTitle: "Aglaonema em Coronel Vivida | Floricultura",
    seoDescription: "Aglaonema natural disponível em Coronel Vivida.",
    images: [productImage("Folhagens/aglonema-45.jpeg", "Aglaonema natural")],
  },
  {
    name: "Bambu da Sorte",
    slug: "bambu-da-sorte-168",
    categorySlug: "folhagens",
    price: "168.00",
    shortDescription: "Bambu da sorte para presentear ou decorar.",
    description: "Bambu da sorte preparado para presentear e decorar ambientes.",
    seoTitle: "Bambu da Sorte em Coronel Vivida | Floricultura",
    seoDescription: "Bambu da sorte disponível em Coronel Vivida.",
    images: [
      productImage("Folhagens/bambu-da-sorte-168.jpeg", "Bambu da sorte"),
      productImage(
        "Folhagens/bambu-da-sorte-168-1.jpeg",
        "Bambu da sorte em outra perspectiva",
        1,
      ),
      productImage(
        "Folhagens/bambu-da-sorte-168-2.jpeg",
        "Bambu da sorte em outra perspectiva",
        2,
      ),
    ],
  },
  {
    name: "Bambu da Sorte",
    slug: "bambu-da-sorte-188",
    categorySlug: "folhagens",
    price: "188.00",
    shortDescription: "Bambu da sorte para presentear ou decorar.",
    description: "Bambu da sorte preparado para presentear e decorar ambientes.",
    seoTitle: "Bambu da Sorte em Coronel Vivida | Floricultura",
    seoDescription: "Bambu da sorte disponível em Coronel Vivida.",
    images: [productImage("Folhagens/bambu-da-sorte-188.jpeg", "Bambu da sorte")],
  },
  {
    name: "Calateia",
    slug: "calateia-45",
    categorySlug: "folhagens",
    price: "45.00",
    shortDescription: "Calateia natural para decorar ambientes.",
    description: "Calateia natural indicada para trazer verde aos ambientes.",
    seoTitle: "Calateia em Coronel Vivida | Floricultura",
    seoDescription: "Calateia natural disponível em Coronel Vivida.",
    images: [productImage("Folhagens/cataleia-45.jpeg", "Calateia natural")],
  },
  {
    name: "Orquídea Phap",
    slug: "orquidea-phap-75",
    categorySlug: "orquideas",
    price: "75.00",
    shortDescription: "Orquídea Phap para presentear ou decorar.",
    description: "Orquídea Phap indicada para presentear e decorar ambientes.",
    seoTitle: "Orquídea Phap em Coronel Vivida | Floricultura",
    seoDescription: "Orquídea Phap disponível em Coronel Vivida.",
    images: [productImage("Orquídeas/Oquideas-phap-75.jpeg", "Orquídea Phap")],
  },
  {
    name: "Orquídea e Cymbidium",
    slug: "orquidea-e-cymbidium-110",
    categorySlug: "orquideas",
    price: "110.00",
    shortDescription: "Orquídea e Cymbidium para presentear ou decorar.",
    description: "Orquídea e Cymbidium indicados para presentear e decorar ambientes.",
    seoTitle: "Orquídea e Cymbidium em Coronel Vivida | Floricultura",
    seoDescription: "Orquídea e Cymbidium disponíveis em Coronel Vivida.",
    images: [
      productImage(
        "Orquídeas/orquidea-e-cymbidium-110.jpeg",
        "Orquídea e Cymbidium",
      ),
    ],
  },
  {
    name: "Orquídea e Cymbidium",
    slug: "orquidea-e-cymbidium-89",
    categorySlug: "orquideas",
    price: "89.00",
    shortDescription: "Orquídea e Cymbidium para presentear ou decorar.",
    description: "Orquídea e Cymbidium indicados para presentear e decorar ambientes.",
    seoTitle: "Orquídea e Cymbidium em Coronel Vivida | Floricultura",
    seoDescription: "Orquídea e Cymbidium disponíveis em Coronel Vivida.",
    images: [
      productImage(
        "Orquídeas/orquidea-e-cymbidium-89.jpeg",
        "Orquídea e Cymbidium",
      ),
      productImage(
        "Orquídeas/orquidea-e-cymbidium-89-1.jpeg",
        "Orquídea e Cymbidium em outra perspectiva",
        1,
      ),
    ],
  },
  {
    name: "Orquídea Phap Cascata",
    slug: "orquidea-phap-cascata-110",
    categorySlug: "orquideas",
    price: "110.00",
    shortDescription: "Orquídea Phap em cascata para presentear ou decorar.",
    description: "Orquídea Phap em cascata indicada para presentear e decorar ambientes.",
    seoTitle: "Orquídea Phap Cascata em Coronel Vivida | Floricultura",
    seoDescription: "Orquídea Phap em cascata disponível em Coronel Vivida.",
    images: [
      productImage(
        "Orquídeas/orquidea-phap-cascata-110.jpeg",
        "Orquídea Phap em cascata",
      ),
      productImage(
        "Orquídeas/orquidea-phap-cascata-110-1.jpeg",
        "Orquídea Phap em cascata em outra perspectiva",
        1,
      ),
    ],
  },
] as const satisfies readonly ProductCatalogItem[];

export function getCatalogImageId(productSlug: string, sortOrder: number): string {
  return `catalog-${productSlug}-image-${sortOrder}`;
}

export const productCatalogImageRecords = productCatalog.flatMap((product) =>
  product.images.map((image) => ({
    ...image,
    id: getCatalogImageId(product.slug, image.sortOrder),
    productSlug: product.slug,
  })),
);
