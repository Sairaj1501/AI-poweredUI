'use client';
import { useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import styles from './Pricing.module.css';
import { IconCheck, IconMinus, IconChevronRight } from './Icons';

/* ================================================================
   FEATURE 1: Matrix-Driven Pricing & Performance-Isolated Currency Switcher
   
   Rules:
   - Multi-dimensional config matrix (tier × billing × currency)
   - 20% annual discount computed dynamically
   - Regional tariff variables per currency
   - State updates ISOLATED to targeted DOM text nodes only
   - NO global re-renders when toggling billing/currency
   ================================================================ */

// ── Multi-Dimensional Pricing Matrix ──────────────────────────────
// Structure: PRICING_MATRIX[tier][billing] → base rate in USD
// Regional tariff multipliers applied per currency

const PRICING_MATRIX = {
  starter: {
    monthly: 29,
    annual: 29 * 0.8, // 20% discount
  },
  pro: {
    monthly: 79,
    annual: 79 * 0.8,
  },
  enterprise: {
    monthly: 199,
    annual: 199 * 0.8,
  },
} as const;

// Regional tariff variables (purchasing power parity + market rates)
const CURRENCY_CONFIG = {
  USD: { symbol: '$', multiplier: 1,      locale: 'en-US', decimalPlaces: 0, code: 'USD' },
  EUR: { symbol: '€', multiplier: 0.93,   locale: 'de-DE', decimalPlaces: 0, code: 'EUR' },
  INR: { symbol: '₹', multiplier: 83.5,   locale: 'en-IN', decimalPlaces: 0, code: 'INR' },
} as const;

type Tier     = keyof typeof PRICING_MATRIX;
type Billing  = 'monthly' | 'annual';
type Currency = keyof typeof CURRENCY_CONFIG;

// Compute final price from the matrix
function computePrice(tier: Tier, billing: Billing, currency: Currency): string {
  const baseUSD    = PRICING_MATRIX[tier][billing];
  const config     = CURRENCY_CONFIG[currency];
  const finalPrice = Math.round(baseUSD * config.multiplier);
  
  // Format with locale
  if (currency === 'INR') {
    // Indian formatting: ₹2,490
    return config.symbol + finalPrice.toLocaleString('en-IN');
  }
  return config.symbol + finalPrice.toLocaleString('en-US');
}

// Plans data (static — doesn't change with billing/currency)
const PLANS = [
  {
    id: 'starter' as Tier,
    name: 'Starter',
    tagline: 'Perfect for solo builders',
    highlight: false,
    features: [
      { text: '5 AI Agents', included: true },
      { text: '10,000 API calls/mo', included: true },
      { text: 'Basic integrations (10+)', included: true },
      { text: 'Community support', included: true },
      { text: 'Analytics dashboard', included: true },
      { text: 'Custom workflows', included: false },
      { text: 'Priority support', included: false },
      { text: 'SLA guarantee', included: false },
    ],
    cta: 'Start Free Trial',
  },
  {
    id: 'pro' as Tier,
    name: 'Pro',
    tagline: 'For growing teams',
    highlight: true,
    badge: 'Most Popular',
    features: [
      { text: '25 AI Agents', included: true },
      { text: '100,000 API calls/mo', included: true },
      { text: 'All integrations (200+)', included: true },
      { text: 'Priority support (24/7)', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Custom workflows', included: true },
      { text: 'Team collaboration', included: true },
      { text: 'SLA guarantee', included: false },
    ],
    cta: 'Start Pro Trial',
  },
  {
    id: 'enterprise' as Tier,
    name: 'Enterprise',
    tagline: 'For large-scale operations',
    highlight: false,
    features: [
      { text: 'Unlimited AI Agents', included: true },
      { text: 'Unlimited API calls', included: true },
      { text: 'All integrations + Custom', included: true },
      { text: 'Dedicated support manager', included: true },
      { text: 'Custom analytics & BI', included: true },
      { text: 'Custom workflows + SDK', included: true },
      { text: 'SSO & advanced security', included: true },
      { text: '99.99% SLA guarantee', included: true },
    ],
    cta: 'Contact Sales',
  },
] as const;

// ── Isolated State Manager ─────────────────────────────────────────
// Uses refs + direct DOM manipulation to update ONLY price text nodes
// This ensures ZERO global re-renders on billing/currency change

function useIsolatedPricing() {
  // Refs to all price text nodes — keyed by tier
  const priceRefs = useRef<Record<string, HTMLElement | null>>({});
  const periodRefs = useRef<Record<string, HTMLElement | null>>({});
  const savingsRefs = useRef<Record<string, HTMLElement | null>>({});
  
  // Current state stored in refs (no React state → no re-render)
  const currentBilling  = useRef<Billing>('monthly');
  const currentCurrency = useRef<Currency>('USD');

  const updatePrices = useCallback(() => {
    const billing  = currentBilling.current;
    const currency = currentCurrency.current;

    // Direct DOM mutation — ONLY touches price text nodes
    (Object.keys(PRICING_MATRIX) as Tier[]).forEach((tier) => {
      const priceEl   = priceRefs.current[tier];
      const periodEl  = periodRefs.current[tier];
      const savingsEl = savingsRefs.current[tier];

      if (priceEl) {
        priceEl.textContent = computePrice(tier, billing, currency);
      }
      if (periodEl) {
        periodEl.textContent = billing === 'monthly' ? '/month' : '/month, billed annually';
      }
      if (savingsEl) {
        if (billing === 'annual') {
          const monthly = PRICING_MATRIX[tier].monthly;
          const annual  = PRICING_MATRIX[tier].annual;
          const saved   = Math.round((monthly - annual) * 12 * CURRENCY_CONFIG[currency].multiplier);
          const config  = CURRENCY_CONFIG[currency];
          savingsEl.textContent = `Save ${config.symbol}${saved.toLocaleString('en-US')} / year`;
          savingsEl.style.display = 'block';
        } else {
          savingsEl.style.display = 'none';
        }
      }
    });
  }, []);

  const setBilling = useCallback((billing: Billing) => {
    currentBilling.current = billing;
    updatePrices();
  }, [updatePrices]);

  const setCurrency = useCallback((currency: Currency) => {
    currentCurrency.current = currency;
    updatePrices();
  }, [updatePrices]);

  const registerPriceRef  = useCallback((tier: string, el: HTMLElement | null) => {
    priceRefs.current[tier] = el;
  }, []);
  const registerPeriodRef = useCallback((tier: string, el: HTMLElement | null) => {
    periodRefs.current[tier] = el;
  }, []);
  const registerSavingsRef = useCallback((tier: string, el: HTMLElement | null) => {
    savingsRefs.current[tier] = el;
  }, []);

  return { setBilling, setCurrency, registerPriceRef, registerPeriodRef, registerSavingsRef };
}

// ── Toggle Component (fully isolated) ─────────────────────────────
function BillingToggle({ onToggle }: { onToggle: (b: Billing) => void }) {
  const activeRef = useRef<Billing>('monthly');
  const monthlyBtnRef = useRef<HTMLButtonElement>(null);
  const annualBtnRef  = useRef<HTMLButtonElement>(null);
  const indicatorRef  = useRef<HTMLSpanElement>(null);

  const toggle = useCallback((billing: Billing) => {
    if (activeRef.current === billing) return;
    activeRef.current = billing;
    
    // Update button states via DOM — no re-render
    if (monthlyBtnRef.current) {
      monthlyBtnRef.current.setAttribute('aria-pressed', String(billing === 'monthly'));
      monthlyBtnRef.current.classList.toggle(styles.toggleActive, billing === 'monthly');
    }
    if (annualBtnRef.current) {
      annualBtnRef.current.setAttribute('aria-pressed', String(billing === 'annual'));
      annualBtnRef.current.classList.toggle(styles.toggleActive, billing === 'annual');
    }
    if (indicatorRef.current) {
      indicatorRef.current.style.transform = billing === 'annual' ? 'translateX(100%)' : 'translateX(0)';
    }
    
    onToggle(billing);
  }, [onToggle]);

  return (
    <div className={styles.billingToggle} role="group" aria-label="Billing cycle">
      <div className={styles.toggleTrack}>
        <span ref={indicatorRef} className={styles.toggleIndicator} aria-hidden="true" />
        <button
          ref={monthlyBtnRef}
          id="billing-monthly"
          className={`${styles.toggleBtn} ${styles.toggleActive}`}
          aria-pressed="true"
          onClick={() => toggle('monthly')}
        >
          Monthly
        </button>
        <button
          ref={annualBtnRef}
          id="billing-annual"
          className={styles.toggleBtn}
          aria-pressed="false"
          onClick={() => toggle('annual')}
        >
          Annual
          <span className={styles.saveBadge}>–20%</span>
        </button>
      </div>
    </div>
  );
}

// ── Currency Selector (fully isolated) ────────────────────────────
function CurrencySelector({ onSelect }: { onSelect: (c: Currency) => void }) {
  const activeCurrencyRef = useRef<Currency>('USD');
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const select = useCallback((currency: Currency) => {
    if (activeCurrencyRef.current === currency) return;
    
    // Deactivate old
    const oldBtn = btnRefs.current[activeCurrencyRef.current];
    if (oldBtn) oldBtn.classList.remove(styles.currencyActive);
    
    // Activate new — direct DOM, no re-render
    activeCurrencyRef.current = currency;
    const newBtn = btnRefs.current[currency];
    if (newBtn) newBtn.classList.add(styles.currencyActive);
    
    onSelect(currency);
  }, [onSelect]);

  return (
    <div className={styles.currencySelector} role="group" aria-label="Select currency">
      {(Object.keys(CURRENCY_CONFIG) as Currency[]).map((curr) => (
        <button
          key={curr}
          ref={(el) => { btnRefs.current[curr] = el; }}
          id={`currency-${curr.toLowerCase()}`}
          className={`${styles.currencyBtn} ${curr === 'USD' ? styles.currencyActive : ''}`}
          aria-pressed={curr === 'USD'}
          onClick={() => select(curr)}
        >
          {CURRENCY_CONFIG[curr].symbol} {curr}
        </button>
      ))}
    </div>
  );
}

// ── Main Pricing Section ───────────────────────────────────────────
export default function Pricing() {
  const { setBilling, setCurrency, registerPriceRef, registerPeriodRef, registerSavingsRef } =
    useIsolatedPricing();

  return (
    <section
      id="pricing"
      className={`section ${styles.pricingSection}`}
      aria-labelledby="pricing-heading"
    >
      <div className="container">
        {/* Header */}
        <motion.header 
          className={`${styles.sectionHeader} reveal`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <motion.div 
            className="badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            Pricing
          </motion.div>
          <motion.h2 
            id="pricing-heading" 
            className={styles.heading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p 
            className={styles.subheading}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            Choose the plan that fits your scale. Upgrade, downgrade, or cancel anytime.
          </motion.p>
        </motion.header>

        {/* Controls */}
        <motion.div 
          className={`${styles.controls} reveal`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <BillingToggle onToggle={setBilling} />
          <CurrencySelector onSelect={setCurrency} />
        </motion.div>

        {/* Pricing Grid */}
        <motion.div 
          className={styles.grid} 
          role="list" 
          aria-label="Pricing plans"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          {PLANS.map((plan, i) => (
            <motion.article
              key={plan.id}
              className={`${styles.card} ${plan.highlight ? styles.highlighted : ''} reveal`}
              role="listitem"
              aria-label={`${plan.name} plan`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -12 }}
            >
              {plan.highlight && 'badge' in plan && (
                <div className={styles.popularBadge} aria-label="Most popular plan">
                  {(plan as typeof plan & { badge: string }).badge}
                </div>
              )}

              <header className={styles.cardHeader}>
                <h3 className={styles.planName}>{plan.name}</h3>
                <p className={styles.planTagline}>{plan.tagline}</p>
              </header>

              {/* Price Block — Only these text nodes are mutated */}
              <div className={styles.priceBlock}>
                <div className={styles.priceRow}>
                  <span
                    className={styles.price}
                    ref={(el) => registerPriceRef(plan.id, el)}
                    aria-live="polite"
                    aria-label={`Price for ${plan.name} plan`}
                    id={`price-${plan.id}`}
                  >
                    {computePrice(plan.id, 'monthly', 'USD')}
                  </span>
                </div>
                <span
                  className={styles.period}
                  ref={(el) => registerPeriodRef(plan.id, el)}
                  id={`period-${plan.id}`}
                >
                  /month
                </span>
                <span
                  className={styles.savings}
                  ref={(el) => registerSavingsRef(plan.id, el)}
                  id={`savings-${plan.id}`}
                  style={{ display: 'none' }}
                  aria-live="polite"
                >
                </span>
              </div>

              <motion.a
                href="#"
                className={`btn ${plan.highlight ? 'btn-primary' : 'btn-ghost'} ${styles.planCta}`}
                id={`cta-${plan.id}`}
                aria-label={`${plan.cta} — ${plan.name} plan`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.cta}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <IconChevronRight className={styles.ctaIcon} />
                </motion.span>
              </motion.a>

              {/* Feature List */}
              <ul className={styles.features} role="list" aria-label={`${plan.name} features`}>
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className={`${styles.featureItem} ${!feature.included ? styles.featureDisabled : ''}`}
                  >
                    <span className={`${styles.featureIcon} ${feature.included ? styles.featureIconCheck : styles.featureIconMinus}`}>
                      {feature.included
                        ? <IconCheck className={styles.checkIcon} />
                        : <IconMinus className={styles.minusIcon} />
                      }
                    </span>
                    <span>{feature.text}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </motion.div>

        {/* Enterprise Footer */}
        <footer className={`${styles.footer} reveal`}>
          <p>Need a custom plan? <a href="#" className={styles.footerLink}>Talk to our sales team →</a></p>
        </footer>
      </div>
    </section>
  );
}
