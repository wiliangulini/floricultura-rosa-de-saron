type AdminHeaderProps = Readonly<{
  adminEmail: string;
}>;

export function AdminHeader({ adminEmail }: AdminHeaderProps) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="flex flex-col gap-2 px-4 py-4 sm:px-6 lg:px-8">
        <p className="text-lg font-semibold text-zinc-950">Painel administrativo</p>
        <p className="text-sm leading-6 text-zinc-600">Conectado como: {adminEmail}</p>
      </div>
    </header>
  );
}
