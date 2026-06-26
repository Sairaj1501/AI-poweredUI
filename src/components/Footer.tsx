import styles from './Footer.module.css';
import { IconNexusLogo, IconLink } from './Icons';

const FOOTER_LINKS = {
  Product:   ['Platform', 'Pricing', 'Changelog', 'Roadmap', 'API Docs'],
  Company:   ['About', 'Blog', 'Careers', 'Press', 'Contact'],
  Resources: ['Documentation', 'Community', 'Templates', 'Integrations', 'Status'],
  Legal:     ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
};

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">

      {/* CTA Banner */}
      <div className={`container ${styles.ctaBanner}`}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaHeading}>
            Ready to automate your future?
          </h2>
          <p className={styles.ctaText}>
            Join 50,000+ teams already scaling with NexusAI. Start free — no card required.
          </p>
          <div className={styles.ctaActions}>
            <a href="#pricing" className="btn btn-primary" id="footer-cta-primary">
              Get Started Free
            </a>
            <a href="#" className="btn btn-ghost" id="footer-cta-demo">
              Book a Demo
            </a>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className={`container ${styles.main}`}>

        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandLogo}>
            <IconNexusLogo className={styles.logoIcon} />
            <span className={styles.brandName}>
              Nexus<span className={styles.brandNameAccent}>AI</span>
            </span>
          </div>
          <p className={styles.brandTagline}>
            The AI automation platform built for the speed of modern business.
            Deploy smarter. Scale faster.
          </p>
          <nav aria-label="Social media links" className={styles.socials}>
            {['Twitter', 'LinkedIn', 'GitHub', 'YouTube'].map((social) => (
              <a
                key={social}
                href="#"
                className={styles.socialLink}
                aria-label={`NexusAI on ${social}`}
                id={`footer-social-${social.toLowerCase()}`}
              >
                <IconLink className={styles.socialIcon} />
              </a>
            ))}
          </nav>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([category, links]) => (
          <nav
            key={category}
            className={styles.linkCol}
            aria-label={`${category} navigation`}
          >
            <h3 className={styles.colHeading}>{category}</h3>
            <ul role="list">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className={styles.link}
                    id={`footer-${link.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className="container">
          <div className={styles.bottomInner}>
            <p className={styles.copyright}>
              © {new Date().getFullYear()} NexusAI, Inc. All rights reserved.
            </p>
            <p className={styles.madeWith}>
              {`// BUILT WITH PRECISION FOR THE NEXT GENERATION`}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
