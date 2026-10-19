import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { company } from '@/data/company';
import { origin, indexable } from '@/lib/seo';
import { withBasePath } from '@/lib/paths';
import '@fontsource-variable/manrope';
import '@fontsource-variable/dm-sans';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(origin),
  title: { default: 'PLAN KRAFT | Waterproofing Solutions Sri Lanka', template: '%s | PLAN KRAFT' },
  description: `Professional waterproofing and building protection in Sri Lanka. ${company.experience} years of experience. Free site inspection and quotation.`,
  robots: { index: indexable, follow: indexable },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: company.name,
    url: new URL(withBasePath('/'), origin).href,
    telephone: company.tel.slice(4),
    email: company.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Senkunthar Street, Arayampathy 02',
      addressLocality: 'Batticaloa',
      addressCountry: 'LK',
    },
    areaServed: { '@type': 'Country', name: 'Sri Lanka' },
    sameAs: [company.facebook],
  };
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <a
          className="floating-whatsapp"
          href={company.whatsapp}
          aria-label={`Chat with Plan Kraft on WhatsApp: ${company.secondaryPhone}`}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M20 11.5a8 8 0 0 1-12 7L3 20l1.5-5A8 8 0 1 1 20 11.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
            />
            <path
              d="M8 7c-2 3 3 8 6 7l1-2-2-1-1 1-2-2 1-1-1-2Z"
              transform="translate(.75 1.5)"
              fill="currentColor"
            />
          </svg>
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
        />
      </body>
    </html>
  );
}
