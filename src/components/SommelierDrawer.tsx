import { useEffect, useRef, useState } from 'react';
import { X, Wine, Sparkles } from 'lucide-react';
import { cellarWines, CellarWine } from '../data/wines';
import { gsap } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface SommelierDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedWineName?: string | null;
}

export default function SommelierDrawer({
  isOpen,
  onClose,
  selectedWineName,
}: SommelierDrawerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const prefersReduced = usePrefersReducedMotion();

  // Handle open / close GSAP transitions
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    if (prefersReduced) {
      if (overlayRef.current) overlayRef.current.style.opacity = '1';
      if (panelRef.current) panelRef.current.style.transform = 'none';
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' },
        0
      );

      tl.fromTo(
        panelRef.current,
        { xPercent: 100 },
        { xPercent: 0, duration: 0.5, ease: 'power3.out' },
        0
      );

      const items = contentRef.current?.querySelectorAll('[data-wine-card]');
      if (items && items.length > 0) {
        tl.fromTo(
          items,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out' },
          '-=0.2'
        );
      }
    });

    return () => {
      document.body.style.overflow = '';
      ctx.revert();
    };
  }, [isOpen, prefersReduced]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'Complete Cellar' },
    { id: 'white', label: 'Whites' },
    { id: 'red', label: 'Hearth Reds' },
    { id: 'skin-contact', label: 'Skin-Contact & Rosé' },
    { id: 'sparkling', label: 'Sparkling' },
    { id: 'sweet', label: 'Dessert' },
  ];

  const filteredWines =
    activeCategory === 'all'
      ? cellarWines
      : cellarWines.filter((w) => w.category === activeCategory);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9500] bg-charcoal/85 backdrop-blur-md flex justify-end"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sommelier-title"
    >
      {/* Sliding Cellar Panel */}
      <div
        ref={panelRef}
        className="w-full max-w-2xl bg-charcoal border-l border-cream/15 h-full overflow-y-auto flex flex-col shadow-2xl relative"
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-20 bg-charcoal/95 backdrop-blur-md border-b border-cream/10 px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-copper/40 flex items-center justify-center text-copper">
              <Wine className="w-4 h-4" />
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-copper font-medium">
                The Sommelier Archive
              </p>
              <h2 id="sommelier-title" className="font-serif text-xl sm:text-2xl text-cream">
                Mediterranean Cellar Reserve
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 border border-cream/15 rounded-none flex items-center justify-center text-cream hover:border-copper hover:text-copper transition-colors cursor-pointer focus:outline-none"
            aria-label="Close cellar drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sommelier Philosophy Introduction */}
        <div className="px-8 pt-8 pb-6 border-b border-cream/10 bg-charcoal-light/30">
          <p className="font-serif italic text-base sm:text-lg text-cream-dark leading-relaxed">
            "Our wine list is guided by coastal winds and volcanic ash. We cellar only low-intervention, estate-grown bottlings cultivated on ungrafted Mediterranean terraces that stand up to open embers."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-copper" />
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-cream-muted">
              Curated by Head Sommelier
            </p>
          </div>
        </div>

        {/* Terroir / Category Filters */}
        <div className="px-8 py-4 border-b border-cream/10 flex gap-2 overflow-x-auto no-scrollbar bg-charcoal">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`font-sans text-[11px] uppercase tracking-[0.2em] whitespace-nowrap px-4 py-2 border transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'border-copper bg-copper/10 text-copper font-medium'
                  : 'border-cream/10 text-cream-muted hover:border-cream/30 hover:text-cream'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Wine List */}
        <div ref={contentRef} className="px-8 py-8 space-y-8 flex-1">
          {filteredWines.map((wine: CellarWine) => {
            const isHighlighted = selectedWineName && wine.name.toLowerCase().includes(selectedWineName.toLowerCase());

            return (
              <div
                key={wine.id}
                data-wine-card
                className={`p-6 border transition-all duration-300 ${
                  isHighlighted
                    ? 'border-copper bg-charcoal-light/80 shadow-xl'
                    : 'border-cream/10 bg-charcoal-light/20 hover:border-copper/40'
                }`}
              >
                {/* Vintage, Region, Price */}
                <div className="flex justify-between items-baseline gap-4 mb-2">
                  <div>
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-copper block mb-1">
                      {wine.producer} · {wine.vintage}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-cream tracking-wide">
                      {wine.name}
                    </h3>
                  </div>

                  <span className="font-sans text-base text-copper font-semibold tabular-nums">
                    {wine.price}
                  </span>
                </div>

                {/* Grape & Origin */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-cream-muted font-sans mb-4 pt-1">
                  <span>{wine.region}, {wine.country}</span>
                  <span className="text-cream/20">/</span>
                  <span className="text-olive-light">{wine.grape}</span>
                  <span className="text-cream/20">/</span>
                  <span>{wine.alcohol} ABV</span>
                </div>

                {/* Terroir Geology */}
                <div className="bg-charcoal/60 p-3.5 border border-cream/5 mb-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream-muted mb-1 font-medium">
                    Terroir &amp; Soil
                  </p>
                  <p className="font-sans text-xs text-cream-dark leading-relaxed">
                    {wine.terroir}
                  </p>
                </div>

                {/* Tasting Notes */}
                <div className="space-y-1 mb-4">
                  <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-cream-muted font-medium">
                    Tasting Profile
                  </p>
                  <p className="font-sans text-xs text-cream leading-relaxed">
                    {wine.notes}
                  </p>
                </div>

                {/* Paired Dish */}
                <div className="pt-3 border-t border-cream/10 flex items-center justify-between text-xs font-sans">
                  <span className="text-cream-muted">Pairing Match:</span>
                  <span className="text-copper font-medium flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-copper" />
                    {wine.pairedDish}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="sticky bottom-0 bg-charcoal/95 backdrop-blur-md border-t border-cream/10 p-6 text-center text-xs text-cream-muted font-sans">
          <span>Glass pours poured via Coravin system. All bottles kept in dual-zone temperature vaults at 14°C.</span>
        </div>
      </div>
    </div>
  );
}
