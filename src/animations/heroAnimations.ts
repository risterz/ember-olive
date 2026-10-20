import { gsap } from './gsapSetup'

export function createHeroTimeline(
  container: HTMLElement,
  reducedMotion: boolean
) {
  if (reducedMotion) {
    const elements = container.querySelectorAll('[data-hero-animate]')
    elements.forEach((el) => {
      ;(el as HTMLElement).style.opacity = '1'
      ;(el as HTMLElement).style.transform = 'none'
    })
    return gsap.timeline()
  }

  const tl = gsap.timeline({ delay: 0.2 })

  const bgImage = container.querySelector('[data-hero-bg]')
  if (bgImage) {
    tl.fromTo(
      bgImage,
      { scale: 1.15, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.8, ease: 'power2.out' },
      0
    )
  }

  const label = container.querySelector('[data-hero-label]')
  if (label) {
    tl.fromTo(
      label,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      0.6
    )
  }

  const headingLines = container.querySelectorAll('[data-hero-heading]')
  if (headingLines.length) {
    tl.fromTo(
      headingLines,
      { y: 120, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
      },
      0.8
    )
  }

  const desc = container.querySelector('[data-hero-desc]')
  if (desc) {
    tl.fromTo(
      desc,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      1.4
    )
  }

  const buttons = container.querySelectorAll('[data-hero-btn]')
  if (buttons.length) {
    tl.fromTo(
      buttons,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      },
      1.6
    )
  }

  const lines = container.querySelectorAll('[data-hero-line]')
  if (lines.length) {
    tl.fromTo(
      lines,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.inOut',
        transformOrigin: 'left center',
      },
      1.2
    )
  }

  return tl
}
