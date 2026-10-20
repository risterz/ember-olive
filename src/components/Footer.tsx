import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { useMagnetic } from '../hooks/useMagnetic';

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#' },
  { label: 'Facebook', href: '#' },
  { label: 'TikTok', href: '#' },
];

const NAV_LINKS = [
  { label: 'Contact', href: 'mailto:hello@emberandolive.com', external: false },
  { label: 'Reservations', href: '#reservation', external: false },
  { label: 'Privacy', href: '#', external: false, ariaLabel: 'Privacy policy' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const backToTopMagnetic = useMagnetic<HTMLButtonElement>({ strength: 0.35 });

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-footer-animate]',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const linkClasses =
    'font-sans text-xs uppercase tracking-[0.2em] text-cream-muted hover:text-copper transition-colors py-1';

  return (
    <footer
      ref={footerRef}
      className="bg-charcoal border-t border-cream/10 py-36 md:py-48 px-8 sm:px-16 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto text-center space-y-12">
        <div data-footer-animate className="space-y-4">
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream tracking-[0.25em] uppercase">
            Ember &amp; Olive
          </h2>
          <p className="font-sans text-xs sm:text-sm text-copper tracking-[0.3em] uppercase">
            Fire · Flavor · Memory
          </p>
        </div>

        <div
          data-footer-animate
          className="w-20 h-px bg-copper mx-auto my-12"
          role="separator"
        />

        <nav
          data-footer-animate
          className="flex flex-wrap justify-center gap-x-12 gap-y-4"
          aria-label="Footer navigation"
        >
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${link.label} (opens in new tab)`}
              className={linkClasses}
            >
              {link.label}
            </a>
          ))}
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              {...(link.ariaLabel ? { 'aria-label': link.ariaLabel } : {})}
              className={linkClasses}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div data-footer-animate className="pt-8 flex flex-col sm:flex-row items-center justify-between border-t border-cream/5 gap-6">
          <p className="font-sans text-xs text-cream-muted/50 tracking-wider">
            © 2026 Ember &amp; Olive. All rights reserved. Mediterranean Wood-Fired Gastronomy.
          </p>

          <button
            ref={backToTopMagnetic.ref}
            onClick={scrollToTop}
            className="font-sans text-xs uppercase tracking-[0.2em] text-copper hover:text-copper-light transition-colors cursor-pointer border-b border-copper/40 pb-0.5 will-change-transform"
          >
            <span ref={backToTopMagnetic.textRef} className="pointer-events-none inline-block">
              Back to Top ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
