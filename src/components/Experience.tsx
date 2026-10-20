import { useEffect, useRef, useState } from 'react';
import { experiences } from '../data/experiences';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import SplitTextReveal from './SplitTextReveal';
import EmberCanvas from './EmberCanvas';

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeExpId, setActiveExpId] = useState<number>(experiences[0].id);
  const bgImagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      // Parallax on section background
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        animation: gsap.to('[data-experience-bg-container]', {
          yPercent: 14,
          ease: 'none',
        }),
      });

      // Entrance animation for headline and cards
      gsap.fromTo(
        '[data-experience-entrance]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  const handleHoverExperience = (id: number) => {
    if (id === activeExpId) return;
    setActiveExpId(id);

    if (prefersReduced) return;

    // Crossfade background images
    experiences.forEach((exp, idx) => {
      const el = bgImagesRef.current[idx];
      if (!el) return;

      if (exp.id === id) {
        gsap.to(el, { opacity: 0.45, scale: 1.05, duration: 0.8, ease: 'power2.out' });
      } else {
        gsap.to(el, { opacity: 0, scale: 1, duration: 0.8, ease: 'power2.out' });
      }
    });
  };

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col justify-center items-center py-48 md:py-64 lg:py-72 px-8 sm:px-16 md:px-24 overflow-hidden bg-charcoal border-t border-cream/5"
    >
      {/* Background Images Crossfade Layer */}
      <div
        data-experience-bg-container
        className="absolute inset-0 w-full h-[120%] -top-[10%] pointer-events-none select-none"
      >
        {experiences.map((exp, idx) => (
          <div
            key={exp.id}
            ref={(el) => {
              bgImagesRef.current[idx] = el;
            }}
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-700 will-change-transform"
            style={{
              backgroundImage: `url(${exp.image})`,
              opacity: idx === 0 ? 0.45 : 0,
            }}
          />
        ))}

        {/* Dark Editorial Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-charcoal/90" />
      </div>

      {/* Ambient Ember Particles for warmth */}
      <EmberCanvas density={30} className="z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-6xl w-full mx-auto text-center">
        {/* Chapter Header */}
        <div data-experience-entrance className="flex items-center gap-4 mb-8 justify-center">
          <span className="font-serif text-sm font-bold tracking-widest text-copper">
            06
          </span>
          <span className="h-px w-12 bg-copper/40" />
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-cream-muted">
            The Spaces
          </span>
        </div>

        <div data-experience-entrance className="mb-24 md:mb-32">
          <SplitTextReveal
            tag="h2"
            text="An evening worth remembering."
            className="font-serif text-4xl sm:text-5xl lg:text-7xl text-cream tracking-tight max-w-4xl mx-auto leading-[1.08]"
            wordClassName="text-cream"
          />
          <div className="w-20 h-px bg-copper mx-auto my-10" />
          <p className="font-sans text-sm sm:text-base text-cream-muted max-w-xl mx-auto leading-relaxed">
            From intimate hearthside tables to private dining salons and counter-front culinary performance.
          </p>
        </div>

        {/* Experience Cards with generous gaps */}
        <div
          data-experience-entrance
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 lg:gap-12 text-left"
        >
          {experiences.map((exp) => {
            const isActive = exp.id === activeExpId;

            return (
              <div
                key={exp.id}
                onMouseEnter={() => handleHoverExperience(exp.id)}
                onClick={() => handleHoverExperience(exp.id)}
                className={`group cursor-pointer border-t pt-10 pb-8 px-6 sm:px-8 transition-all duration-400 will-change-transform ${
                  isActive
                    ? 'border-copper bg-charcoal/70 backdrop-blur-md -translate-y-3 shadow-2xl'
                    : 'border-cream/20 bg-charcoal/30 backdrop-blur-sm hover:border-cream/40 hover:-translate-y-1'
                }`}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="font-serif text-xs font-bold tracking-widest text-copper">
                    0{exp.id}
                  </span>
                  <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream-muted">
                    Capacity: 2–36
                  </span>
                </div>

                <h3
                  className={`font-serif text-2xl sm:text-3xl tracking-wide uppercase transition-colors duration-300 ${
                    isActive ? 'text-copper' : 'text-cream group-hover:text-cream'
                  }`}
                >
                  {exp.title}
                </h3>

                <p
                  className={`font-sans text-sm sm:text-base text-cream-dark leading-relaxed mt-5 transition-opacity duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-90'
                  }`}
                >
                  {exp.description}
                </p>

                <div
                  className={`mt-8 h-[2px] bg-copper transition-all duration-400 ${
                    isActive ? 'w-20' : 'w-0'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
