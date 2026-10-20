import { useEffect, useRef, useState } from 'react';
import { gsap } from '../animations/gsapSetup';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  const [isDone, setIsDone] = useState(false);
  const hasFinishedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (hasFinishedRef.current) return;

    if (prefersReduced) {
      hasFinishedRef.current = true;
      setIsDone(true);
      onCompleteRef.current();
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          hasFinishedRef.current = true;
          if (containerRef.current) {
            containerRef.current.style.display = 'none';
          }
          setIsDone(true);
          onCompleteRef.current();
        },
      });

      // 1. Logo scales 0.8 -> 1, opacity 0 -> 1
      tl.fromTo(
        logoRef.current,
        { scale: 0.8, opacity: 0, y: 15 },
        { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );

      // Tagline reveals
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
        '-=0.3'
      );

      // 2. Line expands from center
      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.9, ease: 'power2.inOut' },
        '-=0.2'
      );

      // 3. Percentage counts from 0 to 100 directly via DOM
      const counterObj = { val: 0 };
      tl.to(
        counterObj,
        {
          val: 100,
          duration: 0.9,
          ease: 'power2.out',
          onUpdate: () => {
            if (percentRef.current) {
              const currentVal = Math.round(counterObj.val);
              percentRef.current.textContent = `${String(currentVal).padStart(2, '0')}%`;
            }
          },
        },
        '<0.1'
      );

      // Hold briefly at 100%
      tl.to({}, { duration: 0.2 });

      // 4. Loading screen slides upward
      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 0.9,
        ease: 'power4.inOut',
      });
    }, containerRef);

    return () => {
      if (!hasFinishedRef.current) {
        ctx.revert();
      }
    };
  }, [prefersReduced]);

  if (isDone || prefersReduced) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal text-cream select-none pointer-events-auto"
      style={{ willChange: 'transform' }}
      aria-label="Loading Ember and Olive"
      role="progressbar"
      aria-valuenow={100}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="flex flex-col items-center px-6 text-center">
        <h1
          ref={logoRef}
          className="font-serif text-3xl md:text-5xl lg:text-6xl tracking-[0.3em] uppercase text-cream font-medium"
        >
          Ember &amp; Olive
        </h1>

        <p
          ref={taglineRef}
          className="font-sans text-xs md:text-sm tracking-[0.25em] text-cream-muted uppercase mt-4 mb-8"
        >
          Fire. Flavor. Memory.
        </p>

        <div className="relative w-48 md:w-64 h-[1px] bg-charcoal-light overflow-hidden">
          <div
            ref={lineRef}
            className="absolute inset-0 bg-copper origin-center scale-x-0"
          />
        </div>

        <div className="mt-4 h-6">
          <span
            ref={percentRef}
            className="font-sans text-xs tracking-[0.3em] text-cream-muted font-light tabular-nums"
          >
            00%
          </span>
        </div>
      </div>
    </div>
  );
}
