import { gsap, ScrollTrigger } from './gsapSetup'

export function setupNavScrollTrigger(navElement: HTMLElement) {
  ScrollTrigger.create({
    start: 'top -80',
    end: 99999,
    onUpdate: (self) => {
      const progress = Math.min(self.progress * 50, 1)
      navElement.style.backgroundColor = `rgba(26, 26, 26, ${progress * 0.95})`
      navElement.style.backdropFilter = `blur(${progress * 12}px)`
      navElement.style.paddingTop = `${1.25 - progress * 0.5}rem`
      navElement.style.paddingBottom = `${1.25 - progress * 0.5}rem`
    },
  })
}

export function createSectionEntrance(
  section: HTMLElement,
  children: HTMLElement[],
  options?: { stagger?: number; y?: number }
) {
  const { stagger = 0.1, y = 60 } = options || {}

  gsap.fromTo(
    children,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    }
  )
}

export function setupScrollProgress(progressBar: HTMLElement) {
  gsap.to(progressBar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  })
}

export { ScrollTrigger }
