export type CategoryCatalogItem = {
  description: string;
  name: string;
  slug: string;
  sortOrder: number;
};

export const categoryCatalog = [
  {
    name: "Buquês",
    slug: "buques",
    sortOrder: 1,
    description:
      "Buquês delicados e especiais, preparados para transmitir carinho, amor, gratidão e celebração em cada detalhe. Nesta categoria você encontra opções encantadoras para presentear em aniversários, datas românticas, homenagens e momentos inesquecíveis.",
  },
  {
    name: "Flores naturais",
    slug: "flores-naturais",
    sortOrder: 2,
    description:
      "Flores naturais frescas e selecionadas, perfeitas para presentear, decorar ambientes e tornar qualquer ocasião mais bonita e acolhedora. Nesta categoria você encontra flores cheias de vida, cores e delicadeza para expressar sentimentos com beleza e significado.",
  },
  {
    name: "Orquídeas",
    slug: "orquideas",
    sortOrder: 3,
    description:
      "Orquídeas elegantes e delicadas, perfeitas para presentear, decorar ambientes e tornar momentos especiais ainda mais marcantes. Nesta categoria você encontra diferentes tipos de orquídeas, com cores, estilos e combinações ideais para cada ocasião.",
  },
  {
    name: "Arranjos",
    slug: "arranjos",
    sortOrder: 4,
    description:
      "Arranjos florais cuidadosamente preparados para encantar, decorar e emocionar em diferentes ocasiões. Nesta categoria você encontra combinações especiais de flores, cores e detalhes, ideais para presentear ou deixar ambientes mais bonitos e acolhedores.",
  },
  {
    name: "Cestas",
    slug: "cestas",
    sortOrder: 5,
    description:
      "Cestas especiais montadas com cuidado para presentear com carinho, afeto e bom gosto. Nesta categoria você encontra opções ideais para aniversários, homenagens, datas comemorativas e momentos em que um presente cheio de significado faz toda a diferença.",
  },
  {
    name: "Presentes",
    slug: "presentes",
    sortOrder: 6,
    description:
      "Presentes delicados e cheios de significado para surpreender pessoas especiais em diferentes momentos. Nesta categoria você encontra opções pensadas para demonstrar amor, gratidão, amizade e carinho de uma forma simples, bonita e memorável.",
  },
  {
    name: "Folhagens",
    slug: "folhagens",
    sortOrder: 7,
    description:
      "Folhagens naturais que trazem beleza, leveza e um toque de natureza para qualquer ambiente. Nesta categoria você encontra opções perfeitas para decoração, composição de arranjos e presentes cheios de elegância e simplicidade.",
  },
] as const satisfies readonly CategoryCatalogItem[];
