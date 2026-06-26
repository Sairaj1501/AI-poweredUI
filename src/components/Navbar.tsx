'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import { IconNexusLogo, IconSearch, IconXMark } from './Icons';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close mobile menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); setSearchOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const navItems = [
    { label: 'Platform', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Customers', href: '#customers' },
    { label: 'Docs', href: '#' },
  ];

  return (
    <>
      <header
        ref={navRef}
        className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
        role="banner"
      >
        <nav className={`container ${styles.inner}`} aria-label="Main navigation">

          {/* Logo */}
          <a href="#hero" className={styles.logo} aria-label="NexusAI — Return to homepage">
            <IconNexusLogo className={styles.logoMark} />
            <span className={styles.logoText}>
              Nexus<span className={styles.logoAccent}>AI</span>
            </span>
          </a>

          {/* Desktop nav */}
          <ul className={styles.navLinks} role="list">
            {navItems.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className={styles.navLink}
                  id={`nav-${label.toLowerCase()}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className={styles.actions}>
            <button
              className={styles.searchBtn}
              onClick={() => setSearchOpen(true)}
              aria-label="Open search"
              id="nav-search-btn"
            >
              <IconSearch className={styles.searchIcon} />
            </button>
            <a href="#pricing" className="btn btn-ghost btn-sm" id="nav-signin">Sign In</a>
            <a href="#pricing" className="btn btn-primary btn-sm" id="nav-cta">
              Start Free
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.open : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            id="nav-mobile-toggle"
          >
            <span /><span /><span />
          </button>
        </nav>

        {/* Progress bar */}
        <div className={styles.progressBar} aria-hidden="true">
          <div className={styles.progressFill} />
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-nav"
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileOpen : ''}`}
        role="dialog"
        aria-label="Mobile navigation"
        aria-modal="true"
        aria-hidden={!mobileOpen}
      >
        <ul role="list" className={styles.mobileList}>
          {navItems.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className={styles.mobileLink}
                onClick={() => setMobileOpen(false)}
              >
                <span className={styles.mobileLinkArrow}>→</span>
                {label}
              </a>
            </li>
          ))}
        </ul>
        <div className={styles.mobileCtas}>
          <a href="#pricing" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Sign In</a>
          <a href="#pricing" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileOpen(false)}>Get Started Free</a>
        </div>
      </div>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className={styles.searchOverlay}
          role="dialog"
          aria-label="Site search"
          aria-modal="true"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false); }}
        >
          <div className={styles.searchBox}>
            <IconSearch className={styles.searchBoxIcon} />
            <input
              type="search"
              placeholder="Search features, docs, integrations..."
              className={styles.searchInput}
              autoFocus
              aria-label="Search NexusAI"
              id="search-input"
            />
            <kbd className={styles.searchEsc}>ESC</kbd>
            <button
              className={styles.searchClose}
              onClick={() => setSearchOpen(false)}
              aria-label="Close search"
            >
              <IconXMark className={styles.closeIcon} />
            </button>
          </div>
          <p className={styles.searchHint}>{`Try: "integrations", "pricing", "API"`}</p>
        </div>
      )}
    </>
  );
}
