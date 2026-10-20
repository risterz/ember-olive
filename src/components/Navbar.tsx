import { useEffect, useRef, useState } from 'react';
import { Menu as MenuIcon, X } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Our Story', href: '#story' },
  { label: 'Signatures', href: '#dishes' },
  { label: 'Menu', href: '#menu' },
  { label: 'Chef', href: '#chef' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Experience', href: '#experience' },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileLinksRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top -40',
        end: 99999,
        onUpdate: (self) => {
          const progress = Math.min(self.progress * 40, 1);
          if (!navRef.current) return;
          navRef.current.style.backgroundColor = `rgba(26, 26, 26, ${progress * 0.92})`;
          navRef.current.style.backdropFilter = `blur(${progress * 14}px)`;
          navRef.current.style.borderBottomColor = `rgba(245, 240, 232, ${progress * 0.08})`;
          navRef.current.style.paddingTop = `${1.25 - progress * 0.35}rem`;
          navRef.current.style.paddingBottom = `${1.25 - progress * 0.35}rem`;
        },
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  // Handle mobile menu open/close GSAP animations
  useEffect(() => {
    if (!mobileMenuRef.current) return;

    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';

      if (prefersReduced) {
        gsap.set(mobileMenuRef.current, { opacity: 1, visibility: 'visible' });
        return;
      }

      const tl = gsap.timeline();
      tl.set(mobileMenuRef.current, { visibility: 'visible' });
      tl.fromTo(
        mobileMenuRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, ease: 'power2.out' }
      );

      const items = mobileLinksRef.current?.querySelectorAll('[data-mobile-item]');
      if (items && items.length > 0) {
        tl.fromTo(
          items,
          { y: 35, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out' },
          '-=0.2'
        );
      }
    } else {
      document.body.style.overflow = '';

      if (prefersReduced) {
        gsap.set(mobileMenuRef.current, { opacity: 0, visibility: 'hidden' });
        return;
      }

      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          if (mobileMenuRef.current) {
            mobileMenuRef.current.style.visibility = 'hidden';
          }
        },
      });
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, prefersReduced]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 w-full z-[9000] px-6 md:px-12 lg:px-16 transition-[padding] duration-200 border-b border-transparent"
        style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            className="font-serif text-lg md:text-xl tracking-[0.2em] text-cream uppercase hover:text-copper transition-colors focus:outline-none focus:ring-1 focus:ring-copper py-2"
          >
            Ember &amp; Olive
          </a>

          {/* Desktop Nav Items */}
          <nav
            className="hidden lg:flex items-center space-x-8"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group relative font-sans text-xs tracking-[0.2em] uppercase text-cream-dark hover:text-cream transition-colors py-2 focus:outline-none focus:ring-1 focus:ring-copper"
              >
                <span>{item.label}</span>
                <span
                  data-nav-line
                  className="absolute bottom-0 left-0 w-full h-[1px] bg-copper scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
              </a>
            ))}
          </nav>

          {/* CTA Button Desktop */}
          <div className="hidden lg:block">
            <a
              href="#reservation"
              data-cursor="action"
              onMouseMove={(e) => {
                if (prefersReduced) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - (rect.left + rect.width / 2);
                const y = e.clientY - (rect.top + rect.height / 2);
                gsap.to(e.currentTarget, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: 'power2.out' });
              }}
              onMouseLeave={(e) => {
                if (prefersReduced) return;
                gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
              }}
              className="inline-block border border-copper/60 text-copper hover:bg-copper hover:text-charcoal px-6 py-2.5 font-sans text-xs uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none focus:ring-1 focus:ring-copper will-change-transform"
            >
              Reserve a Table
            </a>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex items-center justify-center w-11 h-11 text-cream hover:text-copper focus:outline-none focus:ring-1 focus:ring-copper"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Fullscreen Mobile Navigation Menu */}
      <div
        id="mobile-nav"
        ref={mobileMenuRef}
        className="fixed inset-0 z-[8500] bg-charcoal flex flex-col justify-between px-8 py-20 lg:hidden"
        style={{ visibility: 'hidden', opacity: 0 }}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex justify-between items-center border-b border-cream/10 pb-6">
          <span className="font-serif text-xl tracking-[0.2em] uppercase text-cream">
            Ember &amp; Olive
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center w-11 h-11 text-cream hover:text-copper focus:outline-none focus:ring-1 focus:ring-copper"
            aria-label="Close navigation menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav
          ref={mobileLinksRef}
          className="flex flex-col space-y-6 my-auto"
          aria-label="Mobile navigation"
        >
          {NAV_ITEMS.map((item) => (
            <div key={item.href} data-mobile-item className="overflow-hidden">
              <a
                href={item.href}
                onClick={handleLinkClick}
                className="font-serif text-3xl sm:text-4xl tracking-wide uppercase text-cream hover:text-copper transition-colors inline-block focus:outline-none focus:ring-1 focus:ring-copper"
              >
                {item.label}
              </a>
            </div>
          ))}
          <div data-mobile-item className="overflow-hidden pt-4">
            <a
              href="#reservation"
              onClick={handleLinkClick}
              className="font-serif text-2xl tracking-wider uppercase text-copper inline-block border-b border-copper pb-1"
            >
              Reserve a Table
            </a>
          </div>
        </nav>

        <div className="border-t border-cream/10 pt-6 flex justify-between items-center text-xs text-cream-muted uppercase tracking-[0.15em] font-sans">
          <span>18 Jalan Gastronomi, KL</span>
          <span>Fire. Flavor. Memory.</span>
        </div>
      </div>
    </>
  );
}
