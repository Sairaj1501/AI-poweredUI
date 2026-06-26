'use client';
import styles from './Testimonials.module.css';
import { IconStar } from './Icons';

const TESTIMONIALS = [
  {
    id: 'testimonial-1',
    quote:
      "NexusAI transformed our operations. What used to take a team of 12 to manage manually now runs autonomously — with better results and half the cost.",
    name: 'Sarah Chen',
    role: 'CTO, Meridian Labs',
    initials: 'SC',
    color: '#FFC801',     // Forsythia
    rating: 5,
  },
  {
    id: 'testimonial-2',
    quote:
      "The integration library is insane. We connected our entire stack in under 2 hours. ROI was positive within the first week of deployment.",
    name: 'Marcus Rivera',
    role: 'VP Engineering, FlowStack',
    initials: 'MR',
    color: '#FF9932',     // Deep Saffron
    rating: 5,
  },
  {
    id: 'testimonial-3',
    quote:
      "We evaluated 6 AI automation platforms. NexusAI was the only one that met our security requirements while being incredibly fast to deploy.",
    name: 'Priya Anand',
    role: 'Head of IT Security, Apex Financial',
    initials: 'PA',
    color: '#D9E8E2',     // Mystic Mint
    rating: 5,
  },
  {
    id: 'testimonial-4',
    quote:
      "The analytics dashboard alone is worth the subscription. We now have real-time visibility into every automated workflow across the organization.",
    name: 'James Liu',
    role: 'Director of Operations, ScaleHQ',
    initials: 'JL',
    color: '#114C5A',     // Nocturnal Expedition
    rating: 5,
  },
  {
    id: 'testimonial-5',
    quote:
      "NexusAI's support team is exceptional. They helped us build custom workflows that we thought would take months — it took 2 days.",
    name: 'Amara Osei',
    role: 'Product Manager, CloudNova',
    initials: 'AO',
    color: '#FFC801',     // Forsythia
    rating: 5,
  },
  {
    id: 'testimonial-6',
    quote:
      "Skeptical about AI automation at first. After seeing NexusAI handle 50,000 daily tasks without a single error, I'm a complete convert.",
    name: 'Tom Kazuki',
    role: 'Founder, Datasync.io',
    initials: 'TK',
    color: '#FF9932',     // Deep Saffron
    rating: 5,
  },
];

const LOGOS = [
  'Meridian Labs', 'FlowStack', 'Apex Financial',
  'ScaleHQ', 'CloudNova', 'Datasync.io', 'TechCorp', 'BuildFast',
];

export default function Testimonials() {
  return (
    <section
      id="customers"
      className={`section ${styles.testimonialsSection}`}
      aria-labelledby="testimonials-heading"
    >
      <div className="container">
        {/* Header */}
        <header className={`${styles.sectionHeader} reveal`}>
          <div className="badge">Customer Stories</div>
          <h2 id="testimonials-heading" className={styles.heading}>
            Trusted by <span className="gradient-text">50,000+ teams</span> worldwide
          </h2>
          <p className={styles.subheading}>
            See how companies across every industry are scaling with NexusAI.
          </p>
        </header>

        {/* Logo strip */}
        <div className={`${styles.logoStrip} reveal`} aria-label="Companies using NexusAI">
          <div className={styles.logoTrack}>
            {[...LOGOS, ...LOGOS].map((logo, i) => (
              <div key={`${logo}-${i}`} className={styles.logoItem} aria-label={logo}>
                {logo}
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial grid */}
        <div className={`${styles.grid} reveal`} role="list" aria-label="Customer testimonials">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.id}
              id={t.id}
              className={styles.card}
              role="listitem"
              aria-label={`Testimonial from ${t.name}`}
            >
              {/* Stars */}
              <div className={styles.stars} aria-label={`${t.rating} stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <IconStar key={i} className={styles.star} />
                ))}
              </div>

              <blockquote className={styles.quote}>
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <footer className={styles.cardFooter}>
                <div
                  className={styles.avatar}
                  style={{ '--avatar-color': t.color } as React.CSSProperties}
                  aria-hidden="true"
                >
                  {t.initials}
                </div>
                <div>
                  <cite className={styles.name}>{t.name}</cite>
                  <p className={styles.role}>{t.role}</p>
                </div>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
