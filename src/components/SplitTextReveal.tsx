import React, { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface SplitTextRevealProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  splitBy?: 'words' | 'characters';
  triggerStart?: string;
}

export default function SplitTextReveal({
  text,
  tag = 'h2',
  className = '',
  wordClassName = '',
  delay = 0,
  stagger = 0.04,
  splitBy = 'words',
  triggerStart = 'top 85%',
}: SplitTextRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current || prefersReduced) return;

    const ctx = gsap.context(() => {
      const items = containerRef.current?.querySelectorAll('[data-split-item]');
      if (!items || items.length === 0) return;

      gsap.fromTo(
        items,
        {
          yPercent: 120,
          rotateX: -45,
          opacity: 0,
        },
        {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 1.1,
          stagger: stagger,
          delay: delay,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: triggerStart,
            toggleActions: 'play none none none',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay, stagger, prefersReduced, triggerStart]);

  const Tag = tag as any;

  if (prefersReduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  if (splitBy === 'characters') {
    const words = text.split(' ');
    return (
      <Tag
        ref={containerRef}
        className={`inline-block perspective-[1000px] ${className}`}
      >
        {words.map((word, wIdx) => (
          <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
            {word.split('').map((char, cIdx) => (
              <span
                key={cIdx}
                className="inline-block overflow-hidden align-top"
              >
                <span
                  data-split-item
                  className={`inline-block will-change-transform ${wordClassName}`}
                >
                  {char}
                </span>
              </span>
            ))}
          </span>
        ))}
      </Tag>
    );
  }

  // Default: split by words
  const words = text.split(' ');
  return (
    <Tag
      ref={containerRef}
      className={`inline-block perspective-[1000px] ${className}`}
    >
      {words.map((word, idx) => (
        <span
          key={idx}
          className="inline-block overflow-hidden mr-[0.28em] align-top"
        >
          <span
            data-split-item
            className={`inline-block will-change-transform ${wordClassName}`}
          >
            {word}
          </span>
        </span>
      ))}
    </Tag>
  );
}
