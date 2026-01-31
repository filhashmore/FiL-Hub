import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ProjectGrid } from '@/components/projects/ProjectGrid'

export function Projects() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Page scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Smooth the scroll progress
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  // Background parallax effects
  const bgY1 = useTransform(smoothProgress, [0, 1], [0, -100])
  const bgY2 = useTransform(smoothProgress, [0, 1], [0, -200])
  const bgOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.3, 0.5, 0.3])

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-0.5 z-50 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Decorative background elements that respond to scroll */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Floating orb 1 - top left */}
        <motion.div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full"
          style={{
            y: bgY1,
            opacity: bgOpacity,
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          }}
        />

        {/* Floating orb 2 - right side */}
        <motion.div
          className="absolute top-1/4 -right-48 w-[500px] h-[500px] rounded-full"
          style={{
            y: bgY2,
            opacity: bgOpacity,
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
          }}
        />

        {/* Floating orb 3 - bottom */}
        <motion.div
          className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full"
          style={{
            y: useTransform(smoothProgress, [0, 1], [100, -50]),
            opacity: useTransform(smoothProgress, [0, 0.5, 1], [0.2, 0.4, 0.2]),
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.05) 0%, transparent 70%)',
          }}
        />

        {/* Subtle grid lines */}
        <motion.div
          className="absolute inset-0"
          style={{
            opacity: useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.02, 0.04, 0.04, 0.02]),
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          {/* Page header with enhanced animations */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-16"
          >
            {/* Animated title */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
            >
              <motion.span
                className="inline-block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                All{' '}
              </motion.span>
              <motion.span
                className="inline-block gradient-text"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Projects
              </motion.span>
            </motion.h1>

            {/* Animated divider */}
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble mx-auto rounded-full mb-6"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            />

            {/* Animated description */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              A complete collection of tools, apps, and experiments I've built for
              the touring music industry and beyond.
            </motion.p>

            {/* Scroll indicator */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div
                className="inline-flex flex-col items-center text-muted-foreground/50 text-sm"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="mb-2">Scroll to explore</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="opacity-50"
                >
                  <path
                    d="M10 4V16M10 16L5 11M10 16L15 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Projects grid with filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <ProjectGrid showFilter={true} />
          </motion.div>

          {/* Bottom fade and CTA */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-muted-foreground mb-4">
              More projects coming soon. Follow along on GitHub.
            </p>
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-transparent via-accent-mid/50 to-transparent mx-auto rounded-full"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
