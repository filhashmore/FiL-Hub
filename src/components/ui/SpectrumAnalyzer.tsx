import { useEffect, useRef } from 'react'

const PHI = 1.618033988749

export function SpectrumAnalyzer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5 })
  const targetRef = useRef({ x: 0.5 })
  const heightsRef = useRef<number[]>([])
  const peaksRef = useRef<number[]>([])
  const timeRef = useRef(0)
  const lastInteractionRef = useRef(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let barCount = 32
    let dpr = 1

    const updateSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr

      // Adjust bar count based on width
      barCount = width < 640 ? 20 : width < 1024 ? 28 : 36

      // Initialize arrays
      if (heightsRef.current.length !== barCount) {
        heightsRef.current = Array(barCount).fill(3)
        peaksRef.current = Array(barCount).fill(3)
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

    const draw = () => {
      // Smooth mouse tracking
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.1
      timeRef.current += 0.014

      const timeSinceInteraction = Date.now() - lastInteractionRef.current
      const interactionStrength = Math.max(0, 1 - timeSinceInteraction / 1200)

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const gap = 2
      const barWidth = (width - (barCount - 1) * gap) / barCount
      const heights = heightsRef.current
      const peaks = peaksRef.current

      for (let i = 0; i < barCount; i++) {
        const normalizedIndex = i / barCount
        const freqWeight = Math.pow(1 - normalizedIndex, 0.4)

        // Base ambient animation
        let target = 3
        target += Math.sin(timeRef.current * 0.5 + i * 0.2) * 3
        target += Math.sin(timeRef.current * 0.8 + i * PHI * 0.1) * 2

        // Mouse interaction
        if (interactionStrength > 0) {
          const distance = Math.abs(normalizedIndex - mouseRef.current.x)
          const spread = 0.15
          const primary = Math.exp(-Math.pow(distance / spread, 2)) * 45 * freqWeight
          const harmonic = Math.exp(-Math.pow(distance * 2 / spread, 2)) * 20 * freqWeight
          target += (primary + harmonic) * interactionStrength
        }

        // Apply physics
        const maxHeight = 8 + freqWeight * 70
        target = Math.min(target, maxHeight)

        if (target > heights[i]) {
          heights[i] += (target - heights[i]) * 0.3 // Attack
        } else {
          heights[i] = 3 + (heights[i] - 3) * 0.9 // Decay
        }

        // Peak tracking
        if (heights[i] > peaks[i]) {
          peaks[i] = heights[i]
        } else {
          peaks[i] = Math.max(heights[i], peaks[i] * 0.97)
        }

        // Draw bar
        const barHeight = (heights[i] / 100) * height
        const x = i * (barWidth + gap)
        const y = height - barHeight

        // Color gradient based on frequency
        const hue = 220 + normalizedIndex * 100
        const lightness = 50 + (heights[i] / 100) * 20

        const gradient = ctx.createLinearGradient(x, height, x, y)
        gradient.addColorStop(0, `hsla(${hue}, 70%, ${lightness * 0.6}%, 0.9)`)
        gradient.addColorStop(1, `hsla(${hue + 20}, 75%, ${lightness}%, 0.85)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0])
        ctx.fill()

        // Peak indicator
        if (peaks[i] > heights[i] + 3) {
          const peakY = height - (peaks[i] / 100) * height
          ctx.fillStyle = `hsla(${hue + 15}, 80%, 65%, 0.7)`
          ctx.fillRect(x, peakY, barWidth, 2)
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', updateSize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-0 left-0 right-0 h-20 md:h-24 pointer-events-none"
      style={{ width: '100%' }}
    />
  )
}
