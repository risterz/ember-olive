import { gsap, ScrollTrigger } from './gsapSetup'

export function revealImage(
  element: HTMLElement,
  options?: { delay?: number; duration?: number }
) {
  const { delay = 0, duration = 1.2 } = options || {}

  gsap.fromTo(
    element,
    { clipPath: 'inset(100% 0 0 0)' },
    {
      clipPath: 'inset(0% 0 0 0)',
      duration,
      delay,
      ease: 'power4.inOut',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  )

  const img = element.querySelector('img')
  if (img) {
    gsap.fromTo(
      img,
      { scale: 1.3 },
      {
        scale: 1,
        duration: duration + 0.4,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
  }
}

export function parallaxImage(
  element: HTMLElement,
  options?: { yPercent?: number }
) {
  const { yPercent = 15 } = options || {}

  gsap.to(element, {
    yPercent,
    ease: 'none',
    scrollTrigger: {
      trigger: element.parentElement || element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  })
}

export function createImageRevealBatch(container: HTMLElement) {
  const images = container.querySelectorAll<HTMLElement>('[data-reveal]')
  images.forEach((el, i) => {
    revealImage(el, { delay: i * 0.1 })
  })
}

export { ScrollTrigger }
