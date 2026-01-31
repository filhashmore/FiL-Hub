import { useEffect, useRef, useCallback, useState } from 'react'

type DeviceType = 'mobile' | 'tablet' | 'desktop'

const PHI = 1.618033988749

// Device-specific configurations
const DEVICE_CONFIGS = {
  mobile: {
    barCount: 24,
    attackSpeed: 0.4,
    decayRate: 0.9,
    minimumHeight: 2,
    smoothing: 0.12,
    maxHeight: 60,
    heightClass: 'h-20',
  },
  tablet: {
    barCount: 36,
    attackSpeed: 0.38,
    decayRate: 0.91,
    minimumHeight: 2,
    smoothing: 0.14,
    maxHeight: 75,
    heightClass: 'h-24',
  },
  desktop: {
    barCount: 48,
    attackSpeed: 0.35,
    decayRate: 0.92,
    minimumHeight: 2,
    smoothing: 0.15,
    maxHeight: 90,
    heightClass: 'h-28',
  },
}

// Generate frequency-like distribution (more energy in lows/mids)
function getFrequencyWeight(index: number, total: number): number {
  const normalized = index / total
  return Math.pow(1 - normalized, 0.4)
}

export function SpectrumAnalyzer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop')

  // Get current config
  const config = DEVICE_CONFIGS[deviceType]

  // Refs for animation state - initialized with current config
  const currentHeightsRef = useRef<number[]>([])
  const targetHeightsRef = useRef<number[]>([])
  const peakHeightsRef = useRef<number[]>([])
  const peakDecayRef = useRef<number[]>([])
  const mousePosRef = useRef({ x: 0.5, y: 0.5 })
  const timeRef = useRef(0)
  const animationRef = useRef<number>()
  const lastInteractionRef = useRef(0)

  // Initialize/reset arrays when bar count changes
  useEffect(() => {
    const barCount = config.barCount
    currentHeightsRef.current = Array(barCount).fill(config.minimumHeight)
    targetHeightsRef.current = Array(barCount).fill(config.minimumHeight)
    peakHeightsRef.current = Array(barCount).fill(config.minimumHeight)
    peakDecayRef.current = Array(barCount).fill(0)
  }, [config.barCount, config.minimumHeight])

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
  const calculateTargets = useCallback(() => {
    const barCount = config.barCount
    const mouseX = mousePosRef.current.x
    const time = timeRef.current
    const timeSinceInteraction = Date.now() - lastInteractionRef.current
    const interactionStrength = Math.max(0, 1 - timeSinceInteraction / 1500)

    for (let i = 0; i < barCount; i++) {
      const normalizedIndex = i / barCount
      const freqWeight = getFrequencyWeight(i, barCount)

      // Ambient base animation (always present, subtle)
      let target = config.minimumHeight
      target += 3 + Math.sin(time * 0.4 + i * 0.15) * 2
      target += Math.sin(time * 0.7 + i * PHI * 0.08) * 3
      target += Math.sin(time * 1.2 + i * 0.25) * 1.5

      // Mouse interaction response
      if (interactionStrength > 0) {
        const distance = Math.abs(normalizedIndex - mouseX)
        const spread = deviceType === 'mobile' ? 0.15 : 0.12

        // Primary response - gaussian curve
        const primaryStrength = deviceType === 'mobile' ? 45 : 55
        const primary = Math.exp(-Math.pow(distance / spread, 2)) * primaryStrength * freqWeight

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
      const maxHeight = 8 + freqWeight * config.maxHeight
      targetHeightsRef.current[i] = Math.min(Math.max(target, config.minimumHeight), maxHeight)
    }
  }, [config, deviceType])

  // Apply smooth attack/decay physics
  const applyPhysics = useCallback(() => {
    const barCount = config.barCount
    const current = currentHeightsRef.current
    const target = targetHeightsRef.current
    const peaks = peakHeightsRef.current
    const peakDecay = peakDecayRef.current

    for (let i = 0; i < barCount; i++) {
      const targetVal = target[i]
      let currentVal = current[i]

      if (targetVal > currentVal) {
        // Attack: fast rise toward target
        currentVal += (targetVal - currentVal) * config.attackSpeed
      } else {
        // Release: exponential decay
        currentVal = config.minimumHeight + (currentVal - config.minimumHeight) * config.decayRate
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
    for (let i = 1; i < barCount - 1; i++) {
      smoothed[i] = current[i] * (1 - config.smoothing) +
        (current[i - 1] + current[i + 1]) * (config.smoothing / 2)
    }
    currentHeightsRef.current = smoothed
  }, [config])

  // Render to canvas for better performance
  const render = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const barCount = config.barCount
    const dpr = window.devicePixelRatio || 1
    const width = canvas.width / dpr
    const height = canvas.height / dpr
    const gap = deviceType === 'mobile' ? 1.5 : 2
    const barWidth = (width - (barCount - 1) * gap) / barCount

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(dpr, dpr)

    const current = currentHeightsRef.current
    const peaks = peakHeightsRef.current

    for (let i = 0; i < barCount; i++) {
      const barHeight = (current[i] / 100) * height
      const peakHeight = (peaks[i] / 100) * height
      const x = i * (barWidth + gap)
      const y = height - barHeight

      // Color based on frequency position
      const hue = 220 + (i / barCount) * 110
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
      const radius = Math.min(barWidth / 2, deviceType === 'mobile' ? 2 : 3)
      ctx.roundRect(x, y, barWidth, barHeight, [radius, radius, 0, 0])
      ctx.fill()

      // Glow effect for active bars (reduced on mobile for performance)
      const glowThreshold = deviceType === 'mobile' ? 40 : 30
      if (current[i] > glowThreshold) {
        ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.6)`
        ctx.shadowBlur = current[i] / (deviceType === 'mobile' ? 12 : 8)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Peak indicator
      if (peaks[i] > current[i] + 2) {
        const peakY = height - peakHeight
        ctx.fillStyle = `hsla(${hue + 20}, 90%, 70%, 0.8)`
        ctx.fillRect(x, peakY, barWidth, deviceType === 'mobile' ? 1.5 : 2)
      }
    }

    ctx.restore()
  }, [config.barCount, deviceType])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    const updateSize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    const animate = () => {
      timeRef.current += 0.016
      calculateTargets()
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
      className={`absolute bottom-0 left-0 right-0 ${config.heightClass} pointer-events-none`}
      style={{ width: '100%' }}
    />
  )
}
