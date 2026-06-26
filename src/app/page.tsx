'use client';
import { useRevealOnScroll } from '@/hooks/useRevealOnScroll';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Pricing from '@/components/Pricing';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  // Activate scroll-reveal on mount
  useRevealOnScroll();

  return (
    <>
      {/* Noise texture overlay */}
      <div className="noise-overlay" aria-hidden="true" />

      {/* Skip to content — accessibility */}
      <a href="#hero" className="sr-only">Skip to main content</a>

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main id="main-content" role="main">
        {/* Hero Section */}
        <Hero />

        {/* Feature 2: Bento-to-Accordion */}
        <Features />

        {/* Social Proof / Testimonials */}
        <Testimonials />

        {/* Feature 1: Matrix Pricing + Currency Switcher */}
        <Pricing />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
