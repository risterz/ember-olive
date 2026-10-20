import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials } from '../data/testimonials';
import { gsap } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useMagnetic } from '../hooks/useMagnetic';

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  const prevBtnMagnetic = useMagnetic<HTMLButtonElement>({ strength: 0.4 });
  const nextBtnMagnetic = useMagnetic<HTMLButtonElement>({ strength: 0.4 });

  // ScrollTrigger entrance
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      gsap.fromTo(
        '[data-testimonial-entrance]',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  // Transition quote using GSAP
  const changeQuote = (newIndex: number) => {
    if (newIndex === currentIndex) return;

    if (prefersReduced) {
      setCurrentIndex(newIndex);
      return;
    }

    const currentEl = quoteRef.current;
    if (!currentEl) {
      setCurrentIndex(newIndex);
      return;
    }

    gsap.to(currentEl, {
      opacity: 0,
      y: -25,
      filter: 'blur(4px)',
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentIndex(newIndex);
        gsap.fromTo(
          currentEl,
          { opacity: 0, y: 25, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' }
        );
      },
    });
  };

  const handleNext = () => {
    changeQuote((currentIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    changeQuote((currentIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance every 6 seconds, pauses on hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused]);

  const current = testimonials[currentIndex];

  return (
    <section
      ref={sectionRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bg-charcoal-light py-48 md:py-64 lg:py-72 px-8 sm:px-16 md:px-24 border-t border-cream/5 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Chapter Header */}
        <div data-testimonial-entrance className="flex items-center gap-4 mb-12 justify-center">
          <span className="font-serif text-sm font-bold tracking-widest text-copper">
            07
          </span>
          <span className="h-px w-12 bg-copper/40" />
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-cream-muted">
            Acclaim &amp; Critique
          </span>
        </div>

        {/* Decorative Quote Icon */}
        <div data-testimonial-entrance className="flex justify-center mb-8">
          <Quote className="w-12 h-12 text-copper/35" />
        </div>

        {/* Quote Content with generous spacing */}
        <div ref={quoteRef} className="min-h-[180px] sm:min-h-[160px] flex flex-col justify-center">
          <blockquote className="font-serif italic text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-cream leading-[1.3] mb-10 max-w-3xl mx-auto">
            "{current.quote}"
          </blockquote>

          {/* [PLACEHOLDER: Testimonial attribution is a placeholder per R-18] */}
          <div className="font-sans text-xs sm:text-sm uppercase tracking-[0.25em] text-cream-muted">
            <span className="text-copper font-medium">{current.name}</span>
            <span className="mx-3 text-cream/30">·</span>
            <span>{current.title}</span>
          </div>
        </div>

        {/* Navigation Controls with generous top margin */}
        <div
          data-testimonial-entrance
          className="flex items-center justify-center gap-8 mt-16 md:mt-24"
        >
          <button
            ref={prevBtnMagnetic.ref}
            type="button"
            onClick={handlePrev}
            className="w-14 h-14 border border-cream/20 flex items-center justify-center text-cream-dark hover:border-copper hover:text-copper transition-colors focus:outline-none focus:ring-1 focus:ring-copper cursor-pointer will-change-transform shadow-md"
            aria-label="Previous testimonial"
          >
            <span ref={prevBtnMagnetic.textRef} className="pointer-events-none">
              <ChevronLeft className="w-5 h-5" />
            </span>
          </button>

          {/* Progress Indicators */}
          <div className="flex items-center gap-2.5">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => changeQuote(idx)}
                aria-label={`Go to testimonial ${idx + 1}`}
                className={`h-1.5 transition-all duration-300 rounded-none cursor-pointer ${
                  idx === currentIndex ? 'w-10 bg-copper' : 'w-2.5 bg-cream/20 hover:bg-cream/40'
                }`}
              />
            ))}
          </div>

          <button
            ref={nextBtnMagnetic.ref}
            type="button"
            onClick={handleNext}
            className="w-14 h-14 border border-cream/20 flex items-center justify-center text-cream-dark hover:border-copper hover:text-copper transition-colors focus:outline-none focus:ring-1 focus:ring-copper cursor-pointer will-change-transform shadow-md"
            aria-label="Next testimonial"
          >
            <span ref={nextBtnMagnetic.textRef} className="pointer-events-none">
              <ChevronRight className="w-5 h-5" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
