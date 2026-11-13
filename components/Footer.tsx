import Link from "next/link";
import { Logo } from "./Logo";
import { PhoneButton } from "./PhoneButton";
import { InstallShortcut } from "./InstallShortcut";
import { business, socialLinks } from "@/lib/business";
import { serviceAreaLine } from "@/lib/content";
import { footerServiceLinks, footerCompanyLinks, footerLegalLinks } from "@/lib/nav";

const linkClasses = "inline-flex min-h-12 min-w-12 items-center text-text-on-dark-muted hover:text-white";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-primary-hover text-text-on-dark print:hidden">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo onDark />
            <p className="mt-4 text-text-on-dark-muted">Pastrim profesional për shtëpi dhe biznese në Tiranë.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Shërbimet</h2>
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
            <h2 className="text-lg font-bold text-white">Kompania</h2>
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
            <h2 className="text-lg font-bold text-white">Na kontaktoni</h2>
            <ul className="mt-2">
              <li>
                <PhoneButton placement="footer" variant="link" showIcon={false} className="text-white! no-underline! hover:underline!" />
              </li>
              {business.email && (
                <li>
                  <a href={`mailto:${business.email}`} className={linkClasses}>
                    {business.email}
                  </a>
                </li>
              )}
              <li className="pt-2 text-text-on-dark-muted">{serviceAreaLine}</li>
              <li>
                <a href={business.googleMapsUrl} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                  Google Maps
                </a>
              </li>
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClasses}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <InstallShortcut placement="footer" className="mt-4 lg:hidden" />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border-on-dark pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-text-on-dark-muted">
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
