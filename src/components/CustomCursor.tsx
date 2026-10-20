import { useEffect, useRef } from 'react';
import { gsap } from '../animations/gsapSetup';
import { useIsTouchDevice } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const isTouch = useIsTouchDevice();
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isTouch || reducedMotion) return;

    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    // Use GSAP quickTo for zero-latency, high-performance lerping
    const xToCursor = gsap.quickTo(cursor, 'x', { duration: 0.22, ease: 'power3.out' });
    const yToCursor = gsap.quickTo(cursor, 'y', { duration: 0.22, ease: 'power3.out' });

    const xToDot = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const yToDot = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });

    let isVisible = false;

    const moveCursor = (e: MouseEvent) => {
      if (!isVisible) {
        gsap.to([cursor, dot], { opacity: 1, duration: 0.3 });
        isVisible = true;
      }

      const halfW = cursor.offsetWidth / 2;
      const halfH = cursor.offsetHeight / 2;
      xToCursor(e.clientX - halfW);
      yToCursor(e.clientY - halfH);

      const dotHalf = dot.offsetWidth / 2;
      xToDot(e.clientX - dotHalf);
      yToDot(e.clientY - dotHalf);
    };

    window.addEventListener('mousemove', moveCursor);

    // Event delegation for cursor interactions across dynamic DOM
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTarget = target.closest('[data-cursor]');
      const clickableTarget = target.closest('button, a, input, select, textarea, [role="button"]');

      if (cursorTarget) {
        const cursorType = cursorTarget.getAttribute('data-cursor');
        if (cursorType === 'view') {
          cursor.classList.add('expanded');
          if (textRef.current) textRef.current.textContent = 'VIEW';
          gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2 });
        } else if (cursorType === 'action') {
          gsap.to(cursor, { scale: 1.6, borderColor: '#b87333', duration: 0.3 });
        }
      } else if (clickableTarget) {
        gsap.to(cursor, { scale: 1.35, borderColor: '#d4956a', duration: 0.25 });
        gsap.to(dot, { scale: 0.5, duration: 0.25 });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorTarget = target.closest('[data-cursor]');
      const clickableTarget = target.closest('button, a, input, select, textarea, [role="button"]');

      if (cursorTarget || clickableTarget) {
        cursor.classList.remove('expanded');
        if (textRef.current) textRef.current.textContent = '';
        gsap.to(cursor, { scale: 1, borderColor: '#f5f0e8', duration: 0.3 });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.3 });
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [isTouch, reducedMotion]);

  if (isTouch || reducedMotion) return null;

  return (
    <>
      {/* Outer follow circle */}
      <div
        ref={cursorRef}
        className="custom-cursor opacity-0"
        aria-hidden="true"
      >
        <span ref={textRef} className="cursor-text" />
      </div>

      {/* Center pinpoint dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-copper pointer-events-none z-[10001] opacity-0"
        aria-hidden="true"
      />
    </>
  );
}
