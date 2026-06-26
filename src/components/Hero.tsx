'use client';
import { useEffect, useRef } from 'react';
import styles from './Hero.module.css';
import { IconBolt, IconArrowTrendingUp, IconCog, IconNexusLogo } from './Icons';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  /* ── Animated canvas: particle network with gold & teal ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 30 : 60;
    const COLORS = ['#FFC801', '#FF9932', '#114C5A', '#D9E8E2'];

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 2.5 + 0.8,
      alpha: Math.random() * 0.6 + 0.15,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: (Math.random() * 0.02) + 0.005,
    }));

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);

      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;

        const pulsedAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        const pulsedR = p.r * (1 + 0.2 * Math.sin(p.pulse + Math.PI / 2));

        // Glow
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulsedR * 4);
        grad.addColorStop(0, p.color);
        grad.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedR * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.globalAlpha = pulsedAlpha * 0.3;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulsedR, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pulsedAlpha;
        ctx.fill();

        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const lineAlpha = (1 - dist / 150) * 0.1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            const isGold = p.color === '#FFC801' || q.color === '#FFC801';
            ctx.strokeStyle = isGold ? '#FFC801' : '#114C5A';
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  /* ── Number counter animation ── */
  useEffect(() => {
    const targets = [50000, 2400000000, 99.7];
    const formats = [
      (v: number) => `${Math.round(v / 1000)}K+`,
      (v: number) => `$${(v / 1e9).toFixed(1)}B`,
      (v: number) => `${v.toFixed(1)}%`,
    ];

    counterRefs.current.forEach((el, i) => {
      if (!el) return;
      const target = targets[i];
      const duration = 1800;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formats[i](eased * target);
        if (progress < 1) requestAnimationFrame(tick);
      };

      // Trigger after a short delay
      setTimeout(() => requestAnimationFrame(tick), 300 + i * 150);
    });
  }, []);

  return (
    <section
      id="hero"
      className={styles.hero}
      aria-labelledby="hero-heading"
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Ambient background layers */}
      <div className={styles.ambientTop}    aria-hidden="true" />
      <div className={styles.ambientBottom} aria-hidden="true" />
      <div className={styles.gridOverlay}   aria-hidden="true" />

      {/* Floating code card — decorative */}
      <div className={`${styles.floatingCard} ${styles.floatingCardLeft}`} aria-hidden="true">
        <div className={styles.cardDot} style={{ background: '#FF9932' }} />
        <div className={styles.cardDot} style={{ background: '#FFC801' }} />
        <div className={styles.cardDot} style={{ background: '#D9E8E2' }} />
        <pre className={styles.codeSnippet}>{`agent.run({
  task: "Automate CRM",
  model: "nexus-v3",
  memory: true
})`}</pre>
      </div>

      <div className={`${styles.floatingCard} ${styles.floatingCardRight}`} aria-hidden="true">
        <div className={styles.metricRow}>
          <IconArrowTrendingUp className={styles.metricIcon} />
          <span className={styles.metricLabel}>Automation rate</span>
        </div>
        <div className={styles.metricValue}>98.4%</div>
        <div className={styles.metricBar}>
          <div className={styles.metricBarFill} />
        </div>
      </div>

      {/* Main content */}
      <div className={`container ${styles.inner}`}>
        {/* Eyebrow badge */}
        <div className={`badge anim-fade-up ${styles.eyebrow}`} aria-label="New release announcement">
          <IconCog className={styles.eyebrowIcon} />
          <span>NexusAI v3 — Now with GPT-5 Native</span>
        </div>

        {/* Headline */}
        <h1 id="hero-heading" className={`${styles.heading} anim-fade-up anim-delay-1`}>
          <span className={styles.headingLine}>
            <span className="gradient-text-gold">Automate</span> the
          </span>
          <span className={styles.headingLine}>
            way you <span className={styles.headingHighlight}>work.</span>
          </span>
        </h1>

        {/* Subheading */}
        <p className={`${styles.subheading} anim-fade-up anim-delay-2`}>
          Deploy AI agents that handle complex workflows end-to-end — integrating
          with 200+ tools, learning from every task, and scaling to any volume
          without writing a single line of code.
        </p>

        {/* CTAs */}
        <div className={`${styles.ctas} anim-fade-up anim-delay-3`}>
          <a href="#pricing" className={`btn btn-primary ${styles.ctaPrimary}`} id="hero-cta-primary">
            <IconBolt className={styles.ctaIcon} />
            Start Automating Free
          </a>
          <a href="#features" className={`btn btn-ghost ${styles.ctaSecondary}`} id="hero-cta-secondary">
            Watch Demo
            <span className={styles.ctaPlay}>▶</span>
          </a>
        </div>

        {/* Trust signals */}
        <p className={`${styles.trustText} anim-fade-up anim-delay-4`}>
          No credit card · SOC 2 certified · 14-day trial
        </p>

        {/* Stats row */}
        <div className={`${styles.statsRow} anim-fade-up anim-delay-5`} role="group" aria-label="Platform statistics">
          {[
            { ref: 0, suffix: '', label: 'Teams running NexusAI', icon: '👥' },
            { ref: 1, suffix: '', label: 'Value automated annually', icon: '💰' },
            { ref: 2, suffix: '', label: 'Average platform uptime', icon: '⚡' },
          ].map(({ ref: refIdx, label, icon }, i) => (
            <div key={label} className={styles.stat}>
              <div className={styles.statTop}>
                <span className={styles.statEmoji} aria-hidden="true">{icon}</span>
                <strong
                  className={styles.statValue}
                  ref={(el) => { counterRefs.current[i] = el; }}
                  aria-live="polite"
                >
                  —
                </strong>
              </div>
              <span className={styles.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Integration strip */}
        <div className={`${styles.integrationsWrap} anim-fade-up anim-delay-6`}>
          <span className={styles.integrationsLabel}>Integrates with</span>
          <div className={styles.integrationsPills} aria-label="Supported integrations">
            {['Salesforce', 'Slack', 'HubSpot', 'Notion', 'GitHub', 'Stripe', 'Jira'].map((name) => (
              <span key={name} className={styles.pill}>{name}</span>
            ))}
            <span className={styles.pillMore}>+193 more</span>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
