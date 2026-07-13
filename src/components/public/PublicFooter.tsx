import Link from "next/link";

import { formatPhoneForDisplay } from "@/lib/format-phone";
import type { PublicSettings } from "@/server/settings";

const footerNavigationItems = [
  { href: "/", label: "Início" },
  { href: "/produtos", label: "Produtos" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
  { href: "/carrinho", label: "Meu pedido" },
] as const;

type PublicFooterProps = Readonly<{
  businessName: string;
  settings: PublicSettings;
}>;

const footerLinkClasses =
  "inline-flex min-h-9 items-center rounded-md text-rose-100 underline-offset-4 transition hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200";

export function PublicFooter({ businessName, settings }: PublicFooterProps) {
  const phoneDisplay = formatPhoneForDisplay(settings.phone);
  const whatsappDisplay = formatPhoneForDisplay(settings.whatsappNumber);
  const whatsappDigits = settings.whatsappNumber?.replace(/\D/g, "") ?? "";
  const cityState = [settings.city, settings.state].filter(Boolean).join(" — ");
  const hasContactInfo = Boolean(
    settings.phone || whatsappDigits || settings.openingHours || settings.instagramUrl || settings.facebookUrl,
  );

  return (
    <footer className="bg-rose-950 text-rose-100">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight text-white">
            {businessName}
          </p>
          {settings.address && <p className="mt-3 text-sm leading-6">{settings.address}</p>}
          {settings.neighborhood && <p className="text-sm leading-6">{settings.neighborhood}</p>}
          {cityState && <p className="mt-1 text-sm leading-6">{cityState}</p>}
        </div>

        <nav aria-label="Navegação do rodapé">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-300">
            Navegação
          </p>
          <ul className="mt-3 space-y-1">
            {footerNavigationItems.map((item) => (
              <li key={item.href}>
                <Link className={footerLinkClasses} href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {hasContactInfo && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-300">
              Atendimento
            </p>
            <ul className="mt-3 space-y-1 text-sm">
              {whatsappDigits && (
                <li>
                  <a
                    className={footerLinkClasses}
                    href={`https://wa.me/${whatsappDigits}`}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    WhatsApp: {whatsappDisplay}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li>
                  <a className={footerLinkClasses} href={`tel:${settings.phone.replace(/\D/g, "")}`}>
                    Telefone: {phoneDisplay}
                  </a>
                </li>
              )}
              {settings.openingHours && <li className="py-1.5 leading-6">{settings.openingHours}</li>}
              {settings.instagramUrl && (
                <li>
                  <a
                    className={footerLinkClasses}
                    href={settings.instagramUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Instagram
                  </a>
                </li>
              )}
              {settings.facebookUrl && (
                <li>
                  <a
                    className={footerLinkClasses}
                    href={settings.facebookUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Facebook
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      <div className="border-t border-rose-900">
        <p className="container-page py-5 text-center text-sm text-rose-200">
          © {new Date().getFullYear()} {businessName}
        </p>
      </div>
    </footer>
  );
}
