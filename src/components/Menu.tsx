import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Wine, ArrowRight, Sparkles } from 'lucide-react';
import { menuCategories } from '../data/menu';
import { gsap } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import SplitTextReveal from './SplitTextReveal';
import SommelierDrawer from './SommelierDrawer';

export default function Menu() {
  const sectionRef = useRef<HTMLElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);
  const tabListRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLDivElement>(null);

  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const [displayedCategory, setDisplayedCategory] = useState(menuCategories[0].id);
  const [hoveredItemName, setHoveredItemName] = useState<string | null>(null);
  const [isCellarOpen, setIsCellarOpen] = useState(false);
  const [selectedWine, setSelectedWine] = useState<string | null>(null);

  const isTransitioningRef = useRef(false);
  const prefersReduced = usePrefersReducedMotion();

  // Scroll entrance animation
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      gsap.fromTo(
        '[data-menu-entrance]',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.14,
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

  // Update sliding line indicator position whenever activeCategory changes
  useEffect(() => {
    if (!tabListRef.current || !activeLineRef.current) return;

    const activeBtn = tabListRef.current.querySelector<HTMLButtonElement>(`#tab-${activeCategory}`);
    if (!activeBtn) return;

    const parentLeft = tabListRef.current.getBoundingClientRect().left;
    const btnRect = activeBtn.getBoundingClientRect();
    const targetLeft = btnRect.left - parentLeft;
    const targetWidth = btnRect.width;

    if (prefersReduced) {
      gsap.set(activeLineRef.current, { x: targetLeft, width: targetWidth });
    } else {
      gsap.to(activeLineRef.current, {
        x: targetLeft,
        width: targetWidth,
        duration: 0.45,
        ease: 'power3.out',
      });
    }
  }, [activeCategory, prefersReduced]);

  // Tab change animation with smooth GSAP transition
  const handleCategoryChange = (newCatId: string) => {
    if (newCatId === activeCategory || isTransitioningRef.current) return;
    setActiveCategory(newCatId);
    setHoveredItemName(null);

    if (prefersReduced) {
      setDisplayedCategory(newCatId);
      return;
    }

    isTransitioningRef.current = true;
    const currentItems = itemsContainerRef.current?.querySelectorAll('[data-menu-row]');

    const tl = gsap.timeline({
      onComplete: () => {
        setDisplayedCategory(newCatId);
      },
    });

    if (currentItems && currentItems.length > 0) {
      tl.to(currentItems, {
        opacity: 0,
        y: -18,
        duration: 0.25,
        stagger: 0.02,
        ease: 'power2.in',
      });
    } else {
      setDisplayedCategory(newCatId);
    }
  };

  // Animate new items entering whenever displayedCategory changes
  useEffect(() => {
    if (prefersReduced) {
      isTransitioningRef.current = false;
      return;
    }

    const newItems = itemsContainerRef.current?.querySelectorAll('[data-menu-row]');
    if (newItems && newItems.length > 0) {
      gsap.fromTo(
        newItems,
        { opacity: 0, y: 25, rotateX: -10 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power3.out',
          onComplete: () => {
            isTransitioningRef.current = false;
          },
        }
      );
    } else {
      isTransitioningRef.current = false;
    }
  }, [displayedCategory, prefersReduced]);

  const currentCategoryData =
    menuCategories.find((cat) => cat.id === displayedCategory) || menuCategories[0];

  const handleOpenCellar = (wineName?: string) => {
    setSelectedWine(wineName || null);
    setIsCellarOpen(true);
  };

  return (
    <section
      id="menu"
      ref={sectionRef}
      className="bg-charcoal py-48 md:py-64 lg:py-72 px-8 sm:px-16 md:px-24 border-t border-cream/5 relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* Chapter Header */}
        <div data-menu-entrance className="flex items-center gap-4 mb-8 justify-center">
          <span className="font-serif text-sm font-bold tracking-widest text-copper">
            03
          </span>
          <span className="h-px w-12 bg-copper/40" />
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-cream-muted">
            The Degustation
          </span>
        </div>

        {/* Section Header */}
        <div data-menu-entrance className="text-center mb-16 md:mb-20">
          <SplitTextReveal
            tag="h2"
            text="A Menu Shaped by Fire and Season"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream tracking-tight max-w-3xl mx-auto leading-[1.12]"
            wordClassName="text-cream"
          />
          <div className="w-20 h-px bg-copper mx-auto my-8" />
          <p className="font-sans text-sm sm:text-base text-cream-muted max-w-xl mx-auto leading-relaxed">
            Our daily offerings reflect market catches, hearth-roasted heritage grains, and Mediterranean olive groves. Hover over any plate to explore ingredients, hearth craft, and sommelier pairings.
          </p>

          {/* Sommelier Cellar Launch Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => handleOpenCellar()}
              className="inline-flex items-center gap-2.5 bg-charcoal-light/70 hover:bg-copper hover:text-charcoal border border-copper/50 text-copper px-6 py-2.5 font-sans text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer shadow-lg shadow-copper/10 group"
            >
              <Wine className="w-3.5 h-3.5 text-copper group-hover:text-charcoal transition-colors" />
              <span>Explore The Sommelier Cellar</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation with GSAP Sliding Indicator */}
        <div
          data-menu-entrance
          ref={tabListRef}
          className="relative flex justify-start md:justify-center items-center overflow-x-auto no-scrollbar border-b border-cream/10 pb-6 mb-20 md:mb-28 gap-10 md:gap-14"
          role="tablist"
          aria-label="Menu categories"
        >
          {menuCategories.map((cat) => {
            const isActive = cat.id === activeCategory;
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${cat.id}`}
                id={`tab-${cat.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleCategoryChange(cat.id)}
                className={`relative font-sans text-xs uppercase tracking-[0.25em] whitespace-nowrap py-3 px-2 transition-colors duration-300 cursor-pointer focus:outline-none ${
                  isActive ? 'text-copper font-semibold' : 'text-cream-muted hover:text-cream'
                }`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}

          {/* GSAP Animated Sliding Line */}
          <div
            ref={activeLineRef}
            className="absolute bottom-0 left-0 h-[2px] bg-copper pointer-events-none will-change-transform"
            style={{ width: '60px' }}
          />
        </div>

        {/* Menu Items Container with Interactive Hover Slide-Down Reveal */}
        <div
          ref={itemsContainerRef}
          id={`panel-${currentCategoryData.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${currentCategoryData.id}`}
          className="space-y-6 md:space-y-8"
        >
          {currentCategoryData.items.map((item) => {
            const isHovered = hoveredItemName === item.name;

            return (
              <div
                key={item.name}
                data-menu-row
                data-cursor="view"
                onMouseEnter={() => setHoveredItemName(item.name)}
                onMouseLeave={() => setHoveredItemName(null)}
                onClick={() => setHoveredItemName(isHovered ? null : item.name)}
                className={`group border-b transition-all duration-300 cursor-pointer pb-6 pt-4 px-4 sm:px-6 -mx-4 sm:-mx-6 rounded-none will-change-transform ${
                  isHovered
                    ? 'border-copper bg-charcoal-light/50 shadow-2xl'
                    : 'border-cream/10 hover:border-copper/50 hover:bg-charcoal-light/20'
                }`}
              >
                {/* Header Row: Title, Dietary Tags, Price & Interactive Arrow */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 mb-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3
                      className={`font-serif text-2xl sm:text-3xl tracking-wide transition-colors duration-300 ${
                        isHovered ? 'text-copper' : 'text-cream group-hover:text-copper'
                      }`}
                    >
                      {item.name}
                    </h3>

                    {item.dietary && item.dietary.length > 0 && (
                      <div className="flex gap-2" aria-label="Dietary notes">
                        {item.dietary.map((tag) => (
                          <span
                            key={tag}
                            className="font-sans text-[10px] tracking-widest uppercase border border-olive/50 text-olive-light px-2 py-0.5"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <span
                      className={`font-sans text-base sm:text-lg tracking-wider font-semibold tabular-nums transition-colors duration-300 ${
                        isHovered ? 'text-copper-light' : 'text-copper'
                      }`}
                    >
                      {item.price}
                    </span>

                    <ChevronDown
                      className={`w-4 h-4 text-copper/60 transition-transform duration-300 ease-out ${
                        isHovered ? 'rotate-180 text-copper' : 'group-hover:translate-y-0.5'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Short Description */}
                <p className="font-sans text-sm sm:text-base text-cream-muted max-w-2xl leading-relaxed">
                  {item.description}
                </p>

                {/* Interactive Slide-Down Preview Drawer: Image + Curated Ingredients + Sommelier Pairing */}
                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isHovered
                      ? 'grid-rows-[1fr] opacity-100 mt-6'
                      : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                  }`}
                  aria-hidden={!isHovered}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start pt-4 pb-4 border-t border-cream/10">
                      {/* Dish Photography Frame */}
                      <div className="relative w-full md:w-56 lg:w-64 aspect-[4/3] flex-shrink-0 overflow-hidden bg-charcoal border border-cream/15 shadow-xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                            isHovered ? 'scale-105' : 'scale-100'
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                        <span className="absolute bottom-2 left-2.5 font-sans text-[9px] uppercase tracking-[0.22em] text-copper font-medium bg-charcoal/85 px-2 py-0.5 border border-cream/10">
                          Wood-Fired Hearth
                        </span>
                      </div>

                      {/* Ingredients List & Preparation Notes */}
                      <div className="flex-1 space-y-4">
                        <div className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-copper" />
                            <p className="font-sans text-[11px] uppercase tracking-[0.25em] text-copper font-medium">
                              Curated Ingredients
                            </p>
                          </div>

                          {/* Ingredients Pills */}
                          <div className="flex flex-wrap gap-2 pt-0.5">
                            {item.ingredients.map((ing) => (
                              <span
                                key={ing}
                                className="font-sans text-xs bg-charcoal/80 border border-cream/10 text-cream-dark px-3 py-1 tracking-wide"
                              >
                                {ing}
                              </span>
                            ))}
                          </div>

                          {/* Hearth Preparation Note */}
                          {item.hearthNote && (
                            <p className="font-sans text-xs text-cream-muted italic leading-relaxed pt-1.5">
                              "{item.hearthNote}"
                            </p>
                          )}
                        </div>

                        {/* Sommelier Wine Pairing Box */}
                        {item.winePairing && (
                          <div className="mt-4 pt-3.5 border-t border-cream/10 bg-charcoal/60 p-4 border border-cream/5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <Wine className="w-4 h-4 text-copper" />
                                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-copper font-semibold flex items-center gap-1.5">
                                  <Sparkles className="w-3 h-3 text-copper" />
                                  Sommelier Pairing
                                </span>
                              </div>

                              <div className="flex items-center gap-2.5 text-xs font-sans text-copper font-medium">
                                <span>Glass {item.winePairing.glassPrice}</span>
                                <span className="text-cream/20">/</span>
                                <span>Bottle {item.winePairing.bottlePrice}</span>
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <p className="font-serif text-base text-cream tracking-wide">
                                {item.winePairing.wineName}
                              </p>
                              <p className="font-sans text-xs text-cream-muted">
                                {item.winePairing.grape} · {item.winePairing.region}
                              </p>
                            </div>

                            <p className="font-sans text-xs text-cream-dark/90 leading-relaxed mt-2.5">
                              {item.winePairing.pairingRationale}
                            </p>

                            <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-cream/5">
                              <div className="flex flex-wrap gap-1.5">
                                {item.winePairing.profile.map((p) => (
                                  <span
                                    key={p}
                                    className="font-sans text-[10px] uppercase tracking-wider bg-charcoal/90 border border-cream/10 text-cream-muted px-2.5 py-0.5"
                                  >
                                    {p}
                                  </span>
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenCellar(item.winePairing?.wineName);
                                }}
                                className="font-sans text-[11px] uppercase tracking-[0.2em] text-copper hover:text-copper-light transition-colors cursor-pointer flex items-center gap-1.5 group/btn"
                              >
                                <span>View Cellar Reserve</span>
                                <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dietary Legend with generous padding */}
        <div data-menu-entrance className="mt-32 pt-16 border-t border-cream/10 flex flex-wrap justify-center gap-12 text-xs text-cream-muted font-sans tracking-wide">
          <span><strong className="text-olive-light">V</strong> : Vegetarian Selection</span>
          <span><strong className="text-olive-light">GF</strong> : Gluten-Free Preparation Available</span>
          <span>Coravin wine preservation for all reserve vintage pours</span>
          <span>All embers are sustained by centuries-old Greek olive and almond orchards</span>
        </div>
      </div>

      {/* Fullscreen Sliding Sommelier Cellar Drawer */}
      <SommelierDrawer
        isOpen={isCellarOpen}
        onClose={() => setIsCellarOpen(false)}
        selectedWineName={selectedWine}
      />
    </section>
  );
}
