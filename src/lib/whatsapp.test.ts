import { describe, expect, it } from "vitest";
import type { CartItem } from "@/context/CartContext";
import {
  buildWhatsAppUrl,
  createWhatsappUrl,
  buildOrderWhatsAppMessage,
  type CheckoutFormData,
} from "@/lib/whatsapp";

// Normaliza espaço não-separável (U+00A0) produzido pelo Intl.NumberFormat
function normalize(value: string): string {
  return value.replace(/ /g, " ");
}

function makeItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    productId: "prod-1",
    slug: "rosa-vermelha",
    name: "Rosa Vermelha",
    unitPrice: 50,
    priceType: "FIXED",
    imageUrl: null,
    quantity: 1,
    shortDescription: null,
    ...overrides,
  };
}

const emptyCheckout: CheckoutFormData = {
  customerName: "",
  desiredDate: "",
  paymentMethod: "",
  cardMessage: "",
  notes: "",
  fulfillmentMode: "pickup",
  street: "",
  houseNumber: "",
  neighborhood: "",
  city: "",
  referencePoint: "",
  contactPhone: "",
};

// ─── buildWhatsAppUrl ───────────────────────────────────────────────────────

describe("buildWhatsAppUrl", () => {
  it("começa com https://wa.me/", () => {
    const url = buildWhatsAppUrl("5511999999999", "olá");
    expect(url).toMatch(/^https:\/\/wa\.me\//);
  });

  it("remove máscara do telefone — parênteses, espaços, traços", () => {
    const url = buildWhatsAppUrl("(11) 9 9999-9999", "teste");
    expect(url).toContain("/11999999999?");
    expect(url).not.toContain("(");
    expect(url).not.toContain(")");
    expect(url).not.toContain("-");
  });

  it("preserva telefone já limpo", () => {
    const url = buildWhatsAppUrl("5511999999999", "teste");
    expect(url).toContain("/5511999999999?");
  });

  it("codifica a mensagem com encodeURIComponent", () => {
    const message = "Olá! Pedido: Rosa & Lírio #1";
    const url = buildWhatsAppUrl("5511999999999", message);
    expect(url).toContain(encodeURIComponent(message));
    expect(url).not.toContain("&");
    expect(url).not.toContain("#");
    expect(url).not.toContain("á");
  });

  it("codifica mensagem com acentos e caracteres especiais", () => {
    const message = "Mensagem com ç, ã, é e ñ";
    const url = buildWhatsAppUrl("5511999999999", message);
    expect(url).toContain("?text=");
    expect(url).toContain(encodeURIComponent(message));
  });

  it("remove o símbolo + de número no formato internacional", () => {
    const url = buildWhatsAppUrl("+55 (11) 9 9999-9999", "teste");
    expect(url).toContain("/5511999999999?");
    expect(url).not.toContain("+");
  });
});

// ─── createWhatsappUrl ───────────────────────────────────────────────────────

describe("createWhatsappUrl", () => {
  it("produz o mesmo resultado que buildWhatsAppUrl com os mesmos argumentos", () => {
    const phone = "(11) 9 9999-9999";
    const message = "Olá! Pedido pelo site.";
    expect(createWhatsappUrl({ phoneNumber: phone, message })).toBe(
      buildWhatsAppUrl(phone, message),
    );
  });
});

// ─── buildOrderWhatsAppMessage ──────────────────────────────────────────────

describe("buildOrderWhatsAppMessage", () => {
  it("contém identificação de pedido pelo site", () => {
    const message = buildOrderWhatsAppMessage([makeItem()], emptyCheckout);
    expect(message).toContain("Pedido pelo site");
  });

  it("contém aviso de confirmação pela floricultura", () => {
    const message = buildOrderWhatsAppMessage([makeItem()], emptyCheckout);
    expect(message).toContain("sujeito à confirmação");
  });

  it("contém seção de produtos", () => {
    const message = buildOrderWhatsAppMessage([makeItem()], emptyCheckout);
    expect(message).toContain("Produtos:");
  });

  it("exibe nome do produto", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem({ name: "Lírio Branco" })],
      emptyCheckout,
    );
    expect(message).toContain("Lírio Branco");
  });

  it("exibe quantidade do produto", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem({ quantity: 3 })],
      emptyCheckout,
    );
    expect(message).toContain("Quantidade: 3");
  });

  // ─── priceType: FIXED ────────────────────────────────────────────────────

  it("produto FIXED exibe preço unitário e subtotal formatados", () => {
    const message = normalize(
      buildOrderWhatsAppMessage([makeItem({ unitPrice: 50, quantity: 2 })], emptyCheckout),
    );
    expect(message).toContain("Preço unitário: R$ 50,00");
    expect(message).toContain("Subtotal: R$ 100,00");
  });

  it("produto FIXED soma corretamente no total estimado", () => {
    const message = normalize(
      buildOrderWhatsAppMessage(
        [makeItem({ unitPrice: 30, quantity: 2 }), makeItem({ productId: "p2", unitPrice: 20, quantity: 1 })],
        emptyCheckout,
      ),
    );
    expect(message).toContain("Total estimado: R$ 80,00");
  });

  // ─── priceType: STARTING_FROM ────────────────────────────────────────────

  it("produto STARTING_FROM exibe 'A partir de' no preço unitário", () => {
    const message = normalize(
      buildOrderWhatsAppMessage(
        [makeItem({ priceType: "STARTING_FROM", unitPrice: 40 })],
        emptyCheckout,
      ),
    );
    expect(message).toContain("A partir de R$ 40,00");
  });

  it("produto STARTING_FROM exibe 'A partir de' no subtotal", () => {
    const message = normalize(
      buildOrderWhatsAppMessage(
        [makeItem({ priceType: "STARTING_FROM", unitPrice: 40, quantity: 2 })],
        emptyCheckout,
      ),
    );
    expect(message).toContain("Subtotal: A partir de R$ 80,00");
  });

  it("produto STARTING_FROM é incluído no total estimado", () => {
    const message = normalize(
      buildOrderWhatsAppMessage(
        [makeItem({ priceType: "STARTING_FROM", unitPrice: 60, quantity: 2 })],
        emptyCheckout,
      ),
    );
    expect(message).toContain("Total estimado: R$ 120,00");
  });

  it("carrinho com apenas itens STARTING_FROM tem total estimado não-zero", () => {
    const message = normalize(
      buildOrderWhatsAppMessage(
        [
          makeItem({ productId: "p1", priceType: "STARTING_FROM", unitPrice: 30, quantity: 1 }),
          makeItem({ productId: "p2", priceType: "STARTING_FROM", unitPrice: 20, quantity: 3 }),
        ],
        emptyCheckout,
      ),
    );
    expect(message).toContain("Total estimado: R$ 90,00");
  });

  // ─── priceType: ON_REQUEST ───────────────────────────────────────────────

  it("produto ON_REQUEST exibe 'Valor sob consulta' no preço", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem({ priceType: "ON_REQUEST", unitPrice: null })],
      emptyCheckout,
    );
    expect(message).toContain("Valor sob consulta");
  });

  it("produto ON_REQUEST não soma no total estimado", () => {
    const message = normalize(
      buildOrderWhatsAppMessage(
        [makeItem({ priceType: "ON_REQUEST", unitPrice: null })],
        emptyCheckout,
      ),
    );
    expect(message).toContain("Total estimado: R$ 0,00");
  });

  it("mix de FIXED e ON_REQUEST exibe aviso sobre itens não incluídos", () => {
    const message = buildOrderWhatsAppMessage(
      [
        makeItem({ productId: "p1", priceType: "FIXED", unitPrice: 50 }),
        makeItem({ productId: "p2", priceType: "ON_REQUEST", unitPrice: null }),
      ],
      emptyCheckout,
    );
    expect(message).toContain("Valor sob consulta não estão incluídos");
  });

  // ─── shortDescription ────────────────────────────────────────────────────

  it("exibe shortDescription quando preenchida", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem({ shortDescription: "Vermelha, haste longa" })],
      emptyCheckout,
    );
    expect(message).toContain("Descrição: Vermelha, haste longa");
  });

  it("omite shortDescription quando nula", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem({ shortDescription: null })],
      emptyCheckout,
    );
    expect(message).not.toContain("Descrição:");
  });

  // ─── customerName ────────────────────────────────────────────────────────

  it("exibe nome do cliente quando preenchido", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      { ...emptyCheckout, customerName: "Maria Silva" },
    );
    expect(message).toContain("Nome: Maria Silva");
  });

  it("omite nome do cliente quando vazio", () => {
    const message = buildOrderWhatsAppMessage([makeItem()], emptyCheckout);
    expect(message).not.toContain("Nome:");
  });

  it("omite nome do cliente quando contém apenas espaços em branco", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      { ...emptyCheckout, customerName: "   " },
    );
    expect(message).not.toContain("Nome:");
  });

  // ─── campos opcionais do checkout ────────────────────────────────────────

  it("exibe data ou prazo desejado quando preenchido", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      { ...emptyCheckout, desiredDate: "Sábado de manhã" },
    );
    expect(message).toContain("Data ou horário desejado: Sábado de manhã");
  });

  it("exibe forma de pagamento quando preenchida", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      { ...emptyCheckout, paymentMethod: "Pix" },
    );
    expect(message).toContain("Como pretende pagar: Pix");
  });

  it("exibe mensagem para cartão quando preenchida", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      { ...emptyCheckout, cardMessage: "Com amor, da família" },
    );
    expect(message).toContain("Mensagem para cartão: Com amor, da família");
  });

  it("exibe observações quando preenchidas", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      { ...emptyCheckout, notes: "Entregar na portaria" },
    );
    expect(message).toContain("Observações para a loja: Entregar na portaria");
  });

  it("omite todos os campos opcionais quando vazios", () => {
    const message = buildOrderWhatsAppMessage([makeItem()], emptyCheckout);
    expect(message).not.toContain("Data ou horário desejado:");
    expect(message).not.toContain("Como pretende pagar:");
    expect(message).not.toContain("Mensagem para cartão:");
    expect(message).not.toContain("Observações para a loja:");
  });

  it("omite campo opcional quando contém apenas espaços em branco", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      { ...emptyCheckout, notes: "   " },
    );
    expect(message).not.toContain("Observações para a loja:");
  });

  // ─── fulfillmentMode e entrega ───────────────────────────────────────────

  it("exibe 'Modalidade: Retirar na Loja' quando pickup", () => {
    const message = buildOrderWhatsAppMessage([makeItem()], emptyCheckout);
    expect(message).toContain("Modalidade: Retirar na Loja");
  });

  it("exibe 'Modalidade: Receber em casa' quando delivery", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      {
        ...emptyCheckout,
        fulfillmentMode: "delivery",
        street: "Rua A",
        houseNumber: "1",
        neighborhood: "Centro",
        city: "SP",
        referencePoint: "Perto da praça",
        contactPhone: "11999999999",
      },
    );
    expect(message).toContain("Modalidade: Receber em casa");
  });

  it("inclui endereço completo quando delivery", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      {
        ...emptyCheckout,
        fulfillmentMode: "delivery",
        street: "Rua das Flores",
        houseNumber: "42",
        neighborhood: "Jardim",
        city: "São Paulo",
        referencePoint: "Ao lado do banco",
        contactPhone: "11988887777",
      },
    );
    expect(message).toContain("Rua das Flores");
    expect(message).toContain("42");
    expect(message).toContain("Jardim");
    expect(message).toContain("São Paulo");
    expect(message).toContain("Ao lado do banco");
    expect(message).toContain("11988887777");
  });

  it("omite endereço quando pickup, mesmo com campos preenchidos", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      {
        ...emptyCheckout,
        fulfillmentMode: "pickup",
        street: "Rua A",
        houseNumber: "1",
        neighborhood: "Bairro X",
        city: "Cidade Y",
        referencePoint: "Ref Z",
        contactPhone: "11999999999",
      },
    );
    expect(message).not.toContain("Endereço de entrega");
    expect(message).not.toContain("Rua A");
    expect(message).not.toContain("11999999999");
  });

  it("modalidade sempre aparece na mensagem", () => {
    const message = buildOrderWhatsAppMessage([makeItem()], emptyCheckout);
    expect(message).toMatch(/Modalidade:/);
  });

  it("omite telefone quando pickup", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      { ...emptyCheckout, fulfillmentMode: "pickup", contactPhone: "11999999999" },
    );
    expect(message).not.toContain("Telefone para contato");
  });

  it("referencePoint aparece em delivery", () => {
    const message = buildOrderWhatsAppMessage(
      [makeItem()],
      {
        ...emptyCheckout,
        fulfillmentMode: "delivery",
        street: "Rua A",
        houseNumber: "1",
        neighborhood: "B",
        city: "C",
        referencePoint: "Próximo à escola",
        contactPhone: "11999999999",
      },
    );
    expect(message).toContain("Próximo à escola");
  });

  it("campos opcionais continuam omitidos quando vazios — regressão", () => {
    const message = buildOrderWhatsAppMessage([makeItem()], emptyCheckout);
    expect(message).not.toContain("Data ou horário desejado:");
    expect(message).not.toContain("Como pretende pagar:");
    expect(message).not.toContain("Mensagem para cartão:");
    expect(message).not.toContain("Observações para a loja:");
  });
});
