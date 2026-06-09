import { NextResponse } from "next/server";

import { getActiveCategories } from "@/server/categories";

export async function GET() {
  try {
    const categories = await getActiveCategories();
    return NextResponse.json(categories);
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar categorias." },
      { status: 500 }
    );
  }
}
