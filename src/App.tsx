import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './animations/gsapSetup';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Intro from './components/Intro';
import SignatureDishes from './components/SignatureDishes';
import Menu from './components/Menu';
import Chef from './components/Chef';
import Gallery from './components/Gallery';
import Experience from './components/Experience';
import Testimonials from './components/Testimonials';
import Reservation from './components/Reservation';
import Location from './components/Location';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import SectionHUD from './components/SectionHUD';

import MarqueeTicker from './components/MarqueeTicker';

export default function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const prefersReduced = usePrefersReducedMotion();

  // Initialize Lenis smooth scroll and synchronize with GSAP ScrollTrigger
  useEffect(() => {
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [prefersReduced]);

  // Scroll Progress indicator at the top
  useEffect(() => {
    if (!progressBarRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(progressBarRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const handleLoadingComplete = useCallback(() => {
    setLoadingComplete(true);
    // Refresh ScrollTrigger calculations after loading layout is settled
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);
  }, []);

  return (
    <div className="relative min-h-screen bg-charcoal text-cream font-sans selection:bg-olive selection:text-cream">
      {/* Top Scroll Progress Bar */}
      <div
        ref={progressBarRef}
        className="fixed top-0 left-0 w-full h-[2px] bg-copper z-[10000] origin-left pointer-events-none"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden="true"
      />

      {/* Custom Cursor for Desktop */}
      <CustomCursor />

      {/* Floating Section Chapter HUD on Desktop */}
      <SectionHUD />

      {/* Cinematic Loading Screen */}
      <LoadingScreen onComplete={handleLoadingComplete} />

      {/* Main Page Elements */}
      <Navbar />

      <main id="main-content">
        <Hero animationReady={loadingComplete} />
        <Intro />
        <SignatureDishes />
        <MarqueeTicker direction="left" speed={32} />
        <Menu />
        <Chef />
        <MarqueeTicker
          direction="right"
          speed={36}
          items={[
            'Wood-Fired Pass',
            'Truffle & Embers',
            'Handcrafted Pasta',
            'Mediterranean Soul',
            'Slow-Burn Mastery',
            'Artisanal Ferments',
          ]}
        />
        <Gallery />
        <Experience />
        <Testimonials />
        <Reservation />
        <Location />
      </main>

      <Footer />
    </div>
  );
}
