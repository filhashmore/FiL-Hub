import { useEffect, useRef, useState, useCallback } from 'react'
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

export function InteractiveWaves() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState<Point>({ x: 0.5, y: 0.5 })
  const [dimensions, setDimensions] = useState({ width: 1200, height: 400 })
  const animationRef = useRef<number>()
  const timeRef = useRef(0)
  const [paths, setPaths] = useState<string[]>([])

  // Smooth mouse tracking with spring physics
  const mouseX = useSpring(0.5, { stiffness: 50, damping: 20 })
  const mouseY = useSpring(0.5, { stiffness: 50, damping: 20 })

  // Wave configurations - Fibonacci-based spacing
  const waveConfigs: WaveConfig[] = [
    { amplitude: 25, frequency: 0.008, speed: 0.4, phase: 0, yOffset: 0.3, color: '#1e40af', opacity: 0.15 },
    { amplitude: 35, frequency: 0.006, speed: 0.3, phase: PHI, yOffset: 0.35, color: '#3b82f6', opacity: 0.12 },
    { amplitude: 30, frequency: 0.007, speed: 0.35, phase: PHI * 2, yOffset: 0.4, color: '#6366f1', opacity: 0.18 },
    { amplitude: 40, frequency: 0.005, speed: 0.25, phase: PHI * 3, yOffset: 0.45, color: '#7c3aed', opacity: 0.15 },
    { amplitude: 28, frequency: 0.009, speed: 0.45, phase: PHI * 4, yOffset: 0.5, color: '#8b5cf6', opacity: 0.12 },
    { amplitude: 45, frequency: 0.004, speed: 0.2, phase: PHI * 5, yOffset: 0.55, color: '#a855f7', opacity: 0.18 },
    { amplitude: 32, frequency: 0.0065, speed: 0.32, phase: PHI * 6, yOffset: 0.6, color: '#c026d3', opacity: 0.14 },
    { amplitude: 38, frequency: 0.0055, speed: 0.28, phase: PHI * 7, yOffset: 0.65, color: '#db2777', opacity: 0.16 },
    { amplitude: 22, frequency: 0.01, speed: 0.5, phase: PHI * 8, yOffset: 0.7, color: '#ec4899', opacity: 0.12 },
  ]

  // Handle mouse movement
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setMousePos({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) })
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        })
      }
    }
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Mouse event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  // Generate wave path with mouse interaction
  const generateWavePath = useCallback((config: WaveConfig, time: number, mousePos: Point) => {
    const { amplitude, frequency, speed, phase, yOffset } = config
    const { width, height } = dimensions
    const points: string[] = []
    const baseY = height * yOffset

    // Calculate mouse influence
    const mouseXPixel = mousePos.x * width
    const mouseYPixel = mousePos.y * height

    for (let x = 0; x <= width; x += 4) {
      // Base wave motion
      let y = baseY + Math.sin(x * frequency + time * speed + phase) * amplitude

      // Add secondary harmonics for organic feel
      y += Math.sin(x * frequency * PHI + time * speed * 0.7 + phase * 2) * (amplitude * 0.3)
      y += Math.sin(x * frequency / PHI + time * speed * 1.3 + phase * 0.5) * (amplitude * 0.2)

      // Mouse ripple effect - creates expanding wave from mouse position
      const dx = x - mouseXPixel
      const dy = baseY - mouseYPixel
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = width * 0.4

      if (distance < maxDistance) {
        const influence = Math.pow(1 - distance / maxDistance, 2)
        const ripple = Math.sin(distance * 0.02 - time * 2) * 40 * influence
        y += ripple
      }

      points.push(x === 0 ? `M ${x},${y}` : `L ${x},${y}`)
    }

    return points.join(' ')
  }, [dimensions])

  // Animation loop
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.016 // ~60fps
      const newPaths = waveConfigs.map(config =>
        generateWavePath(config, timeRef.current, mousePos)
      )
      setPaths(newPaths)
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [generateWavePath, mousePos, waveConfigs])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
      style={{ cursor: 'none' }}
    >
      {/* Subtle radial gradient following mouse */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
          x: useTransform(mouseX, [0, 1], [-400, dimensions.width - 400]),
          y: useTransform(mouseY, [0, 1], [-400, dimensions.height - 400]),
        }}
      />

      {/* Wave SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          {/* Glow filter */}
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Gradient definitions for each wave */}
          {waveConfigs.map((config, i) => (
            <linearGradient key={`grad-${i}`} id={`waveGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={config.color} stopOpacity={config.opacity * 0.5} />
              <stop offset="50%" stopColor={config.color} stopOpacity={config.opacity} />
              <stop offset="100%" stopColor={config.color} stopOpacity={config.opacity * 0.5} />
            </linearGradient>
          ))}
        </defs>

        {/* Render waves */}
        {paths.map((path, i) => (
          <g key={i}>
            {/* Glow layer */}
            <path
              d={path}
              fill="none"
              stroke={waveConfigs[i].color}
              strokeWidth="4"
              strokeOpacity={waveConfigs[i].opacity * 0.5}
              filter="url(#glow)"
              strokeLinecap="round"
            />
            {/* Main wave */}
            <path
              d={path}
              fill="none"
              stroke={`url(#waveGrad-${i})`}
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>

      {/* Floating particles that react to mouse */}
      <FloatingParticles mousePos={mousePos} dimensions={dimensions} />
    </div>
  )
}

// Floating particles component
function FloatingParticles({ mousePos, dimensions }: { mousePos: Point, dimensions: { width: number, height: number } }) {
  const particles = useRef(
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random(),
      y: Math.random(),
      size: 2 + Math.random() * 4,
      speed: 0.2 + Math.random() * 0.5,
      hue: 220 + Math.random() * 120, // Blue to pink range
    }))
  ).current

  return (
    <>
      {particles.map((particle) => {
        const dx = particle.x - mousePos.x
        const dy = particle.y - mousePos.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const repelStrength = Math.max(0, 0.15 - distance) * 2

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: `hsla(${particle.hue}, 70%, 60%, 0.4)`,
              boxShadow: `0 0 ${particle.size * 2}px hsla(${particle.hue}, 70%, 60%, 0.3)`,
            }}
            animate={{
              x: (particle.x + dx * repelStrength) * dimensions.width,
              y: (particle.y + Math.sin(Date.now() * 0.001 * particle.speed + particle.id) * 0.05) * dimensions.height,
            }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 15,
            }}
          />
        )
      })}
    </>
  )
}
