import { NextResponse } from "next/server";

import { getProductBySlug } from "@/server/products";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar produto." },
      { status: 500 }
    );
  }
}
