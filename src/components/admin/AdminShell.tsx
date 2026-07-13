"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

interface AdminShellProps {
  adminEmail: string;
  children: ReactNode;
}

export function AdminShell({ adminEmail, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const id = setTimeout(() => {
      setSidebarOpen(false);
    }, 0);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {sidebarOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-overlay md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          adminEmail={adminEmail}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
          sidebarOpen={sidebarOpen}
        />
        <main
          className="w-full px-4 py-6 sm:px-6 lg:px-8"
          id="conteudo-principal"
          tabIndex={-1}
        >
          <div className="mx-auto w-full max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
