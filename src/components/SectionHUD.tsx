import { useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface SectionItem {
  id: string;
  number: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: 'story', number: '01', label: 'Story' },
  { id: 'dishes', number: '02', label: 'Signatures' },
  { id: 'menu', number: '03', label: 'Menu' },
  { id: 'chef', number: '04', label: 'The Chef' },
  { id: 'gallery', number: '05', label: 'Gallery' },
  { id: 'experience', number: '06', label: 'Experience' },
  { id: 'reservation', number: '07', label: 'Reserve' },
  { id: 'location', number: '08', label: 'Location' },
];

export default function SectionHUD() {
  const [activeId, setActiveId] = useState<string>('story');
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    // Show HUD only after scrolling past hero
    const heroTrigger = ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom 80%',
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
    });

    const triggers: ScrollTrigger[] = [];

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveId(section.id),
        onEnterBack: () => setActiveId(section.id),
      });

      triggers.push(trigger);
    });

    return () => {
      heroTrigger.kill();
      triggers.forEach((t) => t.kill());
    };
  }, [prefersReduced]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
  };

  const currentSection = SECTIONS.find((s) => s.id === activeId) || SECTIONS[0];

  return (
    <aside
      aria-label="Section chapter navigation"
      className={`fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-end gap-3 transition-opacity duration-700 pointer-events-auto ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Current Active Chapter Badge */}
      <div className="flex items-center gap-2 mb-2 bg-charcoal/80 backdrop-blur-md px-3 py-1.5 border border-cream/10">
        <span className="font-serif text-xs text-copper font-bold tracking-widest">
          {currentSection.number}
        </span>
        <span className="h-2 w-px bg-cream/30" />
        <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream">
          {currentSection.label}
        </span>
      </div>

      {/* Vertical Navigation Track */}
      <div className="flex flex-col items-end gap-2.5">
        {SECTIONS.map((sec) => {
          const isActive = sec.id === activeId;
          return (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              aria-label={`Jump to ${sec.label}`}
              className="group flex items-center gap-3 py-1 cursor-pointer focus:outline-none"
            >
              <span
                className={`font-sans text-[10px] uppercase tracking-widest transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 ${
                  isActive ? 'text-copper font-medium' : 'text-cream-muted'
                }`}
              >
                {sec.label}
              </span>
              <span
                className={`h-[1px] transition-all duration-300 origin-right ${
                  isActive
                    ? 'w-8 bg-copper'
                    : 'w-3 bg-cream/20 group-hover:w-5 group-hover:bg-cream/60'
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
