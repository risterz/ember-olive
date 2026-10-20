import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import SplitTextReveal from './SplitTextReveal';

const INTRO_IMAGE_URL =
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80';

export default function Intro() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set('[data-intro-image]', { clipPath: 'inset(0% 0 0 0)' });
        gsap.set('[data-intro-fade], [data-intro-line]', {
          opacity: 1,
          y: 0,
          scaleX: 1,
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      // Image clip-path reveal
      tl.fromTo(
        '[data-intro-image]',
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'power4.inOut' },
        0
      );

      // Smooth parallax scrub on inner image
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        animation: gsap.fromTo(
          '[data-intro-img]',
          { yPercent: -12, scale: 1.15 },
          { yPercent: 12, scale: 1.15, ease: 'none' }
        ),
      });

      // Decorative line expands
      tl.fromTo(
        '[data-intro-line]',
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power2.inOut' },
        0.5
      );

      // Text elements staggered fade in
      tl.fromTo(
        '[data-intro-fade]',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out' },
        0.6
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Subtle 3D tilt on image hover
  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !imageWrapperRef.current) return;
    const rect = imageWrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(imageWrapperRef.current, {
      rotateY: x * 6,
      rotateX: -y * 6,
      transformPerspective: 1200,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handleImageMouseLeave = () => {
    if (prefersReducedMotion || !imageWrapperRef.current) return;
    gsap.to(imageWrapperRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
  };

  return (
    <section
      id="story"
      ref={sectionRef}
      className="bg-charcoal py-48 md:py-64 lg:py-72 border-t border-cream/5 relative overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-8 sm:px-16 md:px-24 lg:px-32">
        {/* Chapter Header */}
        <div data-intro-fade className="flex items-center gap-4 mb-20 md:mb-28">
          <span className="font-serif text-sm font-bold tracking-widest text-copper">
            01
          </span>
          <span className="h-px w-12 bg-copper/40" />
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-cream-muted">
            Our Philosophy
          </span>
        </div>

        {/* Editorial asymmetric layout */}
        <div className="flex flex-col items-center gap-20 lg:flex-row lg:items-start lg:gap-28 xl:gap-36">
          {/* Image column: 55% */}
          <div className="w-full lg:w-[54%]">
            <div
              ref={imageWrapperRef}
              data-intro-image
              onMouseMove={handleImageMouseMove}
              onMouseLeave={handleImageMouseLeave}
              className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:h-[78vh] overflow-hidden bg-charcoal-light shadow-2xl will-change-transform group cursor-pointer"
              style={{ clipPath: 'inset(100% 0 0 0)' }}
            >
              <img
                data-intro-img
                src={INTRO_IMAGE_URL}
                alt="Wood-fired oven with dancing flames illuminating handcrafted dishes"
                className="h-full w-full object-cover will-change-transform transition-filter duration-700 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent opacity-60" />

              {/* Floating aesthetic caption badge */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end p-4 bg-charcoal/80 backdrop-blur-md border border-cream/10">
                <div>
                  <p className="font-serif text-xs text-cream tracking-wider uppercase">
                    The Hearth
                  </p>
                  <p className="font-sans text-[10px] text-cream-muted uppercase tracking-[0.2em] mt-0.5">
                    Ancient Olive Wood Combustion
                  </p>
                </div>
                <span className="font-serif text-sm text-copper font-medium">850°C</span>
              </div>
            </div>
          </div>

          {/* Text column: 46%, vertically aligned with ample spacing */}
          <div className="flex w-full flex-col justify-center lg:w-[46%] lg:pt-16 xl:pt-24 space-y-8">
            <div className="space-y-4">
              <SplitTextReveal
                tag="h2"
                text="Cooking with fire. Serving with soul."
                className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.12]"
                wordClassName="text-cream"
                stagger={0.05}
              />
            </div>

            <div
              data-intro-line
              className="h-px w-20 origin-left scale-x-0 bg-copper my-2"
            />

            <p
              data-intro-fade
              className="max-w-xl font-sans text-base sm:text-lg leading-relaxed text-cream-dark opacity-0"
            >
              At Ember &amp; Olive, ancient cooking traditions meet contemporary
              Mediterranean cuisine. Every dish begins with fire and ends with a
              story. Our kitchen is built around a custom wood-fired oven,
              cold-pressed estate olive oils, and ingredients sourced directly from artisan growers across the Aegean and Ligurian coasts.
            </p>

            <p
              data-intro-fade
              className="max-w-xl font-sans text-sm sm:text-base leading-relaxed text-cream-muted opacity-0"
            >
              We cook over embers of seasoned olive and almond wood, letting smoke and intense radiant heat caramelize natural sugars, tenderize prime cuts, and infuse heirloom grains with an aroma found nowhere else.
            </p>

            {/* [PLACEHOLDER: Chef name is fictional, replace with real chef name] */}
            <div data-intro-fade className="pt-6 opacity-0">
              <p className="font-serif text-xl italic text-copper">
                Chef Syifa Umairah
              </p>
              <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-cream-muted mt-1">
                Founder &amp; Culinary Director
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
