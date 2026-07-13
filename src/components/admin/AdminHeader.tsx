"use client";

interface AdminHeaderProps {
  adminEmail: string;
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

export function AdminHeader({ adminEmail, onMenuToggle, sidebarOpen }: AdminHeaderProps) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        {/* Hambúrguer — visível apenas em < md */}
        <button
          aria-controls="admin-sidebar"
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
          className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full text-zinc-700 transition hover:bg-primary-soft hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
          onClick={onMenuToggle}
          type="button"
        >
          {sidebarOpen ? (
            <svg
              aria-hidden="true"
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="18" x2="6" y1="6" y2="18" />
              <line x1="6" x2="18" y1="6" y2="18" />
            </svg>
          ) : (
            <svg
              aria-hidden="true"
              fill="none"
              height="20"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="3" x2="21" y1="6" y2="6" />
              <line x1="3" x2="21" y1="12" y2="12" />
              <line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <p className="font-display text-lg font-semibold tracking-tight text-foreground">
            Painel administrativo
          </p>
          <p className="truncate text-sm leading-6 text-muted">
            Conectado como: {adminEmail}
          </p>
        </div>
      </div>
    </header>
  );
}
