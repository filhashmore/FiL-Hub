import { useCallback, useEffect } from 'react'

interface SmoothScrollOptions {
  duration?: number
  easing?: (t: number) => number
  offset?: number
}

// Optimized easing function (easeOutExpo)
const defaultEasing = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function useSmoothScroll() {
  // Handle native smooth scroll with fallback
  const scrollTo = useCallback((target: string | number | HTMLElement, options: SmoothScrollOptions = {}) => {
    const { duration = 800, easing = defaultEasing, offset = 0 } = options

    let targetPosition: number

    if (typeof target === 'number') {
      targetPosition = target
    } else if (typeof target === 'string') {
      const element = document.querySelector(target)
      if (!element) return
      targetPosition = element.getBoundingClientRect().top + window.scrollY + offset
    } else {
      targetPosition = target.getBoundingClientRect().top + window.scrollY + offset
    }

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, targetPosition)
      return
    }

    // Check for native smooth scroll support
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      })
      return
    }

    // Fallback: custom smooth scroll animation
    const startPosition = window.scrollY
    const distance = targetPosition - startPosition
    let startTime: number | null = null

    const animation = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      const easedProgress = easing(progress)

      window.scrollTo(0, startPosition + distance * easedProgress)

      if (timeElapsed < duration) {
        requestAnimationFrame(animation)
      }
    }

    requestAnimationFrame(animation)
  }, [])

  const scrollToTop = useCallback(() => {
    scrollTo(0)
  }, [scrollTo])

  const scrollToElement = useCallback((id: string, offset = -80) => {
    scrollTo(`#${id}`, { offset })
  }, [scrollTo])

  return { scrollTo, scrollToTop, scrollToElement }
}

// Hook to handle scroll restoration on navigation
export function useScrollRestoration() {
  useEffect(() => {
    // Scroll to top on mount with smooth behavior
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [])
}
