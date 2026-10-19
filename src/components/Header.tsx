'use client';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { company, navigation } from '@/data/company';
export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, []);
  return (
    <>
      <div className="topbar">
        <div className="container">
          <span>Batticaloa based. Islandwide protection.</span>
          <span>
            <a href={company.tel}>{company.phone}</a>
            <i />
            Free inspection & quotation
          </span>
        </div>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link className="brand" href="/" aria-label="Plan Kraft home">
            <BrandLogo />
          </Link>
          <button
            className="menu-toggle"
            ref={toggle}
            aria-expanded={open}
            aria-controls="primary-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? 'Close ✕' : 'Menu ☰'}
          </button>
          <nav
            id="primary-navigation"
            aria-label="Main navigation"
            className={open ? 'navigation open' : 'navigation'}
          >
            {navigation.map(([href, label]) => (
              <Link
                className={href === '/request-quote' ? 'nav-quote' : ''}
                key={href}
                href={href}
                aria-current={path === href ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
                {href === '/request-quote' && <span aria-hidden="true">→</span>}
              </Link>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
