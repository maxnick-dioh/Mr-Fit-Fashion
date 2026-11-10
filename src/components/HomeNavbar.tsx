"use client";

import { useState } from "react";
import Link from "next/link";

const navigationLinks = [
  { href: "#", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#gallery", label: "Gallery" },
  { href: "#contact", label: "Contact" },
];

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <header className={`navbar${isOpen ? " menu-open" : ""}`}>
      <a href="#" className="brand" onClick={closeMenu}>
        <span className="brand-mark">L</span>
        <span className="brand-name">LOUISO FITS</span>
        <span className="brand-tagline">STYLE · CLASS · YOU</span>
      </a>

      <button
        className="navbar-toggle"
        type="button"
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
        aria-controls="primary-navigation"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <div className="navbar-menu" id="primary-navigation">
        <nav className="nav-links" aria-label="Main navigation">
          {navigationLinks.map(({ href, label }) => (
            <a href={href} key={label} onClick={closeMenu}>
              {label}
            </a>
          ))}
        </nav>

        <a href="#contact" className="button button-gold nav-cta" onClick={closeMenu}>
          Book a Consultation
        </a>

        <div className="nav-auth">
          <Link href="/login" onClick={closeMenu}>Sign in</Link>
          <Link href="/register" className="button button-gold" onClick={closeMenu}>
            Create account
          </Link>
        </div>
      </div>
    </header>
  );
}
