import Link from "next/link";
import { Logo } from "./Logo";
import { PhoneButton } from "./PhoneButton";
import { business } from "@/lib/business";
import { footerServiceLinks, footerCompanyLinks, footerLegalLinks } from "@/lib/nav";

const linkClasses = "inline-flex min-h-12 min-w-12 items-center text-text-muted hover:text-primary";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-bg">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-text-muted">Pastrim profesional në {business.city}.</p>
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
            <ul className="mt-2">
              <li>
                <PhoneButton placement="footer" variant="link" showIcon={false} className="no-underline! text-text hover:underline!" />
              </li>
              {business.email && (
                <li>
                  <a href={`mailto:${business.email}`} className={linkClasses}>
                    {business.email}
                  </a>
                </li>
              )}
              <li className="pt-2 text-text-muted">{business.areaServed}</li>
              <li>
                <a href={business.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                  Google Maps
                </a>
              </li>
            </ul>
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
