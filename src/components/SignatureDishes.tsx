import { useEffect, useRef } from 'react';
import { signatureDishes } from '../data/dishes';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import SplitTextReveal from './SplitTextReveal';

export default function SignatureDishes() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set('[data-dish-clip]', { clipPath: 'inset(0% 0 0 0)' });
        gsap.set('[data-dish-text]', { opacity: 1, y: 0 });
        return;
      }

      // Title & header entrance
      gsap.fromTo(
        '[data-dishes-header]',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Card entrance animation and scrubbed parallax for each dish
      const cards = containerRef.current?.querySelectorAll('[data-dish-card]');
      if (cards) {
        cards.forEach((card) => {
          const clipEl = card.querySelector('[data-dish-clip]');
          const imgEl = card.querySelector('[data-dish-img]');
          const textEls = card.querySelectorAll('[data-dish-text]');

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          });

          if (clipEl) {
            tl.fromTo(
              clipEl,
              { clipPath: 'inset(100% 0 0 0)' },
              { clipPath: 'inset(0% 0 0 0)', duration: 1.2, ease: 'power4.inOut' },
              0
            );
          }

          if (imgEl) {
            tl.fromTo(
              imgEl,
              { scale: 1.2 },
              { scale: 1, duration: 1.4, ease: 'power3.out' },
              0
            );

            // Parallax scrub inside overflow-hidden frame
            ScrollTrigger.create({
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
              animation: gsap.fromTo(
                imgEl,
                { yPercent: -8 },
                { yPercent: 8, ease: 'none' }
              ),
            });
          }

          if (textEls.length > 0) {
            tl.fromTo(
              textEls,
              { opacity: 0, y: 25 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' },
              0.4
            );
          }
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  // Desktop 3D Tilt on mouse move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(card, {
      rotateY: x * 8,
      rotateX: -y * 8,
      transformPerspective: 1000,
      duration: 0.35,
      ease: 'power2.out',
    });
  };

  const handleMouseEnter = (card: HTMLElement) => {
    if (prefersReduced) return;
    const img = card.querySelector('[data-dish-img]');
    const num = card.querySelector('[data-dish-num]');
    const title = card.querySelector('[data-dish-title]');

    if (img) {
      gsap.to(img, { scale: 1.08, filter: 'brightness(1.1)', duration: 0.6, ease: 'power3.out' });
    }
    if (num) {
      gsap.to(num, { opacity: 0.35, x: 10, duration: 0.4, ease: 'power2.out' });
    }
    if (title) {
      gsap.to(title, { color: '#d4956a', duration: 0.3, ease: 'power2.out' });
    }
  };

  const handleMouseLeave = (card: HTMLElement) => {
    if (prefersReduced) return;
    const img = card.querySelector('[data-dish-img]');
    const num = card.querySelector('[data-dish-num]');
    const title = card.querySelector('[data-dish-title]');

    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out',
    });

    if (img) {
      gsap.to(img, { scale: 1, filter: 'brightness(1)', duration: 0.6, ease: 'power3.out' });
    }
    if (num) {
      gsap.to(num, { opacity: 0.15, x: 0, duration: 0.4, ease: 'power2.out' });
    }
    if (title) {
      gsap.to(title, { color: '#f5f0e8', duration: 0.3, ease: 'power2.out' });
    }
  };

  return (
    <section
      id="dishes"
      ref={sectionRef}
      className="bg-charcoal-light py-40 md:py-52 lg:py-60 px-8 sm:px-16 md:px-24 border-t border-cream/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Chapter Header */}
        <div data-dishes-header className="flex items-center gap-4 mb-8">
          <span className="font-serif text-sm font-bold tracking-widest text-copper">
            02
          </span>
          <span className="h-px w-12 bg-copper/40" />
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-cream-muted">
            Signature Degustation
          </span>
        </div>

        {/* Section Title & Description */}
        <div data-dishes-header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-24 md:mb-32">
          <SplitTextReveal
            tag="h2"
            text="Sculpted by Flame & Season"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream tracking-tight max-w-2xl leading-[1.15]"
            wordClassName="text-cream"
          />
          <p className="font-sans text-base text-cream-dark max-w-md leading-relaxed">
            Four defining plates that embody our wood-fired philosophy. Sourced daily from local coastal divers and artisan Mediterranean growers.
          </p>
        </div>

        {/* Editorial 2-Column Grid: Fully Visible, No Pinning, Generous Gaps */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-20 sm:gap-24 lg:gap-28 xl:gap-32"
        >
          {signatureDishes.map((dish) => (
            <div
              key={dish.id}
              data-dish-card
              data-cursor="view"
              onMouseEnter={(e) => handleMouseEnter(e.currentTarget)}
              onMouseMove={handleMouseMove}
              onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
              className="group relative flex flex-col will-change-transform"
            >
              {/* Image Container with Reveal Mask */}
              <div
                data-dish-clip
                className="relative aspect-[4/3] sm:aspect-[16/11] overflow-hidden bg-charcoal shadow-2xl"
                style={{ clipPath: 'inset(100% 0 0 0)' }}
              >
                <img
                  data-dish-img
                  src={dish.image}
                  alt={dish.name}
                  loading="lazy"
                  className="w-full h-full object-cover will-change-transform transition-transform duration-700"
                />

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-transparent to-transparent opacity-70 pointer-events-none" />

                {/* Number Watermark */}
                <span
                  data-dish-num
                  className="absolute top-4 left-6 font-serif text-7xl sm:text-8xl font-bold text-cream/15 pointer-events-none select-none tracking-tighter will-change-transform transition-all duration-400"
                >
                  {dish.number}
                </span>

                {/* Price pill */}
                <div className="absolute bottom-6 right-6 bg-charcoal/90 backdrop-blur-md px-5 py-2 border border-cream/10 shadow-lg">
                  <span className="font-sans text-xs tracking-[0.2em] text-copper font-semibold">
                    {dish.price}
                  </span>
                </div>
              </div>

              {/* Text Info with generous spacing */}
              <div className="mt-8 flex flex-col space-y-3">
                <div className="flex justify-between items-baseline">
                  <h3
                    data-dish-text
                    data-dish-title
                    className="font-serif text-2xl sm:text-3xl text-cream tracking-wide transition-colors"
                  >
                    {dish.name}
                  </h3>
                </div>

                <p
                  data-dish-text
                  className="font-sans text-sm sm:text-base text-cream-muted tracking-wide leading-relaxed"
                >
                  {dish.description}
                </p>

                <div
                  data-dish-text
                  className="pt-4 flex items-center gap-3"
                >
                  <span className="h-px w-10 bg-copper/40 group-hover:w-16 group-hover:bg-copper transition-all duration-300" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-copper font-medium">
                    Signature Course
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
