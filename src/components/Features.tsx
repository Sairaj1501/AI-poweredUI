'use client';
import { useRef, useEffect, useCallback, useState } from 'react';
import styles from './Features.module.css';
import {
  IconArrowPath, IconArrowTrendingUp, IconChartPie,
  IconCog, IconCube, IconLink, IconBolt, IconShield,
  IconChevronDown
} from './Icons';

/* ================================================================
   FEATURE 2: Bento-to-Accordion Wrapper with State Persistence
   
   Rules:
   - Desktop: Modern Bento-Grid layout
   - Mobile (<768px): Fluid touch-optimized Accordion list
   - Context Lock: Active bento hover index transfers to accordion
     on resize, and vice versa — smooth, no flash
   - ZERO external component/animation libraries
   - All animations via native CSS transitions + WAAPI
   ================================================================ */

const FEATURES = [
  {
    id: 'agents',
    title: 'Autonomous AI Agents',
    description:
      'Deploy intelligent agents that operate around the clock, make context-aware decisions, and self-optimize based on real-time feedback loops.',
    icon: IconCube,
    stat: '99.7%',
    statLabel: 'Uptime SLA',
    size: 'large',
    color: '#FFC801',          // Forsythia
    accentColor: 'rgba(255,200,1,0.1)',
  },
  {
    id: 'integrations',
    title: 'Seamless Integrations',
    description:
      'Connect to 200+ business tools including Salesforce, HubSpot, Slack, and more — with zero-code setup via our visual connector.',
    icon: IconLink,
    stat: '200+',
    statLabel: 'Native connectors',
    size: 'medium',
    color: '#FF9932',          // Deep Saffron
    accentColor: 'rgba(255,153,50,0.1)',
  },
  {
    id: 'analytics',
    title: 'Real-Time Analytics',
    description:
      'Monitor every workflow, agent interaction, and business outcome in a unified intelligence dashboard with live telemetry.',
    icon: IconChartPie,
    stat: '2.4s',
    statLabel: 'Avg. insight latency',
    size: 'medium',
    color: '#D9E8E2',          // Mystic Mint
    accentColor: 'rgba(217,232,226,0.08)',
  },
  {
    id: 'automation',
    title: 'Workflow Automation',
    description:
      'Build complex automation trees with a visual drag-and-drop builder. No-code for teams, full SDK for developers.',
    icon: IconArrowPath,
    stat: '10×',
    statLabel: 'Faster execution',
    size: 'small',
    color: '#114C5A',          // Nocturnal Expedition
    accentColor: 'rgba(17,76,90,0.3)',
  },
  {
    id: 'performance',
    title: 'Enterprise Performance',
    description:
      'Built on distributed GPU infrastructure for ultra-low latency inference at global scale.',
    icon: IconArrowTrendingUp,
    stat: '<50ms',
    statLabel: 'Inference latency',
    size: 'small',
    color: '#F1F6F4',          // Arctic Powder
    accentColor: 'rgba(241,246,244,0.06)',
  },
  {
    id: 'security',
    title: 'Enterprise Security',
    description:
      'SOC 2 Type II certified, GDPR compliant. All data encrypted in transit and at rest with role-based access control.',
    icon: IconShield,
    stat: 'SOC 2',
    statLabel: 'Type II certified',
    size: 'small',
    color: '#FFC801',          // Forsythia
    accentColor: 'rgba(255,200,1,0.08)',
  },
] as const;

type FeatureId = typeof FEATURES[number]['id'];

const MOBILE_BREAKPOINT = 768;

export default function Features() {
  // ── Shared active index (the "context lock") ───────────────────
  // Using a ref so it's readable synchronously during resize
  const activeIndexRef = useRef<number>(-1);

  // ── Bento state (hover-driven, desktop only) ───────────────────
  const bentoRef = useRef<HTMLDivElement>(null);
  const bentoCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Accordion state (touch-driven, mobile only) ────────────────
  const [accordionOpen, setAccordionOpen] = useState<number>(-1);
  const accordionContentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const accordionBtnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // ── Current layout mode ────────────────────────────────────────
  const isMobileRef = useRef<boolean>(false);

  // ── Bento: set active card via direct DOM manipulation ─────────
  const setBentoActive = useCallback((index: number) => {
    bentoCardRefs.current.forEach((card, i) => {
      if (!card) return;
      if (i === index) {
        card.classList.add(styles.bentoActive);
        card.setAttribute('aria-current', 'true');
      } else {
        card.classList.remove(styles.bentoActive);
        card.removeAttribute('aria-current');
      }
    });
  }, []);

  const clearBentoActive = useCallback(() => {
    bentoCardRefs.current.forEach((card) => {
      card?.classList.remove(styles.bentoActive);
      card?.removeAttribute('aria-current');
    });
  }, []);

  // ── Accordion: animate open/close with WAAPI ──────────────────
  const animateAccordion = useCallback((index: number, open: boolean) => {
    const content = accordionContentRefs.current[index];
    const btn     = accordionBtnRefs.current[index];
    if (!content) return;

    if (open) {
      const targetHeight = content.scrollHeight;
      content.style.overflow = 'hidden';
      content.animate(
        [{ height: '0px', opacity: 0 }, { height: `${targetHeight}px`, opacity: 1 }],
        { duration: 320, easing: 'ease-in-out', fill: 'forwards' }
      ).onfinish = () => {
        content.style.height = 'auto';
        content.style.overflow = 'visible';
        content.style.opacity = '1';
      };
      btn?.setAttribute('aria-expanded', 'true');
      const chevron = btn?.querySelector(`.${styles.accordionChevron}`) as HTMLElement | null;
      if (chevron) chevron.style.transform = 'rotate(180deg)';
    } else {
      const currentHeight = content.scrollHeight;
      content.style.height = `${currentHeight}px`;
      content.style.overflow = 'hidden';
      content.animate(
        [{ height: `${currentHeight}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
        { duration: 300, easing: 'ease-in-out', fill: 'forwards' }
      ).onfinish = () => {
        content.style.height = '0';
        content.style.opacity = '0';
      };
      btn?.setAttribute('aria-expanded', 'false');
      const chevron = btn?.querySelector(`.${styles.accordionChevron}`) as HTMLElement | null;
      if (chevron) chevron.style.transform = 'rotate(0deg)';
    }
  }, []);

  // ── Context Lock: transfer active index on resize ──────────────
  useEffect(() => {
    const checkBreakpoint = () => {
      const nowMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      const wasMobile = isMobileRef.current;

      if (nowMobile !== wasMobile) {
        isMobileRef.current = nowMobile;
        const activeIdx = activeIndexRef.current;

        if (nowMobile) {
          // Transitioned FROM desktop TO mobile
          // Transfer bento active → accordion open
          clearBentoActive();
          if (activeIdx >= 0) {
            setAccordionOpen(activeIdx);
            // Use rAF to ensure DOM is in accordion layout before animating
            requestAnimationFrame(() => {
              animateAccordion(activeIdx, true);
            });
          }
        } else {
          // Transitioned FROM mobile TO desktop
          // Transfer accordion open → bento active
          const currentOpen = accordionOpen;
          if (currentOpen >= 0) {
            activeIndexRef.current = currentOpen;
            requestAnimationFrame(() => {
              setBentoActive(currentOpen);
            });
          }
        }
      }
    };

    isMobileRef.current = window.innerWidth <= MOBILE_BREAKPOINT;
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, [accordionOpen, animateAccordion, clearBentoActive, setBentoActive]);

  // ── Bento hover handlers ───────────────────────────────────────
  const onBentoHover = useCallback((index: number) => {
    activeIndexRef.current = index;
    setBentoActive(index);
  }, [setBentoActive]);

  const onBentoLeave = useCallback(() => {
    activeIndexRef.current = -1;
    clearBentoActive();
  }, [clearBentoActive]);

  // ── Accordion toggle ───────────────────────────────────────────
  const toggleAccordion = useCallback((index: number) => {
    const isCurrentlyOpen = accordionOpen === index;
    
    // Close current
    if (accordionOpen >= 0) {
      animateAccordion(accordionOpen, false);
    }
    
    // Open new (if different)
    if (!isCurrentlyOpen) {
      activeIndexRef.current = index;
      setAccordionOpen(index);
      requestAnimationFrame(() => animateAccordion(index, true));
    } else {
      activeIndexRef.current = -1;
      setAccordionOpen(-1);
    }
  }, [accordionOpen, animateAccordion]);

  return (
    <section
      id="features"
      className={`section ${styles.featuresSection}`}
      aria-labelledby="features-heading"
    >
      <div className="container">
        {/* Header */}
        <header className={`${styles.sectionHeader} reveal`}>
          <div className="badge">Core Features</div>
          <h2 id="features-heading" className={styles.heading}>
            Everything you need to{' '}
            <span className="gradient-text">automate at scale</span>
          </h2>
          <p className={styles.subheading}>
            NexusAI brings together powerful AI agents, seamless integrations,
            and real-time analytics in one unified platform.
          </p>
        </header>

        {/* ── BENTO GRID (Desktop) ── */}
        <div
          ref={bentoRef}
          className={`${styles.bentoGrid} reveal`}
          aria-label="Features bento grid"
          onMouseLeave={onBentoLeave}
        >
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                ref={(el) => { bentoCardRefs.current[index] = el; }}
                className={`${styles.bentoCard} ${styles[`bentoCard--${feature.size}`]}`}
                style={{ '--feature-color': feature.color, '--feature-bg': feature.accentColor } as React.CSSProperties}
                onMouseEnter={() => onBentoHover(index)}
                onFocus={() => onBentoHover(index)}
                onBlur={onBentoLeave}
                tabIndex={0}
                role="article"
                aria-label={feature.title}
                id={`bento-${feature.id}`}
              >
                {/* Background glow */}
                <div className={styles.bentoGlow} aria-hidden="true" />

                {/* Icon */}
                <div className={styles.bentoIconWrap}>
                  <Icon className={styles.bentoIcon} />
                </div>

                {/* Content */}
                <div className={styles.bentoContent}>
                  <h3 className={styles.bentoTitle}>{feature.title}</h3>
                  <p className={styles.bentoDesc}>{feature.description}</p>
                </div>

                {/* Stat */}
                <div className={styles.bentoStat}>
                  <span className={styles.bentoStatValue}>{feature.stat}</span>
                  <span className={styles.bentoStatLabel}>{feature.statLabel}</span>
                </div>

                {/* Border shimmer */}
                <div className={styles.bentoBorder} aria-hidden="true" />
              </div>
            );
          })}
        </div>

        {/* ── ACCORDION (Mobile) ── */}
        <div
          className={`${styles.accordion} reveal`}
          aria-label="Features accordion"
          role="list"
        >
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className={styles.accordionItem}
                style={{ '--feature-color': feature.color } as React.CSSProperties}
                role="listitem"
                id={`accordion-${feature.id}`}
              >
                <button
                  ref={(el) => { accordionBtnRefs.current[index] = el; }}
                  className={`${styles.accordionTrigger} ${accordionOpen === index ? styles.accordionTriggerOpen : ''}`}
                  aria-expanded={accordionOpen === index}
                  aria-controls={`accordion-content-${feature.id}`}
                  id={`accordion-btn-${feature.id}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <span className={styles.accordionIconWrap}>
                    <Icon className={styles.accordionIcon} />
                  </span>
                  <span className={styles.accordionTitle}>{feature.title}</span>
                  <IconChevronDown
                    className={styles.accordionChevron}
                  />
                </button>

                <div
                  ref={(el) => { accordionContentRefs.current[index] = el; }}
                  id={`accordion-content-${feature.id}`}
                  className={styles.accordionContent}
                  style={{ height: '0', opacity: '0', overflow: 'hidden' }}
                  role="region"
                  aria-labelledby={`accordion-btn-${feature.id}`}
                >
                  <div className={styles.accordionBody}>
                    <p className={styles.accordionDesc}>{feature.description}</p>
                    <div className={styles.accordionStat}>
                      <span className={styles.accordionStatValue}>{feature.stat}</span>
                      <span className={styles.accordionStatLabel}>{feature.statLabel}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
