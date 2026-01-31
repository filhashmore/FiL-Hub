import { useEffect, useRef, useCallback } from 'react'

const BAR_COUNT = 48
const PHI = 1.618033988749

// Audio spectrum analyzer physics
const ATTACK_SPEED = 0.35      // How fast bars rise (0-1, higher = faster)
const DECAY_RATE = 0.92        // Exponential decay multiplier (0-1, higher = slower decay)
const MINIMUM_HEIGHT = 2       // Floor level
const SMOOTHING = 0.15         // Smoothing between adjacent bars

// Generate frequency-like distribution (more energy in lows/mids)
function getFrequencyWeight(index: number, total: number): number {
  const normalized = index / total
  return Math.pow(1 - normalized, 0.4)
}

export function SpectrumAnalyzer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentHeightsRef = useRef<number[]>(Array(BAR_COUNT).fill(MINIMUM_HEIGHT))
  const targetHeightsRef = useRef<number[]>(Array(BAR_COUNT).fill(MINIMUM_HEIGHT))
  const peakHeightsRef = useRef<number[]>(Array(BAR_COUNT).fill(MINIMUM_HEIGHT))
  const peakDecayRef = useRef<number[]>(Array(BAR_COUNT).fill(0))
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)
  const animationRef = useRef<number>()
  const lastInteractionRef = useRef(0)

  // Track mouse/touch position
  useEffect(() => {
    const updatePosition = (x: number, y: number) => {
      mousePosRef.current = { x, y }
      if (y < 0.85) {
        lastInteractionRef.current = Date.now()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX / window.innerWidth, e.clientY / window.innerHeight)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(
          e.touches[0].clientX / window.innerWidth,
          e.touches[0].clientY / window.innerHeight
        )
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchMove as any, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchMove as any)
    }
  }, [])

  // Calculate target heights based on input
  const calculateTargets = useCallback((time: number) => {
    const mouseX = mousePosRef.current.x
    const timeSinceInteraction = Date.now() - lastInteractionRef.current
    const interactionStrength = Math.max(0, 1 - timeSinceInteraction / 1500)

    for (let i = 0; i < BAR_COUNT; i++) {
      const normalizedIndex = i / BAR_COUNT
      const freqWeight = getFrequencyWeight(i, BAR_COUNT)

      // Ambient base animation (always present, subtle)
      let target = MINIMUM_HEIGHT
      target += 3 + Math.sin(time * 0.4 + i * 0.15) * 2
      target += Math.sin(time * 0.7 + i * PHI * 0.08) * 3
      target += Math.sin(time * 1.2 + i * 0.25) * 1.5

      // Mouse interaction response
      if (interactionStrength > 0) {
        const distance = Math.abs(normalizedIndex - mouseX)
        const spread = 0.12

        // Primary response - gaussian curve
        const primary = Math.exp(-Math.pow(distance / spread, 2)) * 55 * freqWeight

        // Harmonics for richer response
        const h2 = Math.exp(-Math.pow(distance * 2.1 / spread, 2)) * 25 * freqWeight
        const h3 = Math.exp(-Math.pow(distance * 3.2 / spread, 2)) * 12 * freqWeight

        // Sub-bass emphasis (left side)
        const subBass = mouseX < 0.25 && normalizedIndex < 0.12
          ? 20 * (1 - normalizedIndex / 0.12) * (1 - mouseX / 0.25)
          : 0

        // High frequency detail (right side)
        const highFreq = mouseX > 0.75 && normalizedIndex > 0.7
          ? Math.sin(time * 6 + i * 0.5) * 10 * (normalizedIndex - 0.7) / 0.3
          : 0

        target += (primary + h2 + h3 + subBass + highFreq) * interactionStrength
      }

      // Apply frequency-based ceiling
      const maxHeight = 8 + freqWeight * 75
      targetHeightsRef.current[i] = Math.min(Math.max(target, MINIMUM_HEIGHT), maxHeight)
    }
  }, [])

  // Apply smooth attack/decay physics
  const applyPhysics = useCallback(() => {
    const current = currentHeightsRef.current
    const target = targetHeightsRef.current
    const peaks = peakHeightsRef.current
    const peakDecay = peakDecayRef.current

    for (let i = 0; i < BAR_COUNT; i++) {
      const targetVal = target[i]
      let currentVal = current[i]

      if (targetVal > currentVal) {
        // Attack: fast rise toward target
        currentVal += (targetVal - currentVal) * ATTACK_SPEED
      } else {
        // Release: exponential decay
        currentVal = MINIMUM_HEIGHT + (currentVal - MINIMUM_HEIGHT) * DECAY_RATE
        // Ensure we don't go below target if target is above minimum
        if (currentVal < targetVal) {
          currentVal = targetVal
        }
      }

      current[i] = currentVal

      // Peak hold with slow decay
      if (currentVal > peaks[i]) {
        peaks[i] = currentVal
        peakDecay[i] = 0
      } else {
        peakDecay[i] += 0.016
        if (peakDecay[i] > 0.3) { // Hold for 300ms
          peaks[i] = Math.max(currentVal, peaks[i] * 0.96)
        }
      }
    }

    // Optional: slight smoothing between adjacent bars
    const smoothed = [...current]
    for (let i = 1; i < BAR_COUNT - 1; i++) {
      smoothed[i] = current[i] * (1 - SMOOTHING) +
        (current[i - 1] + current[i + 1]) * (SMOOTHING / 2)
    }
    currentHeightsRef.current = smoothed
  }, [])

  // Render to canvas for better performance
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height
    const barWidth = (width - (BAR_COUNT - 1) * 2) / BAR_COUNT
    const gap = 2

    // Clear
    ctx.clearRect(0, 0, width, height)

    const current = currentHeightsRef.current
    const peaks = peakHeightsRef.current

    for (let i = 0; i < BAR_COUNT; i++) {
      const barHeight = (current[i] / 100) * height
      const peakHeight = (peaks[i] / 100) * height
      const x = i * (barWidth + gap)
      const y = height - barHeight

      // Color based on frequency position
      const hue = 220 + (i / BAR_COUNT) * 110
      const saturation = 75 + (current[i] / 100) * 20
      const lightness = 55 + (current[i] / 100) * 20

      // Bar gradient
      const gradient = ctx.createLinearGradient(x, height, x, y)
      gradient.addColorStop(0, `hsla(${hue}, ${saturation}%, ${lightness * 0.5}%, 0.9)`)
      gradient.addColorStop(0.5, `hsla(${hue + 15}, ${saturation}%, ${lightness}%, 0.95)`)
      gradient.addColorStop(1, `hsla(${hue + 30}, ${saturation}%, ${lightness * 1.1}%, 0.85)`)

      // Draw bar with rounded top
      ctx.fillStyle = gradient
      ctx.beginPath()
      const radius = Math.min(barWidth / 2, 3)
      ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0])
      ctx.fill()

      // Glow effect for active bars
      if (current[i] > 30) {
        ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`
        ctx.shadowBlur = current[i] / 8
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Peak indicator
      if (peaks[i] > current[i] + 2) {
        const peakY = height - peakHeight
        ctx.fillStyle = `hsla(${hue + 20}, 90%, 70%, 0.8)`
        ctx.fillRect(x, peakY, barWidth, 2)
      }
    }
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      }
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    const animate = () => {
      timeRef.current += 0.016
      calculateTargets(timeRef.current)
      applyPhysics()
      render()
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('resize', updateSize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [calculateTargets, applyPhysics, render])

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
      style={{ width: '100%' }}
    />
  )
}
