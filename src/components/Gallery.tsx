import { useEffect, useRef, useState } from 'react';
import { galleryImages } from '../data/gallery';
import Lightbox from './Lightbox';
import { gsap, ScrollTrigger } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import SplitTextReveal from './SplitTextReveal';

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (prefersReduced) return;

      // Section header entrance
      gsap.fromTo(
        '[data-gallery-header]',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // Staggered image entrances with clipPath
      const items = gridRef.current?.querySelectorAll('[data-gallery-item]');
      if (items) {
        items.forEach((item, index) => {
          const img = item.querySelector('img');
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: item,
              start: 'top 88%',
              toggleActions: 'play none none none',
            },
          });

          tl.fromTo(
            item,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              duration: 1.2,
              delay: (index % 3) * 0.1,
              ease: 'power4.inOut',
            },
            0
          );

          if (img) {
            tl.fromTo(
              img,
              { scale: 1.25 },
              { scale: 1, duration: 1.4, ease: 'power3.out' },
              0
            );
          }

          // Multi-speed parallax drift across columns
          const colIndex = index % 3;
          const parallaxDist = colIndex === 0 ? -12 : colIndex === 1 ? 16 : -10;
          ScrollTrigger.create({
            trigger: item,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
            animation: gsap.to(item, {
              yPercent: parallaxDist,
              ease: 'none',
            }),
          });
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReduced]);

  const handleOpenLightbox = (index: number) => {
    setActiveImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrev = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="bg-charcoal py-48 md:py-64 lg:py-72 px-8 sm:px-16 md:px-24 border-t border-cream/5 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Chapter Header */}
        <div data-gallery-header className="flex items-center gap-4 mb-8 justify-center">
          <span className="font-serif text-sm font-bold tracking-widest text-copper">
            05
          </span>
          <span className="h-px w-12 bg-copper/40" />
          <span className="font-sans text-xs uppercase tracking-[0.35em] text-cream-muted">
            Visual Archive
          </span>
        </div>

        {/* Header */}
        <div data-gallery-header className="text-center mb-24 md:mb-32">
          <SplitTextReveal
            tag="h2"
            text="Moments at Ember & Olive"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream tracking-tight max-w-2xl mx-auto leading-[1.12]"
            wordClassName="text-cream"
          />
          <div className="w-20 h-px bg-copper mx-auto my-10" />
          <p className="font-sans text-sm sm:text-base text-cream-muted max-w-xl mx-auto leading-relaxed">
            From the fiery kitchen line to atmospheric midnight dining rooms. Tap any image to examine our culinary gallery in detail.
          </p>
        </div>

        {/* Editorial Masonry Grid with generous gaps */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-14"
        >
          {galleryImages.map((img, index) => {
            const isTall = img.size === 'large';
            const isWide = index === 0 || index === 8;

            return (
              <div
                key={img.id}
                data-gallery-item
                data-cursor="view"
                tabIndex={0}
                role="button"
                aria-label={`View ${img.caption}`}
                onClick={() => handleOpenLightbox(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOpenLightbox(index);
                  }
                }}
                className={`group relative overflow-hidden bg-charcoal-light cursor-pointer shadow-xl focus:outline-none focus:ring-1 focus:ring-copper will-change-transform ${
                  isTall ? 'sm:row-span-2 aspect-[3/4] sm:aspect-auto' : 'aspect-[4/3]'
                } ${isWide ? 'lg:col-span-1' : ''}`}
                style={{ clipPath: 'inset(100% 0 0 0)' }}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
                />

                {/* Dark Vignette Overlay on Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-8">
                  <div className="flex justify-end">
                    <span className="font-sans text-xs tracking-widest text-cream bg-charcoal/80 px-3 py-1.5 border border-cream/15">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="font-serif text-xl text-cream tracking-wide">
                      {img.caption}
                    </p>
                    <span className="font-sans text-xs uppercase tracking-[0.25em] text-copper block font-medium">
                      Expand Lightbox
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        images={galleryImages}
        currentIndex={activeImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </section>
  );
}
