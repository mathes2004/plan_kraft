import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { company, navigation } from '@/data/company';
export default function Footer() {
  return (
    <footer className="footer" id="contact-preview">
      <div className="container footer-grid">
        <div>
          <Link href="/" className="footer-brand" aria-label="Plan Kraft home">
            <BrandLogo />
          </Link>
          <p>
            Lasting protection.
            <br />
            Built on experience.
          </p>
          <p>
            Waterproofing & building protection
            <br />
            across Sri Lanka.
          </p>
        </div>
        <div>
          <h2>Explore</h2>
          {navigation.map(([url, label]) => (
            <Link key={url} href={url}>
              {label}
            </Link>
          ))}
        </div>
        <div>
          <h2>Let’s talk</h2>
          <a href={company.tel}>{company.phone}</a>
          <a href={company.secondaryTel}>{company.secondaryPhone}</a>
          <a href={`mailto:${company.email}`}>{company.email}</a>
          <a href={company.whatsapp}>Chat on WhatsApp ↗</a>
        </div>
        <div>
          <h2>Find us</h2>
          <p>{company.address}</p>
          <a href={company.facebook} rel="noopener noreferrer" target="_blank">
            Facebook ↗
          </a>
          <p className="small">
            Free site inspection.
            <br />
            Free quotation.
          </p>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} PLAN KRAFT WATERPROOFING SOLUTIONS</span>
        <span>Built to protect what matters.</span>
      </div>
    </footer>
  );
}
