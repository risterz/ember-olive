import { gsap } from './gsapSetup'

export function buttonHoverEnter(button: HTMLElement) {
  const arrow = button.querySelector('[data-arrow]')
  const underline = button.querySelector('[data-underline]')

  gsap.to(button, {
    y: -2,
    duration: 0.3,
    ease: 'power2.out',
  })

  if (arrow) {
    gsap.to(arrow, {
      x: 4,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  if (underline) {
    gsap.to(underline, {
      scaleX: 1,
      duration: 0.3,
      ease: 'power2.out',
      transformOrigin: 'left center',
    })
  }
}

export function buttonHoverLeave(button: HTMLElement) {
  const arrow = button.querySelector('[data-arrow]')
  const underline = button.querySelector('[data-underline]')

  gsap.to(button, {
    y: 0,
    duration: 0.3,
    ease: 'power2.out',
  })

  if (arrow) {
    gsap.to(arrow, {
      x: 0,
      duration: 0.3,
      ease: 'power2.out',
    })
  }

  if (underline) {
    gsap.to(underline, {
      scaleX: 0,
      duration: 0.3,
      ease: 'power2.out',
      transformOrigin: 'right center',
    })
  }
}

export function imageHoverEnter(image: HTMLElement) {
  gsap.to(image, {
    scale: 1.06,
    duration: 0.6,
    ease: 'power3.out',
  })
}

export function imageHoverLeave(image: HTMLElement) {
  gsap.to(image, {
    scale: 1,
    duration: 0.6,
    ease: 'power3.out',
  })
}

export function navLinkHover(link: HTMLElement, enter: boolean) {
  const line = link.querySelector('[data-nav-line]')
  if (line) {
    gsap.to(line, {
      scaleX: enter ? 1 : 0,
      duration: 0.3,
      ease: 'power2.out',
      transformOrigin: enter ? 'left center' : 'right center',
    })
  }
}
