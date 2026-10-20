import { useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { useMagnetic } from '../hooks/useMagnetic';
import SplitTextReveal from './SplitTextReveal';

export default function Location() {
  const sectionRef = useRef<HTMLElement>(null);
  const directionsMagnetic = useMagnetic<HTMLAnchorElement>({ strength: 0.35 });

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-location-animate]',
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
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
  }, []);

  return (
    <section
      id="location"
      ref={sectionRef}
      className="bg-charcoal-light py-48 md:py-64 lg:py-72 px-8 sm:px-16 md:px-24 border-t border-cream/5 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 md:gap-0">
          {/* Left Column - Location with generous padding */}
          <div className="md:pr-16 lg:pr-24 md:border-r md:border-cream/10 space-y-8">
            <p
              data-location-animate
              className="uppercase tracking-[0.35em] text-xs text-copper font-medium"
            >
              Find Us
            </p>

            <SplitTextReveal
              tag="h3"
              text="Ember & Olive"
              className="font-serif text-4xl sm:text-5xl text-cream tracking-tight"
              wordClassName="text-cream"
            />

            {/* [PLACEHOLDER: Address is fictional] */}
            <address
              data-location-animate
              className="font-sans text-cream-dark not-italic text-base sm:text-lg leading-relaxed space-y-1"
            >
              <p>18 Jalan Gastronomi</p>
              <p>50450 Kuala Lumpur, Malaysia</p>
            </address>

            <div data-location-animate className="pt-2">
              <a
                ref={directionsMagnetic.ref}
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 uppercase tracking-[0.2em] text-xs text-copper border-b border-copper pb-1.5 hover:text-copper-light hover:border-copper-light transition-colors will-change-transform"
              >
                <Navigation className="w-3.5 h-3.5 text-copper" />
                <span ref={directionsMagnetic.textRef} className="pointer-events-none">
                  Get Directions via Google Maps
                </span>
              </a>
            </div>

            {/* Map Placeholder */}
            <div
              data-location-animate
              className="mt-12 aspect-[16/10] bg-charcoal rounded-none flex flex-col items-center justify-center border border-cream/10 relative overflow-hidden group shadow-xl"
              aria-label="Map placeholder"
            >
              <div className="absolute inset-0 bg-[radial-gradient(#b87333_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
              <div className="relative z-10 flex flex-col items-center">
                <MapPin className="w-10 h-10 text-copper mb-3 transition-transform duration-300 group-hover:-translate-y-1" />
                <span className="font-sans text-xs text-cream/60 uppercase tracking-[0.25em] font-medium">
                  Kuala Lumpur · Golden Triangle
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Hours with generous padding */}
          <div className="md:pl-16 lg:pl-24 flex flex-col justify-between space-y-12">
            <div className="space-y-8">
              <p
                data-location-animate
                className="uppercase tracking-[0.35em] text-xs text-copper font-medium"
              >
                Opening Hours
              </p>

              <div data-location-animate className="border-b border-cream/10 pb-8 space-y-2">
                <p className="font-serif text-xl text-cream">Monday to Thursday</p>
                <p className="font-sans text-base text-cream-dark">5:30 PM to 11:00 PM</p>
                <p className="font-sans text-xs text-cream-muted tracking-wide">Last seating at 9:30 PM</p>
              </div>

              <div data-location-animate className="border-b border-cream/10 pb-8 space-y-2">
                <p className="font-serif text-xl text-cream">Friday to Sunday</p>
                <p className="font-sans text-base text-cream-dark">5:00 PM to 12:00 AM</p>
                <p className="font-sans text-xs text-cream-muted tracking-wide">Last seating at 10:15 PM</p>
              </div>

              <div data-location-animate className="pt-4 space-y-2">
                <p className="font-serif text-xl text-copper">Dress Code</p>
                <p className="font-sans text-sm text-cream-dark leading-relaxed">
                  Smart elegant attire. We kindly request guests refrain from athletic wear, beachwear, and flip-flops.
                </p>
              </div>
            </div>

            <div data-location-animate className="p-6 bg-charcoal/60 border border-cream/10">
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-copper mb-1">
                Valet Parking
              </p>
              <p className="font-sans text-xs text-cream-muted leading-relaxed">
                Complimentary curbside valet service is provided at the main porte-cochère.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
