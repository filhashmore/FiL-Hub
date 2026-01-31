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

type DeviceType = 'mobile' | 'tablet' | 'desktop'

// Golden ratio for organic, natural-feeling wave patterns
const PHI = 1.618033988749

// Desktop: 18 fibers - full experience
const DESKTOP_WAVE_CONFIGS: WaveConfig[] = [
  { amplitude: 20, frequency: 0.009, speed: 0.45, phase: 0, yOffset: 0.18, color: '#1e3a8a', opacity: 0.12 },
  { amplitude: 28, frequency: 0.007, speed: 0.38, phase: PHI * 0.5, yOffset: 0.22, color: '#1e40af', opacity: 0.14 },
  { amplitude: 24, frequency: 0.008, speed: 0.42, phase: PHI, yOffset: 0.26, color: '#2563eb', opacity: 0.13 },
  { amplitude: 32, frequency: 0.006, speed: 0.32, phase: PHI * 1.5, yOffset: 0.30, color: '#3b82f6', opacity: 0.15 },
  { amplitude: 26, frequency: 0.0075, speed: 0.36, phase: PHI * 2, yOffset: 0.34, color: '#4f46e5', opacity: 0.12 },
  { amplitude: 35, frequency: 0.0055, speed: 0.28, phase: PHI * 2.5, yOffset: 0.38, color: '#6366f1', opacity: 0.16 },
  { amplitude: 30, frequency: 0.0065, speed: 0.34, phase: PHI * 3, yOffset: 0.42, color: '#7c3aed', opacity: 0.14 },
  { amplitude: 38, frequency: 0.005, speed: 0.26, phase: PHI * 3.5, yOffset: 0.46, color: '#8b5cf6', opacity: 0.17 },
  { amplitude: 28, frequency: 0.007, speed: 0.38, phase: PHI * 4, yOffset: 0.50, color: '#a855f7', opacity: 0.13 },
  { amplitude: 42, frequency: 0.0045, speed: 0.22, phase: PHI * 4.5, yOffset: 0.54, color: '#9333ea', opacity: 0.18 },
  { amplitude: 32, frequency: 0.006, speed: 0.32, phase: PHI * 5, yOffset: 0.58, color: '#a855f7', opacity: 0.14 },
  { amplitude: 36, frequency: 0.0052, speed: 0.28, phase: PHI * 5.5, yOffset: 0.62, color: '#c026d3', opacity: 0.16 },
  { amplitude: 30, frequency: 0.0068, speed: 0.35, phase: PHI * 6, yOffset: 0.66, color: '#d946ef', opacity: 0.13 },
  { amplitude: 40, frequency: 0.0048, speed: 0.24, phase: PHI * 6.5, yOffset: 0.70, color: '#db2777', opacity: 0.17 },
  { amplitude: 26, frequency: 0.0072, speed: 0.4, phase: PHI * 7, yOffset: 0.74, color: '#ec4899', opacity: 0.12 },
  { amplitude: 34, frequency: 0.0058, speed: 0.3, phase: PHI * 7.5, yOffset: 0.78, color: '#f472b6', opacity: 0.15 },
  { amplitude: 22, frequency: 0.008, speed: 0.44, phase: PHI * 8, yOffset: 0.82, color: '#fb7185', opacity: 0.11 },
  { amplitude: 28, frequency: 0.0062, speed: 0.34, phase: PHI * 8.5, yOffset: 0.86, color: '#fda4af', opacity: 0.13 },
]

// Tablet: 10 fibers - balanced experience
const TABLET_WAVE_CONFIGS: WaveConfig[] = [
  { amplitude: 24, frequency: 0.008, speed: 0.4, phase: 0, yOffset: 0.22, color: '#1e40af', opacity: 0.14 },
  { amplitude: 30, frequency: 0.006, speed: 0.32, phase: PHI * 1, yOffset: 0.32, color: '#3b82f6', opacity: 0.16 },
  { amplitude: 34, frequency: 0.0055, speed: 0.28, phase: PHI * 2, yOffset: 0.40, color: '#6366f1', opacity: 0.17 },
  { amplitude: 36, frequency: 0.005, speed: 0.24, phase: PHI * 3, yOffset: 0.48, color: '#8b5cf6', opacity: 0.18 },
  { amplitude: 32, frequency: 0.006, speed: 0.3, phase: PHI * 4, yOffset: 0.56, color: '#a855f7', opacity: 0.16 },
  { amplitude: 38, frequency: 0.0048, speed: 0.22, phase: PHI * 5, yOffset: 0.64, color: '#c026d3', opacity: 0.19 },
  { amplitude: 30, frequency: 0.0065, speed: 0.32, phase: PHI * 6, yOffset: 0.72, color: '#db2777', opacity: 0.15 },
  { amplitude: 26, frequency: 0.007, speed: 0.36, phase: PHI * 7, yOffset: 0.80, color: '#ec4899', opacity: 0.14 },
]

// Mobile: 5 fibers - performance optimized
const MOBILE_WAVE_CONFIGS: WaveConfig[] = [
  { amplitude: 22, frequency: 0.012, speed: 0.35, phase: 0, yOffset: 0.30, color: '#3b82f6', opacity: 0.18 },
  { amplitude: 30, frequency: 0.008, speed: 0.28, phase: PHI * 2, yOffset: 0.45, color: '#8b5cf6', opacity: 0.2 },
  { amplitude: 34, frequency: 0.006, speed: 0.22, phase: PHI * 4, yOffset: 0.58, color: '#a855f7', opacity: 0.22 },
  { amplitude: 28, frequency: 0.009, speed: 0.3, phase: PHI * 6, yOffset: 0.72, color: '#db2777', opacity: 0.18 },
]

function getDeviceConfigs(deviceType: DeviceType): WaveConfig[] {
  switch (deviceType) {
    case 'mobile': return MOBILE_WAVE_CONFIGS
    case 'tablet': return TABLET_WAVE_CONFIGS
    default: return DESKTOP_WAVE_CONFIGS
  }
}

export function InteractiveWaves() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 1200, height: 400 })
  const [paths, setPaths] = useState<string[]>([])
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')

  const mousePosRef = useRef<Point>({ x: 0.5, y: 0.5 })
  const targetPosRef = useRef<Point>({ x: 0.5, y: 0.5 })
  const dimensionsRef = useRef({ width: 1200, height: 400 })
  const timeRef = useRef(0)
  const animationRef = useRef<number>()

  const mouseX = useSpring(0.5, { stiffness: 80, damping: 25 })
  const mouseY = useSpring(0.5, { stiffness: 80, damping: 25 })

  // Detect device type
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      if (width < 640) {
        setDeviceType('mobile')
      } else if (width < 1024) {
        setDeviceType('tablet')
      } else {
        setDeviceType('desktop')
      }
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
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

    const handleMouseMove = (e: MouseEvent) => updatePosition(e.clientX, e.clientY)
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchstart', handleTouchMove as EventListener, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchstart', handleTouchMove as EventListener)
    }
  }, [mouseX, mouseY])

  // Generate wave path
  const generateWavePath = (
    config: WaveConfig,
    time: number,
    mousePos: Point,
    dims: { width: number; height: number },
    device: DeviceType
  ): string => {
    const { amplitude, frequency, speed, phase, yOffset } = config
    const { width, height } = dims
    const points: string[] = []
    const baseY = height * yOffset
    const mouseXPixel = mousePos.x * width
    const mouseYPixel = mousePos.y * height

    // Resolution based on device
    const step = device === 'mobile' ? 8 : device === 'tablet' ? 5 : 3

    for (let x = 0; x <= width; x += step) {
      let y = baseY + Math.sin(x * frequency + time * speed + phase) * amplitude
      y += Math.sin(x * frequency * PHI + time * speed * 0.7 + phase * 2) * (amplitude * 0.3)

      if (device === 'desktop') {
        y += Math.sin(x * frequency / PHI + time * speed * 1.3 + phase * 0.5) * (amplitude * 0.2)
      }

      // Mouse/touch ripple
      const dx = x - mouseXPixel
      const dy = baseY - mouseYPixel
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = width * (device === 'mobile' ? 0.7 : 0.5)

      if (distance < maxDistance) {
        const influence = Math.pow(1 - distance / maxDistance, 1.5)
        const rippleStrength = device === 'mobile' ? 30 : device === 'tablet' ? 40 : 50
        const ripple = Math.sin(distance * 0.015 - time * 3) * rippleStrength * influence
        y += ripple
      }

      points.push(x === 0 ? `M ${x},${y}` : `L ${x},${y}`)
    }

    return points.join(' ')
  }

  // Animation loop
  useEffect(() => {
    const animate = () => {
      timeRef.current += 0.016

      // Smooth interpolation
      const lerpFactor = deviceType === 'mobile' ? 0.08 : 0.1
      mousePosRef.current.x += (targetPosRef.current.x - mousePosRef.current.x) * lerpFactor
      mousePosRef.current.y += (targetPosRef.current.y - mousePosRef.current.y) * lerpFactor

      const configs = getDeviceConfigs(deviceType)
      const newPaths = configs.map(config =>
        generateWavePath(config, timeRef.current, mousePosRef.current, dimensionsRef.current, deviceType)
      )
      setPaths(newPaths)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [deviceType])

  const activeConfigs = getDeviceConfigs(deviceType)
  const showGlow = deviceType === 'desktop'
  const showParticles = deviceType !== 'mobile'

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden touch-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          {showGlow && (
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
              <stop offset="15%" stopColor={config.color} stopOpacity={config.opacity} />
              <stop offset="50%" stopColor={config.color} stopOpacity={config.opacity * 1.3} />
              <stop offset="85%" stopColor={config.color} stopOpacity={config.opacity} />
              <stop offset="100%" stopColor={config.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        {paths.map((path, i) => (
          <g key={i}>
            {showGlow && (
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
            <path
              d={path}
              fill="none"
              stroke={`url(#waveGrad-${i})`}
              strokeWidth={deviceType === 'mobile' ? '2.5' : '1.5'}
              strokeLinecap="round"
            />
          </g>
        ))}
      </svg>

      {showParticles && (
        <FloatingParticles mouseX={mouseX} mouseY={mouseY} dimensions={dimensions} />
      )}
    </div>
  )
}

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
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      baseX: Math.random(),
      baseY: 0.2 + Math.random() * 0.6,
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
              const repel = distance < 0.2 ? dx * 60 : 0
              return particle.baseX * dimensions.width + repel
            }),
            y: useTransform(mouseY, (my) => {
              const dy = particle.baseY - my
              const distance = Math.abs(dy)
              const repel = distance < 0.2 ? dy * 60 : 0
              const float = Math.sin(Date.now() * 0.001 * particle.speed + particle.id) * 8
              return particle.baseY * dimensions.height + repel + float
            }),
          }}
        />
      ))}
    </>
  )
}
