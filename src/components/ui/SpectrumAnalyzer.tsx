import { useEffect, useRef } from 'react'

const PHI = 1.618033988749

// Check for reduced motion preference
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function SpectrumAnalyzer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5 })
  const targetRef = useRef({ x: 0.5 })
  const heightsRef = useRef<number[]>([])
  const peaksRef = useRef<number[]>([])
  const peakHoldRef = useRef<number[]>([])
  const timeRef = useRef(0)
  const lastInteractionRef = useRef(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Skip animation entirely if user prefers reduced motion
    if (prefersReducedMotion()) {
      return
    }

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let barCount = 48
    let dpr = 1
    let showGlow = true
    let isVisible = true
    let lastFrameTime = 0
    const targetFPS = 60
    const frameInterval = 1000 / targetFPS

    // Use Intersection Observer for performance
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.1 }
    )
    observer.observe(canvas)

    const updateSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr

      // Adjust based on device
      if (width < 640) {
        barCount = 24
        showGlow = false
      } else if (width < 1024) {
        barCount = 36
        showGlow = false
      } else {
        barCount = 48
        showGlow = true
      }

      // Initialize/resize arrays
      if (heightsRef.current.length !== barCount) {
        heightsRef.current = Array(barCount).fill(2)
        peaksRef.current = Array(barCount).fill(2)
        peakHoldRef.current = Array(barCount).fill(0)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX / window.innerWidth
      lastInteractionRef.current = Date.now()
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        targetRef.current.x = e.touches[0].clientX / window.innerWidth
        lastInteractionRef.current = Date.now()
      }
    }

    const draw = (timestamp: number) => {
      // Skip frames if not visible
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }

      // Throttle to target FPS for consistent performance
      const elapsed = timestamp - lastFrameTime
      if (elapsed < frameInterval) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }
      lastFrameTime = timestamp - (elapsed % frameInterval)

      // Smooth mouse tracking (smoother = lower value)
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.08
      timeRef.current += 0.016

      const timeSinceInteraction = Date.now() - lastInteractionRef.current
      const interactionStrength = Math.max(0, 1 - timeSinceInteraction / 1500)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const gap = width < 640 ? 1.5 : 2
      const barWidth = (width - (barCount - 1) * gap) / barCount
      const heights = heightsRef.current
      const peaks = peaksRef.current
      const peakHold = peakHoldRef.current
      const mouseX = mouseRef.current.x

      for (let i = 0; i < barCount; i++) {
        const normalizedIndex = i / barCount
        const freqWeight = Math.pow(1 - normalizedIndex, 0.4)

        // Base ambient animation
        let target = 2
        target += Math.sin(timeRef.current * 0.4 + i * 0.15) * 2.5
        target += Math.sin(timeRef.current * 0.7 + i * PHI * 0.08) * 2
        target += Math.sin(timeRef.current * 1.1 + i * 0.22) * 1.5

        // Mouse interaction
        if (interactionStrength > 0) {
          const distance = Math.abs(normalizedIndex - mouseX)
          const spread = 0.12

          // Primary response - gaussian curve
          const primary = Math.exp(-Math.pow(distance / spread, 2)) * 55 * freqWeight

          // Harmonics for richer response
          const h2 = Math.exp(-Math.pow(distance * 2.1 / spread, 2)) * 25 * freqWeight
          const h3 = Math.exp(-Math.pow(distance * 3.2 / spread, 2)) * 12 * freqWeight

          // Sub-bass emphasis (left side)
          let subBass = 0
          if (mouseX < 0.25 && normalizedIndex < 0.15) {
            subBass = 25 * (1 - normalizedIndex / 0.15) * (1 - mouseX / 0.25)
          }

          // High frequency shimmer (right side)
          let highFreq = 0
          if (mouseX > 0.75 && normalizedIndex > 0.7) {
            highFreq = Math.sin(timeRef.current * 8 + i * 0.6) * 12 * ((normalizedIndex - 0.7) / 0.3)
          }

          target += (primary + h2 + h3 + subBass + highFreq) * interactionStrength
        }

        // Apply physics - fast attack, exponential decay
        const maxHeight = 8 + freqWeight * 85
        target = Math.min(target, maxHeight)

        if (target > heights[i]) {
          heights[i] += (target - heights[i]) * 0.25 // Smoother attack
        } else {
          heights[i] = 2 + (heights[i] - 2) * 0.94 // Smoother decay
        }

        // Peak hold with 300ms hold time
        if (heights[i] > peaks[i]) {
          peaks[i] = heights[i]
          peakHold[i] = 0
        } else {
          peakHold[i] += 0.016
          if (peakHold[i] > 0.3) {
            peaks[i] = Math.max(heights[i], peaks[i] * 0.96)
          }
        }

        // Adjacent bar smoothing (more smoothing for fluid look)
        if (i > 0 && i < barCount - 1) {
          heights[i] = heights[i] * 0.7 + (heights[i - 1] + heights[i + 1]) * 0.15
        }

        // Draw bar
        const barHeight = (heights[i] / 100) * height
        const x = i * (barWidth + gap)
        const y = height - barHeight

        // Color gradient based on frequency
        const hue = 220 + normalizedIndex * 110
        const saturation = 70 + (heights[i] / 100) * 20
        const lightness = 50 + (heights[i] / 100) * 25

        // Create vertical gradient for bar
        const gradient = ctx.createLinearGradient(x, height, x, y)
        gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness * 0.5}%, 0.9)`)
        gradient.addColorStop(0.4, `hsla(${hue + 10}, ${saturation}%, ${lightness * 0.8}%, 0.95)`)
        gradient.addColorStop(1, `hsla(${hue + 25}, ${saturation}%, ${lightness}%, 0.85)`)

        // Glow effect for active bars (desktop only)
        if (showGlow && heights[i] > 25) {
          ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`
          ctx.shadowBlur = heights[i] / 6
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        const radius = Math.min(barWidth / 2, 3)
        ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0])
        ctx.fill()
        ctx.shadowBlur = 0

        // Peak indicator with glow
        if (peaks[i] > heights[i] + 2) {
          const peakY = height - (peaks[i] / 100) * height
          ctx.fillStyle = `hsla(${hue + 20}, 85%, 70%, 0.85)`
          if (showGlow) {
            ctx.shadowColor = `hsla(${hue + 20}, 90%, 75%, 0.5)`
            ctx.shadowBlur = 4
          }
          ctx.fillRect(x, peakY, barWidth, 2)
          ctx.shadowBlur = 0
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    updateSize()
    window.addEventListener('resize', updateSize, { passive: true })
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchMove as EventListener, { passive: true })

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchMove as EventListener)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 right-0 h-20 sm:h-24 md:h-28 pointer-events-none"
      style={{
        width: '100%',
        willChange: 'transform',
      }}
    />
  )
}
