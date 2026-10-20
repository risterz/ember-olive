import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryImage } from '../data/gallery';
import { gsap } from '../animations/gsapSetup';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function Lightbox({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: LightboxProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Handle open/close animations
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    if (prefersReduced) {
      if (overlayRef.current) overlayRef.current.style.opacity = '1';
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' }
      );
      tl.fromTo(
        contentRef.current,
        { scale: 0.96, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' },
        '-=0.2'
      );
      tl.fromTo(
        imageRef.current,
        { scale: 1.05 },
        { scale: 1, duration: 0.6, ease: 'power2.out' },
        '-=0.3'
      );
    });

    return () => {
      document.body.style.overflow = '';
      ctx.revert();
    };
  }, [isOpen, prefersReduced]);

  // Handle image transition on index change
  useEffect(() => {
    if (!isOpen || prefersReduced || !imageRef.current) return;

    gsap.fromTo(
      imageRef.current,
      { opacity: 0, scale: 0.98 },
      { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
    );
  }, [currentIndex, isOpen, prefersReduced]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNext();
      else if (e.key === 'ArrowLeft') onPrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  const handleClose = () => {
    if (prefersReduced) {
      onClose();
      return;
    }

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: onClose,
    });
  };

  const handleMagneticMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    gsap.to(e.currentTarget, { x: x * 0.4, y: y * 0.4, duration: 0.3, ease: 'power2.out' });
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (prefersReduced) return;
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'power3.out' });
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9500] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      {/* Close button */}
      <button
        type="button"
        onClick={handleClose}
        onMouseMove={handleMagneticMove}
        onMouseLeave={handleMagneticLeave}
        className="absolute top-6 right-6 z-50 text-cream/80 hover:text-copper transition-colors p-3 focus:outline-none focus:ring-1 focus:ring-copper will-change-transform cursor-pointer"
        aria-label="Close lightbox"
      >
        <X className="w-7 h-7" />
      </button>

      {/* Prev button */}
      <button
        type="button"
        onClick={onPrev}
        onMouseMove={handleMagneticMove}
        onMouseLeave={handleMagneticLeave}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-50 text-cream/70 hover:text-copper transition-colors p-3 focus:outline-none focus:ring-1 focus:ring-copper will-change-transform cursor-pointer"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      {/* Next button */}
      <button
        type="button"
        onClick={onNext}
        onMouseMove={handleMagneticMove}
        onMouseLeave={handleMagneticLeave}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-50 text-cream/70 hover:text-copper transition-colors p-3 focus:outline-none focus:ring-1 focus:ring-copper will-change-transform cursor-pointer"
        aria-label="Next image"
      >
        <ChevronRight className="w-8 h-8 sm:w-10 sm:h-10" />
      </button>

      {/* Image and Info Content */}
      <div
        ref={contentRef}
        className="relative max-w-5xl max-h-[90vh] flex flex-col items-center select-none"
      >
        <div className="relative overflow-hidden max-h-[75vh] flex items-center justify-center">
          <img
            ref={imageRef}
            src={currentImage.src}
            alt={currentImage.alt}
            className="max-h-[75vh] w-auto max-w-full object-contain shadow-2xl"
          />
        </div>

        {/* Footer info: caption + index */}
        <div className="w-full mt-4 flex items-center justify-between text-xs font-sans tracking-[0.2em] uppercase text-cream-muted border-t border-cream/10 pt-3">
          <span className="font-serif text-sm tracking-normal capitalize text-cream">
            {currentImage.caption}
          </span>
          <span className="tabular-nums">
            {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </div>
  );
}
