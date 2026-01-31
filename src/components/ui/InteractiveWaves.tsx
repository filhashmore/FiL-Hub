import { useEffect, useRef } from 'react'

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

// Desktop: 12 fibers - rich but performant
const DESKTOP_WAVES: WaveConfig[] = [
  { amplitude: 22, frequency: 0.008, speed: 0.42, phase: 0, yOffset: 0.18, hue: 215, opacity: 0.14 },
  { amplitude: 28, frequency: 0.006, speed: 0.35, phase: PHI * 0.7, yOffset: 0.24, hue: 225, opacity: 0.16 },
  { amplitude: 32, frequency: 0.0055, speed: 0.28, phase: PHI * 1.4, yOffset: 0.32, hue: 240, opacity: 0.18 },
  { amplitude: 35, frequency: 0.005, speed: 0.24, phase: PHI * 2.1, yOffset: 0.40, hue: 255, opacity: 0.20 },
  { amplitude: 38, frequency: 0.0048, speed: 0.22, phase: PHI * 2.8, yOffset: 0.47, hue: 270, opacity: 0.22 },
  { amplitude: 36, frequency: 0.0052, speed: 0.25, phase: PHI * 3.5, yOffset: 0.54, hue: 280, opacity: 0.20 },
  { amplitude: 34, frequency: 0.0055, speed: 0.28, phase: PHI * 4.2, yOffset: 0.61, hue: 290, opacity: 0.18 },
  { amplitude: 30, frequency: 0.006, speed: 0.32, phase: PHI * 4.9, yOffset: 0.68, hue: 305, opacity: 0.17 },
  { amplitude: 26, frequency: 0.0065, speed: 0.36, phase: PHI * 5.6, yOffset: 0.74, hue: 320, opacity: 0.15 },
  { amplitude: 24, frequency: 0.007, speed: 0.38, phase: PHI * 6.3, yOffset: 0.80, hue: 335, opacity: 0.14 },
  { amplitude: 20, frequency: 0.0075, speed: 0.42, phase: PHI * 7, yOffset: 0.86, hue: 345, opacity: 0.12 },
  { amplitude: 18, frequency: 0.008, speed: 0.45, phase: PHI * 7.7, yOffset: 0.91, hue: 355, opacity: 0.10 },
]

// Tablet: 6 fibers
const TABLET_WAVES: WaveConfig[] = [
  { amplitude: 26, frequency: 0.007, speed: 0.36, phase: 0, yOffset: 0.25, hue: 225, opacity: 0.18 },
  { amplitude: 34, frequency: 0.0052, speed: 0.26, phase: PHI * 1.5, yOffset: 0.38, hue: 255, opacity: 0.22 },
  { amplitude: 38, frequency: 0.0048, speed: 0.22, phase: PHI * 3, yOffset: 0.50, hue: 275, opacity: 0.24 },
  { amplitude: 34, frequency: 0.0055, speed: 0.28, phase: PHI * 4.5, yOffset: 0.62, hue: 295, opacity: 0.20 },
  { amplitude: 28, frequency: 0.0065, speed: 0.34, phase: PHI * 6, yOffset: 0.75, hue: 320, opacity: 0.17 },
  { amplitude: 22, frequency: 0.0075, speed: 0.4, phase: PHI * 7.5, yOffset: 0.88, hue: 345, opacity: 0.14 },
]

// Mobile: 4 fibers
const MOBILE_WAVES: WaveConfig[] = [
  { amplitude: 28, frequency: 0.008, speed: 0.32, phase: 0, yOffset: 0.30, hue: 235, opacity: 0.22 },
  { amplitude: 36, frequency: 0.006, speed: 0.24, phase: PHI * 2, yOffset: 0.48, hue: 270, opacity: 0.26 },
  { amplitude: 32, frequency: 0.0065, speed: 0.28, phase: PHI * 4, yOffset: 0.66, hue: 305, opacity: 0.22 },
  { amplitude: 24, frequency: 0.0075, speed: 0.36, phase: PHI * 6, yOffset: 0.82, hue: 340, opacity: 0.18 },
]

interface Particle {
  x: number
  y: number
  baseX: number
  baseY: number
  size: number
  speed: number
  hue: number
  phase: number
}

export function InteractiveWaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const targetRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
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
    let showParticles = true
    let showGlow = true

    const initParticles = () => {
      const count = width < 640 ? 0 : width < 1024 ? 8 : 15
      particlesRef.current = Array.from({ length: count }, () => ({
        x: 0,
        y: 0,
        baseX: Math.random(),
        baseY: 0.15 + Math.random() * 0.7,
        size: 2 + Math.random() * 3,
        speed: 0.3 + Math.random() * 0.5,
        hue: 220 + Math.random() * 130,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const updateSize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.offsetWidth
      height = canvas.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr

      if (width < 640) {
        waves = MOBILE_WAVES
        showParticles = false
        showGlow = false
      } else if (width < 1024) {
        waves = TABLET_WAVES
        showParticles = true
        showGlow = false
      } else {
        waves = DESKTOP_WAVES
        showParticles = true
        showGlow = true
      }

      initParticles()
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

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, width, height)

      const mouseX = mouseRef.current.x * width
      const mouseY = mouseRef.current.y * height
      const step = width < 640 ? 5 : width < 1024 ? 4 : 3

      // Draw waves
      waves.forEach((wave) => {
        const baseY = height * wave.yOffset

        // Create gradient stroke
        const gradient = ctx.createLinearGradient(0, 0, width, 0)
        gradient.addColorStop(0, `hsla(${wave.hue}, 70%, 55%, 0)`)
        gradient.addColorStop(0.15, `hsla(${wave.hue}, 70%, 55%, ${wave.opacity})`)
        gradient.addColorStop(0.5, `hsla(${wave.hue}, 75%, 60%, ${wave.opacity * 1.2})`)
        gradient.addColorStop(0.85, `hsla(${wave.hue}, 70%, 55%, ${wave.opacity})`)
        gradient.addColorStop(1, `hsla(${wave.hue}, 70%, 55%, 0)`)

        // Glow layer (desktop only)
        if (showGlow) {
          ctx.beginPath()
          ctx.strokeStyle = `hsla(${wave.hue}, 60%, 50%, ${wave.opacity * 0.3})`
          ctx.lineWidth = 4
          ctx.lineCap = 'round'
          ctx.shadowColor = `hsla(${wave.hue}, 70%, 55%, 0.4)`
          ctx.shadowBlur = 8

          for (let x = 0; x <= width; x += step) {
            let y = baseY
            y += Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) * wave.amplitude
            y += Math.sin(x * wave.frequency * PHI + timeRef.current * wave.speed * 0.7) * (wave.amplitude * 0.3)
            y += Math.sin(x * wave.frequency / PHI + timeRef.current * wave.speed * 1.2) * (wave.amplitude * 0.15)

            const dx = x - mouseX
            const dy = baseY - mouseY
            const distance = Math.sqrt(dx * dx + dy * dy)
            const maxDist = width * 0.4

            if (distance < maxDist) {
              const influence = Math.pow(1 - distance / maxDist, 2)
              y += Math.sin(distance * 0.018 - timeRef.current * 2.5) * 40 * influence
            }

            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
          ctx.shadowBlur = 0
        }

        // Main wave stroke
        ctx.beginPath()
        ctx.strokeStyle = gradient
        ctx.lineWidth = width < 640 ? 2.5 : 1.8
        ctx.lineCap = 'round'

        for (let x = 0; x <= width; x += step) {
          let y = baseY
          y += Math.sin(x * wave.frequency + timeRef.current * wave.speed + wave.phase) * wave.amplitude
          y += Math.sin(x * wave.frequency * PHI + timeRef.current * wave.speed * 0.7) * (wave.amplitude * 0.3)
          y += Math.sin(x * wave.frequency / PHI + timeRef.current * wave.speed * 1.2) * (wave.amplitude * 0.15)

          const dx = x - mouseX
          const dy = baseY - mouseY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDist = width * 0.4

          if (distance < maxDist) {
            const influence = Math.pow(1 - distance / maxDist, 2)
            y += Math.sin(distance * 0.018 - timeRef.current * 2.5) * 40 * influence
          }

          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      })

      // Draw particles
      if (showParticles) {
        particlesRef.current.forEach((particle) => {
          // Float animation
          const floatY = Math.sin(timeRef.current * particle.speed + particle.phase) * 12

          // Mouse repulsion
          const dx = particle.baseX - mouseRef.current.x
          const dy = particle.baseY - mouseRef.current.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const repelRadius = 0.2
          let repelX = 0
          let repelY = 0

          if (dist < repelRadius) {
            const force = (1 - dist / repelRadius) * 50
            repelX = (dx / dist) * force
            repelY = (dy / dist) * force
          }

          particle.x = particle.baseX * width + repelX
          particle.y = particle.baseY * height + floatY + repelY

          // Draw particle with glow
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fillStyle = `hsla(${particle.hue}, 65%, 60%, 0.4)`
          if (showGlow) {
            ctx.shadowColor = `hsla(${particle.hue}, 70%, 55%, 0.5)`
            ctx.shadowBlur = particle.size * 2
          }
          ctx.fill()
          ctx.shadowBlur = 0
        })
      }

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
    />
  )
}
