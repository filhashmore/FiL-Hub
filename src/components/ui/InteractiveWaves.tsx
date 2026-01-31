import { useEffect, useRef, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

interface Point {
  x: number
  y: number
}

interface WaveConfig {
  amplitude: number
  frequency: number
  speed: number
  phase: number
  yOffset: number
  color: string
  opacity: number
}

// Golden ratio for organic, natural-feeling wave patterns
const PHI = 1.618033988749

// Wave configurations - golden ratio phase offsets (18 fibers)
const WAVE_CONFIGS: WaveConfig[] = [
  // Deep blues - top area
  { amplitude: 20, frequency: 0.009, speed: 0.45, phase: 0, yOffset: 0.18, color: '#1e3a8a', opacity: 0.12 },
  { amplitude: 28, frequency: 0.007, speed: 0.38, phase: PHI * 0.5, yOffset: 0.22, color: '#1e40af', opacity: 0.14 },
  { amplitude: 24, frequency: 0.008, speed: 0.42, phase: PHI, yOffset: 0.26, color: '#2563eb', opacity: 0.13 },
  // Blues to indigo
  { amplitude: 32, frequency: 0.006, speed: 0.32, phase: PHI * 1.5, yOffset: 0.30, color: '#3b82f6', opacity: 0.15 },
  { amplitude: 26, frequency: 0.0075, speed: 0.36, phase: PHI * 2, yOffset: 0.34, color: '#4f46e5', opacity: 0.12 },
  { amplitude: 35, frequency: 0.0055, speed: 0.28, phase: PHI * 2.5, yOffset: 0.38, color: '#6366f1', opacity: 0.16 },
  // Indigo to violet
  { amplitude: 30, frequency: 0.0065, speed: 0.34, phase: PHI * 3, yOffset: 0.42, color: '#7c3aed', opacity: 0.14 },
  { amplitude: 38, frequency: 0.005, speed: 0.26, phase: PHI * 3.5, yOffset: 0.46, color: '#8b5cf6', opacity: 0.17 },
  { amplitude: 28, frequency: 0.007, speed: 0.38, phase: PHI * 4, yOffset: 0.50, color: '#a855f7', opacity: 0.13 },
  // Violet to purple
  { amplitude: 42, frequency: 0.0045, speed: 0.22, phase: PHI * 4.5, yOffset: 0.54, color: '#9333ea', opacity: 0.18 },
  { amplitude: 32, frequency: 0.006, speed: 0.32, phase: PHI * 5, yOffset: 0.58, color: '#a855f7', opacity: 0.14 },
  { amplitude: 36, frequency: 0.0052, speed: 0.28, phase: PHI * 5.5, yOffset: 0.62, color: '#c026d3', opacity: 0.16 },
  // Purple to pink
  { amplitude: 30, frequency: 0.0068, speed: 0.35, phase: PHI * 6, yOffset: 0.66, color: '#d946ef', opacity: 0.13 },
  { amplitude: 40, frequency: 0.0048, speed: 0.24, phase: PHI * 6.5, yOffset: 0.70, color: '#db2777', opacity: 0.17 },
  { amplitude: 26, frequency: 0.0072, speed: 0.4, phase: PHI * 7, yOffset: 0.74, color: '#ec4899', opacity: 0.12 },
  // Pinks - bottom area
  { amplitude: 34, frequency: 0.0058, speed: 0.3, phase: PHI * 7.5, yOffset: 0.78, color: '#f472b6', opacity: 0.15 },
  { amplitude: 22, frequency: 0.008, speed: 0.44, phase: PHI * 8, yOffset: 0.82, color: '#fb7185', opacity: 0.11 },
  { amplitude: 28, frequency: 0.0062, speed: 0.34, phase: PHI * 8.5, yOffset: 0.86, color: '#fda4af', opacity: 0.13 },
]

// Mobile-optimized configs (fewer waves, simpler - 7 fibers)
const MOBILE_WAVE_CONFIGS: WaveConfig[] = [
  { amplitude: 18, frequency: 0.01, speed: 0.38, phase: 0, yOffset: 0.28, color: '#3b82f6', opacity: 0.14 },
  { amplitude: 25, frequency: 0.008, speed: 0.32, phase: PHI * 1.5, yOffset: 0.38, color: '#6366f1', opacity: 0.16 },
  { amplitude: 30, frequency: 0.006, speed: 0.26, phase: PHI * 3, yOffset: 0.48, color: '#8b5cf6', opacity: 0.18 },
  { amplitude: 28, frequency: 0.007, speed: 0.3, phase: PHI * 4.5, yOffset: 0.58, color: '#a855f7', opacity: 0.16 },
  { amplitude: 32, frequency: 0.0055, speed: 0.24, phase: PHI * 6, yOffset: 0.68, color: '#d946ef', opacity: 0.17 },
  { amplitude: 24, frequency: 0.0075, speed: 0.34, phase: PHI * 7.5, yOffset: 0.78, color: '#ec4899', opacity: 0.14 },
]

export function InteractiveWaves() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 400 })
  const [paths, setPaths] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  // Use refs for real-time values (no stale closures)
  const mousePosRef = useRef<Point>({ x: 0.5, y: 0.5 })
  const targetPosRef = useRef<Point>({ x: 0.5, y: 0.5 })
  const dimensionsRef = useRef({ width: 1200, height: 400 })
  const timeRef = useRef(0)
  const animationRef = useRef<number>()
  const isTouchDevice = useRef(false)

  // Springs for the gradient glow effect
  const mouseX = useSpring(0.5, { stiffness: 80, damping: 25 })
  const mouseY = useSpring(0.5, { stiffness: 80, damping: 25 })

  // Detect mobile/touch on mount
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const dims = {
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        }
        setDimensions(dims)
        dimensionsRef.current = dims
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Mouse/touch tracking
  useEffect(() => {
    const updatePosition = (clientX: number, clientY: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))

      targetPosRef.current = { x, y }
      mouseX.set(x)
      mouseY.set(y)
    }

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchStart)
    }
  }, [mouseX, mouseY])

  // Generate wave path
  const generateWavePath = (
    config: WaveConfig,
    time: number,
    mousePos: Point,
    dims: { width: number; height: number },
    mobile: boolean
  ): string => {
    const { amplitude, frequency, speed, phase, yOffset } = config
    const { width, height } = dims
    const points: string[] = []
    const baseY = height * yOffset

    const mouseXPixel = mousePos.x * width
    const mouseYPixel = mousePos.y * height

    // Coarser resolution on mobile for performance
    const step = mobile ? 6 : 3

    for (let x = 0; x <= width; x += step) {
      // Base wave motion with harmonics
      let y = baseY + Math.sin(x * frequency + time * speed + phase) * amplitude
      y += Math.sin(x * frequency * PHI + time * speed * 0.7 + phase * 2) * (amplitude * 0.3)

      if (!mobile) {
        // Extra harmonic detail on desktop
        y += Math.sin(x * frequency / PHI + time * speed * 1.3 + phase * 0.5) * (amplitude * 0.2)
      }

      // Mouse/touch ripple effect
      const dx = x - mouseXPixel
      const dy = baseY - mouseYPixel
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = width * (mobile ? 0.6 : 0.5)

      if (distance < maxDistance) {
        const influence = Math.pow(1 - distance / maxDistance, 1.5)
        const rippleStrength = mobile ? 35 : 50
        const ripple = Math.sin(distance * 0.015 - time * 3) * rippleStrength * influence
        y += ripple
      }

      points.push(x === 0 ? `M ${x},${y}` : `L ${x},${y}`)
    }

    return points.join(' ')
  }

  // Animation loop with smooth interpolation
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.016

      // Smoothly interpolate mouse position for fluid animation
      mousePosRef.current.x += (targetPosRef.current.x - mousePosRef.current.x) * 0.1
      mousePosRef.current.y += (targetPosRef.current.y - mousePosRef.current.y) * 0.1

      const configs = isMobile ? MOBILE_WAVE_CONFIGS : WAVE_CONFIGS
      const newPaths = configs.map(config =>
        generateWavePath(
          config,
          timeRef.current,
          mousePosRef.current,
          dimensionsRef.current,
          isMobile
        )
      )
      setPaths(newPaths)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isMobile])

  const activeConfigs = isMobile ? MOBILE_WAVE_CONFIGS : WAVE_CONFIGS

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden touch-none"
    >
      {/* Wave SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          {!isMobile && (
            <filter id="waveGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}

          {activeConfigs.map((config, i) => (
            <linearGradient key={`grad-${i}`} id={`waveGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={config.color} stopOpacity={0} />
              <stop offset="20%" stopColor={config.color} stopOpacity={config.opacity} />
              <stop offset="50%" stopColor={config.color} stopOpacity={config.opacity * 1.2} />
              <stop offset="80%" stopColor={config.color} stopOpacity={config.opacity} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        {/* Render waves */}
        {paths.map((path, i) => (
          <g key={i}>
            {/* Glow layer - desktop only */}
            {!isMobile && (
              <path
                d={path}
                fill="none"
                stroke={activeConfigs[i]?.color}
                strokeWidth="3"
                strokeOpacity={(activeConfigs[i]?.opacity || 0.15) * 0.4}
                filter="url(#waveGlow)"
                strokeLinecap="round"
              />
            )}
            {/* Main wave */}
            <path
              d={path}
              fill="none"
              stroke={`url(#waveGrad-${i})`}
              strokeWidth={isMobile ? '2' : '1.5'}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>

      {/* Floating particles - hidden on mobile for performance */}
      {!isMobile && (
        <FloatingParticles mouseX={mouseX} mouseY={mouseY} dimensions={dimensions} />
      )}
    </div>
  )
}

// Floating particles - desktop only
function FloatingParticles({
  mouseX,
  mouseY,
  dimensions
}: {
  mouseX: ReturnType<typeof useSpring>
  mouseY: ReturnType<typeof useSpring>
  dimensions: { width: number; height: number }
}) {
  const particles = useRef(
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      baseX: Math.random(),
      baseY: 0.25 + Math.random() * 0.5,
      size: 2 + Math.random() * 3,
      speed: 0.3 + Math.random() * 0.4,
      hue: 220 + Math.random() * 120,
    }))
  ).current

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: `hsla(${particle.hue}, 70%, 60%, 0.35)`,
            boxShadow: `0 0 ${particle.size * 2}px hsla(${particle.hue}, 70%, 60%, 0.25)`,
            x: useTransform(mouseX, (mx) => {
              const dx = particle.baseX - mx
              const distance = Math.abs(dx)
              const repel = distance < 0.2 ? dx * 80 : 0
              return particle.baseX * dimensions.width + repel
            }),
            y: useTransform(mouseY, (my) => {
              const dy = particle.baseY - my
              const distance = Math.abs(dy)
              const repel = distance < 0.2 ? dy * 80 : 0
              const float = Math.sin(Date.now() * 0.001 * particle.speed + particle.id) * 10
              return particle.baseY * dimensions.height + repel + float
            }),
          }}
        />
      ))}
    </>
  )
}
