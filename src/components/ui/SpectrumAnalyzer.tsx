import { useEffect, useRef, useState } from 'react'

const BAR_COUNT = 48
const PHI = 1.618033988749

// Generate frequency-like distribution (more detail in lows/mids, less in highs)
function getFrequencyWeight(index: number, total: number): number {
  const normalized = index / total
  // Logarithmic-ish curve like real frequency spectrum
  return Math.pow(1 - normalized, 0.3)
}

export function SpectrumAnalyzer() {
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(10))
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)
  const animationRef = useRef<number>()
  const isHoveringRef = useRef(false)
  const lastInteractionRef = useRef(0)

  // Track mouse position globally
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      mousePosRef.current = { x, y }

      // Consider "hovering" if mouse is in upper 80% of screen (wave area)
      isHoveringRef.current = y < 0.8
      if (isHoveringRef.current) {
        lastInteractionRef.current = Date.now()
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const x = e.touches[0].clientX / window.innerWidth
        const y = e.touches[0].clientY / window.innerHeight
        mousePosRef.current = { x, y }
        isHoveringRef.current = y < 0.8
        if (isHoveringRef.current) {
          lastInteractionRef.current = Date.now()
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.016
      const time = timeRef.current
      const mouseX = mousePosRef.current.x

      // Check if recently interacted (within last 2 seconds)
      const timeSinceInteraction = Date.now() - lastInteractionRef.current
      const interactionFade = Math.max(0, 1 - timeSinceInteraction / 2000)
      const isInteracting = interactionFade > 0

      const newBars = Array(BAR_COUNT).fill(0).map((_, i) => {
        const normalizedIndex = i / BAR_COUNT
        const freqWeight = getFrequencyWeight(i, BAR_COUNT)

        // Base ambient animation (always present)
        const ambientBase = 8 + Math.sin(time * 0.5 + i * 0.2) * 4
        const ambientPulse = Math.sin(time * (0.8 + i * 0.02) + i * PHI * 0.1) * 6
        const ambientNoise = Math.sin(time * 2.5 + i * 1.5) * 3
        let height = ambientBase + ambientPulse + ambientNoise

        if (isInteracting) {
          // Mouse-reactive spectrum
          // Calculate distance from mouse X position to this bar
          const barPosition = normalizedIndex
          const distance = Math.abs(barPosition - mouseX)

          // Create a bell curve response centered on mouse position
          const spread = 0.15 // How wide the response is
          const response = Math.exp(-Math.pow(distance / spread, 2))

          // Add harmonics (like real audio would have overtones)
          const fundamental = response * 45 * freqWeight
          const harmonic2 = Math.exp(-Math.pow((distance * 2) / spread, 2)) * 20 * freqWeight
          const harmonic3 = Math.exp(-Math.pow((distance * 3) / spread, 2)) * 10 * freqWeight

          // Sub-bass boost when mouse is on left side
          const subBoost = mouseX < 0.3 && normalizedIndex < 0.15 ? 15 * (1 - normalizedIndex / 0.15) : 0

          // High-end shimmer when mouse is on right side
          const highShimmer = mouseX > 0.7 && normalizedIndex > 0.7
            ? Math.sin(time * 8 + i) * 8 * normalizedIndex
            : 0

          const mouseResponse = (fundamental + harmonic2 + harmonic3 + subBoost + highShimmer) * interactionFade
          height += mouseResponse
        }

        // Add some random variation for liveliness
        height += Math.random() * 2

        // Clamp and apply frequency-based ceiling
        const maxHeight = 15 + freqWeight * 70
        return Math.min(Math.max(height, 3), maxHeight)
      })

      setBars(newBars)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[2px] h-32 px-4 pointer-events-none">
      {bars.map((height, i) => {
        // Color gradient based on position (frequency)
        const hue = 220 + (i / BAR_COUNT) * 100 // Blue to pink
        const saturation = 70 + (height / 80) * 20
        const lightness = 50 + (height / 80) * 15

        return (
          <div
            key={i}
            className="flex-1 max-w-[6px] rounded-t-sm transition-all duration-75"
            style={{
              height: `${height}%`,
              background: `linear-gradient(to top,
                hsla(${hue}, ${saturation}%, ${lightness * 0.6}%, 0.8),
                hsla(${hue + 20}, ${saturation}%, ${lightness}%, 0.9),
                hsla(${hue + 40}, ${saturation}%, ${lightness * 1.2}%, 0.7)
              )`,
              boxShadow: height > 40
                ? `0 0 ${height / 5}px hsla(${hue}, ${saturation}%, ${lightness}%, 0.5)`
                : 'none',
            }}
          />
        )
      })}
    </div>
  )
}
