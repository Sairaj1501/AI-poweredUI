'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './Hero.module.css';
import { IconBolt, IconArrowTrendingUp, IconCog, IconNexusLogo } from './Icons';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  /* ── ADVANCED Animated canvas: particle network with bloom & gravity ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    let mouseX = 0, mouseY = 0;
    let time = 0;

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 45 : 90;
    const COLORS = ['#FFC801', '#FF9932', '#114C5A', '#D9E8E2'];

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      r:  Math.random() * 3 + 1,
      alpha: Math.random() * 0.8 + 0.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: (Math.random() * 0.03) + 0.008,
      mass: Math.random() * 1.5 + 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
    }));

    const mouseMoveHandler = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('mousemove', mouseMoveHandler);

    const draw = (t: number) => {
      time = t / 1000;
      ctx.fillStyle = 'rgba(13, 26, 34, 0.02)';
      ctx.fillRect(0, 0, W, H);

      particles.forEach((p, i) => {
        // Physics simulation with gravity
        p.vy += 0.01 * p.mass; // Gravity
        
        // Mouse attraction
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          const force = (1 - dist / 300) * 0.08;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        p.rotation += p.rotationSpeed;

        // Wrap around
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        const pulsedAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
        const pulsedR = p.r * (0.9 + 0.3 * Math.sin(p.pulse + Math.PI / 2));

        // ENHANCED BLOOM GLOW (multi-layer)
        for (let layer = 3; layer > 0; layer--) {
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, pulsedR * (4 + layer * 2));
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.5, p.color + '44');
          grad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(p.x, p.y, pulsedR * (4 + layer * 2), 0, Math.PI * 2);
          ctx.fillStyle = grad;
          ctx.globalAlpha = (pulsedAlpha * 0.15) / layer;
          ctx.fill();
        }

        // Core dot with subtle rotation
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.beginPath();
        ctx.arc(0, 0, pulsedR, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = pulsedAlpha;
        ctx.fill();
        ctx.restore();

        // Enhanced connections with gradient
        for (let j = i + 1; j < Math.min(i + 8, particles.length); j++) {
          const q = particles[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200) {
            const lineAlpha = (1 - dist / 200) * 0.15;
            const grad = ctx.createLinearGradient(p.x, p.y, q.x, q.y);
            const isGold = p.color === '#FFC801' || q.color === '#FFC801';
            const color = isGold ? '#FFC801' : '#114C5A';
            grad.addColorStop(0, color + Math.floor(lineAlpha * 255).toString(16).padStart(2, '0'));
            grad.addColorStop(1, 'transparent');
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = grad;
            ctx.globalAlpha = lineAlpha;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); ro.disconnect(); window.removeEventListener('mousemove', mouseMoveHandler); };
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
      ref={heroRef}
      id="hero"
      className={styles.hero}
      aria-labelledby="hero-heading"
    >
      {/* Particle canvas */}
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {/* Ambient background layers */}
      <motion.div 
        className={styles.ambientTop}    
        aria-hidden="true"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div 
        className={styles.ambientBottom} 
        aria-hidden="true"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
      />
      <div className={styles.gridOverlay}   aria-hidden="true" />

      {/* Floating code card — decorative */}
      <motion.div 
        className={`${styles.floatingCard} ${styles.floatingCardLeft}`} 
        aria-hidden="true"
        animate={{ y: [0, -20, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className={styles.cardDot} style={{ background: '#FF9932' }} />
        <div className={styles.cardDot} style={{ background: '#FFC801' }} />
        <div className={styles.cardDot} style={{ background: '#D9E8E2' }} />
        <pre className={styles.codeSnippet}>{`agent.run({
  task: "Automate CRM",
  model: "nexus-v3",
  memory: true
})`}</pre>
      </motion.div>

      <motion.div 
        className={`${styles.floatingCard} ${styles.floatingCardRight}`} 
        aria-hidden="true"
        animate={{ y: [0, 25, 0], rotate: [0, -2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <div className={styles.metricRow}>
          <IconArrowTrendingUp className={styles.metricIcon} />
          <span className={styles.metricLabel}>Automation rate</span>
        </div>
        <div className={styles.metricValue}>98.4%</div>
        <div className={styles.metricBar}>
          <div className={styles.metricBarFill} />
        </div>
      </motion.div>

      {/* Main content */}
      <div className={`container ${styles.inner}`}>
        {/* Eyebrow badge */}
        <motion.div 
          className={`badge anim-fade-up ${styles.eyebrow}`} 
          aria-label="New release announcement"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <IconCog className={styles.eyebrowIcon} />
          <span>NexusAI v3 — Now with GPT-5 Native</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          id="hero-heading" 
          className={`${styles.heading}`}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
        >
          <span className={styles.headingLine}>
            <motion.span 
              className="gradient-text-gold"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Automate
            </motion.span> the
          </span>
          <span className={styles.headingLine}>
            way you{' '}
            <motion.span 
              className={styles.headingHighlight}
              animate={{ scale: [1, 1.05, 1], color: ['#FFC801', '#FF9932', '#FFC801'] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              work.
            </motion.span>
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          className={`${styles.subheading}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Deploy AI agents that handle complex workflows end-to-end — integrating
          with 200+ tools, learning from every task, and scaling to any volume
          without writing a single line of code.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          className={`${styles.ctas}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a 
            href="#pricing" 
            className={`btn btn-primary ${styles.ctaPrimary}`} 
            id="hero-cta-primary"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(255,200,1,0.4)' }}
            whileTap={{ scale: 0.98 }}
          >
            <IconBolt className={styles.ctaIcon} />
            Start Automating Free
          </motion.a>
          <motion.a 
            href="#features" 
            className={`btn btn-ghost ${styles.ctaSecondary}`} 
            id="hero-cta-secondary"
            whileHover={{ x: 6, borderColor: '#FFC801' }}
            whileTap={{ x: 2 }}
          >
            Watch Demo
            <motion.span 
              className={styles.ctaPlay}
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              ▶
            </motion.span>
          </motion.a>
        </motion.div>

        {/* Trust signals */}
        <motion.p 
          className={`${styles.trustText}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          No credit card · SOC 2 certified · 14-day trial
        </motion.p>

        {/* Stats row */}
        <motion.div 
          className={`${styles.statsRow}`} 
          role="group" 
          aria-label="Platform statistics"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { ref: 0, suffix: '', label: 'Teams running NexusAI', icon: '👥' },
            { ref: 1, suffix: '', label: 'Value automated annually', icon: '💰' },
            { ref: 2, suffix: '', label: 'Average platform uptime', icon: '⚡' },
          ].map(({ ref: refIdx, label, icon }, i) => (
            <motion.div 
              key={label} 
              className={styles.stat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85 + i * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <div className={styles.statTop}>
                <motion.span 
                  className={styles.statEmoji} 
                  aria-hidden="true"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                >
                  {icon}
                </motion.span>
                <strong
                  className={styles.statValue}
                  ref={(el) => { counterRefs.current[i] = el; }}
                  aria-live="polite"
                >
                  —
                </strong>
              </div>
              <span className={styles.statLabel}>{label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Integration strip */}
        <motion.div 
          className={`${styles.integrationsWrap}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <span className={styles.integrationsLabel}>Integrates with</span>
          <div className={styles.integrationsPills} aria-label="Supported integrations">
            {['Salesforce', 'Slack', 'HubSpot', 'Notion', 'GitHub', 'Stripe', 'Jira'].map((name, i) => (
              <motion.span 
                key={name} 
                className={styles.pill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.05 + i * 0.05 }}
                whileHover={{ scale: 1.1, borderColor: '#FFC801' }}
              >
                {name}
              </motion.span>
            ))}
            <motion.span 
              className={styles.pillMore}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.4 }}
            >
              +193 more
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className={styles.bottomFade} aria-hidden="true" />
    </section>
  );
}
