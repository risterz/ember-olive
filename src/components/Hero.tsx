import { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { createHeroTimeline } from '../animations/heroAnimations';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { useMagnetic } from '../hooks/useMagnetic';
import EmberCanvas from './EmberCanvas';

interface HeroProps {
  animationReady: boolean;
}

const HERO_BG_URL =
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1600&q=80';

export default function Hero({ animationReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const primaryBtnMagnetic = useMagnetic<HTMLAnchorElement>({ strength: 0.35 });
  const secondaryBtnMagnetic = useMagnetic<HTMLAnchorElement>({ strength: 0.35 });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('[data-hero-label], [data-hero-heading], [data-hero-desc], [data-hero-btn], [data-hero-line]', {
          opacity: 1,
          y: 0,
          scaleX: 1,
        });
        return;
      }

      // Parallax on the background image
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to('[data-hero-bg]', { yPercent: 25, ease: 'none' }),
      });

      // Scroll indicator pulse
      gsap.to('[data-scroll-indicator]', {
        y: 10,
        opacity: 0.35,
        repeat: -1,
        yoyo: true,
        duration: 1.6,
        ease: 'power1.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const hasAnimatedRef = useRef(false);

  // Entrance animation driven by parent readiness
  useEffect(() => {
    if (!animationReady || !sectionRef.current || prefersReducedMotion) return;
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const ctx = gsap.context(() => {
      if (sectionRef.current) {
        createHeroTimeline(sectionRef.current, prefersReducedMotion);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [animationReady, prefersReducedMotion]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-charcoal flex items-center"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          data-hero-bg
          src={HERO_BG_URL}
          alt="Elegant dining table bathed in warm candlelight"
          className="h-full w-full object-cover will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/95 via-charcoal/70 to-charcoal/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/50" />
      </div>

      {/* Ambient Glowing Floating Ember Particles */}
      <EmberCanvas density={40} />

      {/* Content */}
      <div className="relative z-20 flex h-full w-full flex-col justify-center px-8 sm:px-16 md:px-24 lg:px-32 py-32">
        <div className="max-w-4xl space-y-8 md:space-y-10">
          <p
            data-hero-label
            className="font-sans text-xs uppercase tracking-[0.35em] text-copper opacity-0 font-medium"
          >
            EST. 2026 · WOOD-FIRED GASTRONOMY
          </p>

          <h1 className="space-y-2 md:space-y-4">
            {['FIRE.', 'FLAVOR.', 'MEMORY.'].map((word) => (
              <div key={word} className="overflow-hidden">
                <span
                  data-hero-heading
                  className="block font-serif text-6xl tracking-tight text-cream opacity-0 sm:text-7xl md:text-8xl lg:text-9xl will-change-transform"
                >
                  {word}
                </span>
              </div>
            ))}
          </h1>

          <p
            data-hero-desc
            className="max-w-xl font-sans text-lg text-cream-dark opacity-0 md:text-xl leading-relaxed"
          >
            Modern Mediterranean cuisine shaped by fire, season and tradition.
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-4">
            <a
              ref={primaryBtnMagnetic.ref}
              data-hero-btn
              href="#menu"
              data-cursor="action"
              className="bg-copper px-9 py-4 font-sans text-xs uppercase tracking-[0.2em] text-charcoal font-semibold opacity-0 transition-colors hover:bg-copper-light will-change-transform shadow-lg shadow-copper/20"
            >
              <span ref={primaryBtnMagnetic.textRef} className="inline-block pointer-events-none">
                VIEW THE MENU
              </span>
            </a>
            <a
              ref={secondaryBtnMagnetic.ref}
              data-hero-btn
              href="#reservation"
              data-cursor="action"
              className="border border-cream/30 px-9 py-4 font-sans text-xs uppercase tracking-[0.2em] text-cream opacity-0 transition-colors hover:border-copper hover:text-copper will-change-transform"
            >
              <span ref={secondaryBtnMagnetic.textRef} className="inline-block pointer-events-none">
                RESERVE A TABLE
              </span>
            </a>
          </div>

          <div
            data-hero-line
            className="h-px w-28 origin-left scale-x-0 bg-copper pt-2"
          />
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-scroll-indicator
        className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 text-cream-muted"
        aria-hidden="true"
      >
        <span className="font-sans text-[10px] uppercase tracking-[0.28em]">
          Scroll
        </span>
        <ChevronDown className="h-4 w-4 text-copper" />
      </div>
    </section>
  );
}
