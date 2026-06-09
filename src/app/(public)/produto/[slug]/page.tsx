type Props = { params: Promise<{ slug: string }> };

export default async function ProdutoPage({ params }: Props) {
  const { slug } = await params;

  return (
    <main>
      <h1>Produto: {slug}</h1>
    </main>
  );
}
