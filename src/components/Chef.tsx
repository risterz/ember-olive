import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import SplitTextReveal from './SplitTextReveal';
import chefSyifaImage from '../assets/chef-syifa.jpg';

const CHEF_IMAGE_URL = chefSyifaImage;

// [PLACEHOLDER: All statistics and chef profile are fictional, replace with real data]
const STATS = [
  { value: 15, suffix: '+', label: 'Years of Fire Mastery' },
  { value: 48, suffix: '', label: 'Signature Formulations' },
  { value: 12, suffix: '', label: 'Terroirs Explored' },
];

export default function Chef() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.set('[data-chef-clip]', { clipPath: 'inset(0% 0 0 0)' });
        gsap.set('[data-chef-fade]', { opacity: 1, y: 0 });
        counterRefs.current.forEach((el, i) => {
          if (el) el.textContent = `${STATS[i].value}${STATS[i].suffix}`;
        });
        return;
      }

      // Image clip-path reveal
      gsap.fromTo(
        '[data-chef-clip]',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Scrubbed parallax on portrait
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.4,
        animation: gsap.fromTo(
          '[data-chef-img]',
          { yPercent: -10, scale: 1.15 },
          { yPercent: 10, scale: 1.15, ease: 'none' }
        ),
      });

      // Text elements staggered fade in
      gsap.fromTo(
        '[data-chef-fade]',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Stats counters animation
      STATS.forEach((stat, index) => {
        const el = counterRefs.current[index];
        if (!el) return;

        const counterObj = { count: 0 };
        gsap.to(counterObj, {
          count: stat.value,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counterObj.count)}${stat.suffix}`;
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  // Desktop 3D Tilt on portrait
  const handlePortraitMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !imageWrapperRef.current) return;
    const rect = imageWrapperRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(imageWrapperRef.current, {
      rotateY: x * 6,
      rotateX: -y * 6,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handlePortraitMouseLeave = () => {
    if (prefersReduced || !imageWrapperRef.current) return;
    gsap.to(imageWrapperRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out',
    });
  };

  return (
    <section
      id="chef"
      ref={sectionRef}
      className="bg-charcoal-light py-48 md:py-64 lg:py-72 px-8 sm:px-16 md:px-24 border-t border-cream/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Chapter Header */}
        <div data-chef-fade className="flex items-center gap-4 mb-20 md:mb-28">
          <span className="font-serif text-sm font-bold tracking-widest text-copper">
            04
          </span>
          <span className="h-px w-12 bg-copper/40" />
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-cream-muted">
            The Culinary Architect
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-20 lg:gap-28 xl:gap-36">
          {/* Portrait Image Column (52%) */}
          <div className="w-full lg:w-[50%]">
            <div
              ref={imageWrapperRef}
              data-chef-clip
              onMouseMove={handlePortraitMouseMove}
              onMouseLeave={handlePortraitMouseLeave}
              className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-charcoal shadow-2xl group cursor-pointer will-change-transform"
              style={{ clipPath: 'inset(100% 0 0 0)' }}
            >
              <img
                data-chef-img
                src={CHEF_IMAGE_URL}
                alt="Chef Syifa Umairah at the wood-fired hearth"
                loading="lazy"
                className="w-full h-full object-cover will-change-transform transition-filter duration-700 group-hover:brightness-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-light/80 via-transparent to-transparent opacity-80" />

              {/* Watermark in corner */}
              <div className="absolute bottom-6 left-6 right-6 p-5 bg-charcoal/80 backdrop-blur-md border border-cream/10 flex justify-between items-center">
                <div>
                  <p className="font-serif text-sm text-cream tracking-wide">
                    Executive Chef Syifa Umairah
                  </p>
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-copper mt-0.5">
                    Fifteen Years of Wood-Fired Mastery
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full border border-copper/40 flex items-center justify-center text-copper text-xs font-serif font-bold">
                  S
                </div>
              </div>
            </div>
          </div>

          {/* Text and Stats Column (48%) with generous spacing */}
          <div className="w-full lg:w-[50%] flex flex-col justify-center space-y-8">
            <div className="space-y-2">
              <span
                data-chef-fade
                className="block font-sans text-xs uppercase tracking-[0.35em] text-copper font-medium"
              >
                Executive Chef
              </span>
              <SplitTextReveal
                tag="h2"
                text="Syifa Umairah"
                className="font-serif text-5xl sm:text-6xl lg:text-7xl text-cream tracking-tight leading-[1.05]"
                wordClassName="text-cream"
              />
            </div>

            <div
              data-chef-fade
              className="w-20 h-px bg-copper my-6 origin-left"
            />

            <blockquote
              data-chef-fade
              className="font-serif italic text-2xl sm:text-3xl text-cream-dark leading-snug my-4 border-l-2 border-copper/50 pl-6"
            >
              "Cooking is not about following a recipe. It is about understanding fire, time and ingredients."
            </blockquote>

            <p
              data-chef-fade
              className="font-sans text-base sm:text-lg text-cream-muted leading-relaxed max-w-xl"
            >
              Trained across San Sebastian, Athens, and Southeast Asia, Syifa brings fifteen years of fearless culinary vision to Ember &amp; Olive. Every morning begins with wood selection: olive wood for delicate sweetness, almond wood for intense radiant heat.
            </p>

            <p
              data-chef-fade
              className="font-sans text-sm sm:text-base text-cream-dark leading-relaxed max-w-xl"
            >
              "When you cook over open embers, there are no shortcuts. Every variation in humidity, wind, and smoke transforms the character of the dish. It requires complete presence."
            </p>

            {/* Stats Grid with generous padding */}
            <div
              data-chef-fade
              className="grid grid-cols-3 gap-8 pt-10 border-t border-cream/10"
            >
              {STATS.map((stat, idx) => (
                <div key={stat.label} className="flex flex-col space-y-1">
                  <span
                    ref={(el) => {
                      counterRefs.current[idx] = el;
                    }}
                    className="font-serif text-4xl sm:text-5xl lg:text-6xl text-copper font-medium tabular-nums"
                  >
                    0
                  </span>
                  <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.18em] text-cream-muted leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
