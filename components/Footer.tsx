import Link from "next/link";
import { Logo } from "./Logo";
import { WhatsAppLink } from "./WhatsAppLink";
import { PhoneLink } from "./PhoneLink";
import { business } from "@/lib/business";
import { footerServiceLinks, footerLegalLinks } from "@/lib/nav";
import { waMessages } from "@/lib/whatsapp-messages";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-text-muted">Pastërti që ndihet.</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">Shërbimet</h3>
            <ul className="mt-4 space-y-2">
              {footerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-text-muted hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">Kompania</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/rreth-nesh" className="text-sm text-text-muted hover:text-primary">
                  Rreth nesh
                </Link>
              </li>
              <li>
                <Link href="/puna-jone" className="text-sm text-text-muted hover:text-primary">
                  Puna jonë
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-text-muted hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-text-muted hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-sm text-text-muted hover:text-primary">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-text">Na kontaktoni</h3>
            <ul className="mt-4 space-y-2 text-sm text-text-muted">
              <li>{business.areaServed}</li>
              <li>
                <PhoneLink className="hover:text-primary" />
              </li>
              <li>
                <WhatsAppLink
                  message={waMessages.general}
                  source="footer"
                  className="font-medium text-primary hover:text-primary-hover"
                >
                  Na shkruaj në WhatsApp
                </WhatsAppLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-text-muted">
            © {year} {business.name}. Të gjitha të drejtat e rezervuara.
          </p>
          <ul className="flex gap-4">
            {footerLegalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-xs text-text-muted hover:text-primary">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
