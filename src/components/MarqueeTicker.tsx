import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface MarqueeTickerProps {
  items?: string[];
  direction?: 'left' | 'right';
  speed?: number;
}

const DEFAULT_ITEMS = [
  'Wood-Fired Gastronomy',
  'Cold-Pressed Olive Oil',
  'Ancient Embers',
  'Wild Mediterranean Herbs',
  'Artisanal Heritage',
  'Seasonal Harvest',
];

export default function MarqueeTicker({
  items = DEFAULT_ITEMS,
  direction = 'left',
  speed = 28,
}: MarqueeTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!trackRef.current || prefersReduced) return;

    const track = trackRef.current;
    const isLeft = direction === 'left';

    const ctx = gsap.context(() => {
      // Continuous marquee animation
      const loop = gsap.fromTo(
        track,
        { xPercent: isLeft ? 0 : -50 },
        {
          xPercent: isLeft ? -50 : 0,
          ease: 'none',
          duration: speed,
          repeat: -1,
        }
      );

      // Velocity scroll trigger: speed up when user scrolls quickly
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity());
          const timeScaleFactor = Math.min(1 + velocity / 600, 3.5);
          gsap.to(loop, {
            timeScale: timeScaleFactor,
            duration: 0.3,
            overwrite: 'auto',
            onComplete: () => {
              gsap.to(loop, { timeScale: 1, duration: 0.8, ease: 'power2.out' });
            },
          });
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [direction, speed, prefersReduced]);

  if (prefersReduced) return null;

  // Duplicate items for continuous looping
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden py-16 md:py-24 bg-charcoal border-y border-copper/15 select-none pointer-events-none"
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap will-change-transform"
        style={{ width: 'fit-content' }}
      >
        {repeatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center mx-6 sm:mx-10">
            <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-[0.2em] uppercase text-cream/30 hover:text-cream transition-colors duration-300">
              {item}
            </span>
            <span className="w-2 h-2 rounded-full bg-copper/50 ml-6 sm:ml-10" />
          </div>
        ))}
      </div>
    </div>
  );
}
