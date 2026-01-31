import { useEffect, useRef } from 'react'

// Golden ratio for organic wave patterns
const PHI = 1.618033988749

interface WaveConfig {
  amplitude: number
  frequency: number
  speed: number
  phase: number
  yOffset: number
  hue: number
  opacity: number
}

// Reduced fiber counts for better performance
const DESKTOP_WAVES: WaveConfig[] = [
  { amplitude: 25, frequency: 0.008, speed: 0.4, phase: 0, yOffset: 0.25, hue: 220, opacity: 0.15 },
  { amplitude: 30, frequency: 0.006, speed: 0.32, phase: PHI, yOffset: 0.35, hue: 240, opacity: 0.18 },
  { amplitude: 35, frequency: 0.005, speed: 0.25, phase: PHI * 2, yOffset: 0.45, hue: 260, opacity: 0.2 },
  { amplitude: 32, frequency: 0.0055, speed: 0.28, phase: PHI * 3, yOffset: 0.55, hue: 280, opacity: 0.18 },
  { amplitude: 28, frequency: 0.007, speed: 0.35, phase: PHI * 4, yOffset: 0.65, hue: 300, opacity: 0.16 },
  { amplitude: 24, frequency: 0.0075, speed: 0.38, phase: PHI * 5, yOffset: 0.75, hue: 320, opacity: 0.14 },
]

const TABLET_WAVES: WaveConfig[] = [
  { amplitude: 28, frequency: 0.007, speed: 0.35, phase: 0, yOffset: 0.30, hue: 230, opacity: 0.18 },
  { amplitude: 34, frequency: 0.0055, speed: 0.26, phase: PHI * 2, yOffset: 0.48, hue: 265, opacity: 0.22 },
  { amplitude: 30, frequency: 0.006, speed: 0.3, phase: PHI * 4, yOffset: 0.66, hue: 300, opacity: 0.18 },
]

const MOBILE_WAVES: WaveConfig[] = [
  { amplitude: 30, frequency: 0.008, speed: 0.3, phase: 0, yOffset: 0.40, hue: 250, opacity: 0.22 },
  { amplitude: 35, frequency: 0.006, speed: 0.24, phase: PHI * 3, yOffset: 0.60, hue: 290, opacity: 0.25 },
]

export function InteractiveWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let waves: WaveConfig[] = DESKTOP_WAVES

    const updateSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2) // Cap at 2x for performance
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)

      // Select waves based on width
      if (width < 640) {
        waves = MOBILE_WAVES
      } else if (width < 1024) {
        waves = TABLET_WAVES
      } else {
        waves = DESKTOP_WAVES
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      targetRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect()
        targetRef.current = {
          x: (e.touches[0].clientX - rect.left) / rect.width,
          y: (e.touches[0].clientY - rect.top) / rect.height,
        }
      }
    }

    const draw = () => {
      // Smooth mouse interpolation
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * 0.08
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * 0.08

      timeRef.current += 0.012

      // Clear with slight fade for trail effect
      ctx.clearRect(0, 0, width, height)

      const mouseX = mouseRef.current.x * width
      const mouseY = mouseRef.current.y * height
      const step = width < 640 ? 6 : width < 1024 ? 4 : 3

      waves.forEach((wave) => {
        const baseY = height * wave.yOffset

        ctx.beginPath()
        ctx.strokeStyle = `hsla(${wave.hue}, 70%, 55%, ${wave.opacity})`
        ctx.lineWidth = width < 640 ? 2.5 : 1.5
        ctx.lineCap = 'round'

        for (let x = 0; x <= width; x += step) {
          // Base wave motion
          let y = baseY
          y += Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) * wave.amplitude
          y += Math.sin(x * wave.frequency * PHI + timeRef.current * wave.speed * 0.7) * (wave.amplitude * 0.3)

          // Mouse ripple effect
          const dx = x - mouseX
          const dy = baseY - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDist = width * 0.4

          if (distance < maxDist) {
            const influence = Math.pow(1 - distance / maxDist, 2)
            y += Math.sin(distance * 0.02 - timeRef.current * 2.5) * 35 * influence
          }

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
      })

      animationRef.current = requestAnimationFrame(draw)
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchMove as EventListener, { passive: true })

    animationRef.current = requestAnimationFrame(draw)

    return () => {
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
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  )
}
