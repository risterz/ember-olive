import { gsap, ScrollTrigger } from './gsapSetup'

export function splitTextReveal(
  element: HTMLElement,
  options?: { delay?: number; stagger?: number; y?: number }
) {
  const { delay = 0, stagger = 0.08, y = 80 } = options || {}

  const text = element.textContent || ''
  const words = text.split(/\n|<br>/)

  if (words.length <= 1) {
    gsap.fromTo(
      element,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    )
    return
  }

  element.innerHTML = ''
  const wrapper = document.createElement('span')
  wrapper.style.display = 'block'

  words.forEach((line) => {
    const lineWrapper = document.createElement('span')
    lineWrapper.style.display = 'block'
    lineWrapper.style.overflow = 'hidden'

    const inner = document.createElement('span')
    inner.style.display = 'block'
    inner.textContent = line.trim()
    inner.style.transform = `translateY(${y}px)`
    inner.style.opacity = '0'

    lineWrapper.appendChild(inner)
    wrapper.appendChild(lineWrapper)
  })

  element.appendChild(wrapper)

  const inners = wrapper.querySelectorAll<HTMLElement>(
    'span > span:last-child'
  )
  gsap.to(inners, {
    y: 0,
    opacity: 1,
    duration: 1,
    stagger,
    delay,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none none',
    },
  })
}

export function fadeUp(
  element: HTMLElement | HTMLElement[],
  options?: { delay?: number; stagger?: number; y?: number; duration?: number }
) {
  const { delay = 0, stagger = 0.1, y = 40, duration = 0.8 } = options || {}

  gsap.fromTo(
    element,
    { y, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration,
      delay,
      stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: Array.isArray(element) ? element[0] : element,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    }
  )
}

export function lineExpand(
  element: HTMLElement,
  options?: { delay?: number; duration?: number }
) {
  const { delay = 0, duration = 1 } = options || {}

  gsap.fromTo(
    element,
    { scaleX: 0 },
    {
      scaleX: 1,
      duration,
      delay,
      ease: 'power3.inOut',
      transformOrigin: 'left center',
      scrollTrigger: {
        trigger: element,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    }
  )
}

export function counterAnimation(
  element: HTMLElement,
  target: number,
  options?: { duration?: number; suffix?: string }
) {
  const { duration = 2, suffix = '' } = options || {}
  const obj = { value: 0 }

  gsap.to(obj, {
    value: target,
    duration,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
    onUpdate: () => {
      element.textContent = Math.round(obj.value) + suffix
    },
  })
}

export { ScrollTrigger }
