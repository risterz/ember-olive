import { useEffect, useRef } from 'react';
import { gsap } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import { useIsTouchDevice } from './useMediaQuery';

interface MagneticOptions {
  strength?: number;
  textStrength?: number;
}

export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  options?: MagneticOptions
) {
  const ref = useRef<T>(null);
  const textRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const isTouch = useIsTouchDevice();

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced || isTouch) return;

    const { strength = 0.35, textStrength = 0.2 } = options || {};

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });

    let textXTo: ((val: number) => void) | null = null;
    let textYTo: ((val: number) => void) | null = null;

    if (textRef.current) {
      textXTo = gsap.quickTo(textRef.current, 'x', { duration: 0.4, ease: 'power3.out' });
      textYTo = gsap.quickTo(textRef.current, 'y', { duration: 0.4, ease: 'power3.out' });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      xTo(distanceX * strength);
      yTo(distanceY * strength);

      if (textXTo && textYTo) {
        textXTo(distanceX * textStrength);
        textYTo(distanceY * textStrength);
      }
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
      if (textXTo && textYTo) {
        textXTo(0);
        textYTo(0);
      }
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
      xTo(0);
      yTo(0);
    };
  }, [options, prefersReduced, isTouch]);

  return { ref, textRef };
}
