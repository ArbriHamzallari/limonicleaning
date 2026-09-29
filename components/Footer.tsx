import Link from "next/link";
import { Logo } from "./Logo";
import { WhatsAppButton } from "./WhatsAppButton";
import { PhoneButton } from "./PhoneButton";
import { business, prago } from "@/lib/business";
import { footerServiceLinks, footerCompanyLinks, footerLegalLinks } from "@/lib/nav";

const linkClasses = "inline-flex min-h-12 items-center text-text-muted hover:text-primary";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg-muted">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-text-muted">Pastrim profesional në {business.city}.</p>
            <p className="mt-2 text-text-muted">
              Partner zyrtar i{" "}
              <a href={prago.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                {prago.name}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-text">Shërbimet</h2>
            <ul className="mt-2">
              {footerServiceLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-text">Kompania</h2>
            <ul className="mt-2">
              {footerCompanyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-bold text-text">Na kontaktoni</h2>
            <p className="mt-3 text-text-muted">{business.areaServed}</p>
            <div className="mt-4 grid gap-3">
              <PhoneButton placement="footer" className="w-full sm:w-auto" />
              <WhatsAppButton placement="footer" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-muted">
            © {year} {business.name}. Të gjitha të drejtat e rezervuara.
          </p>
          <ul className="flex gap-6">
            {footerLegalLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={`${linkClasses} text-sm`}>
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
