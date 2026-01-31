import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ProjectGrid } from '@/components/projects/ProjectGrid'

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Mark page as loaded after initial render
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  // Page scroll progress for background effects
  const { scrollYProgress } = useScroll()

  // Smooth spring for scroll-linked animations
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    restDelta: 0.001
  })

  // Background parallax transforms
  const bgY1 = useTransform(smoothScroll, [0, 1], ['0%', '-15%'])
  const bgY2 = useTransform(smoothScroll, [0, 1], ['0%', '-25%'])
  const bgY3 = useTransform(smoothScroll, [0, 1], ['0%', '-10%'])
  const gridOpacity = useTransform(smoothScroll, [0, 0.3, 0.7, 1], [0.015, 0.03, 0.03, 0.015])

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-50 origin-left"
        style={{
          scaleX: smoothScroll,
          background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)'
        }}
      />

      {/* Subtle scroll-responsive background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Floating gradient orb - top left (bass color) */}
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-30"
          style={{
            y: bgY1,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          }}
        />

        {/* Floating gradient orb - right side (mid color) */}
        <motion.div
          className="absolute top-1/4 -right-32 w-[400px] h-[400px] rounded-full opacity-25"
          style={{
            y: bgY2,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Floating gradient orb - bottom (treble color) */}
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full opacity-20"
          style={{
            y: bgY3,
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Subtle animated grid that responds to scroll */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: gridOpacity,
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />

        {/* Depth gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background/60" />
      </div>

      <div className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          {/* Page header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-16"
          >
            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              All <span className="gradient-text">Projects</span>
            </motion.h1>

            {/* Divider */}
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble mx-auto rounded-full mb-6"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              A complete collection of tools, apps, and experiments I've built for
              the touring music industry and beyond.
            </motion.p>
          </motion.div>

          {/* Projects grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <ProjectGrid showFilter={true} />
          </motion.div>

          {/* Bottom section */}
          <motion.div
            className="mt-20 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <p className="text-muted-foreground mb-4">
              More projects coming soon. Follow along on GitHub.
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-accent-mid/40 to-transparent mx-auto rounded-full" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
