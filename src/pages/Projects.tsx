import { motion, useScroll, useSpring } from 'framer-motion'
import { ProjectGrid } from '@/components/projects/ProjectGrid'

export function Projects() {
  // Scroll progress for the progress bar only
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <div className="relative min-h-screen">
      {/* Scroll progress bar - positioned below header */}
      <motion.div
        className="fixed top-16 left-0 right-0 h-0.5 z-40 origin-left
                   bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble"
        style={{ scaleX: smoothProgress }}
      />

      {/* Simple static background - no scroll-linked animations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        {/* Gradient orbs - static, no animation */}
        <div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/3 -right-32 w-[400px] h-[400px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/4 w-[350px] h-[350px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Subtle grid - static */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="py-16 md:py-24 relative">
        <div className="container mx-auto px-4">
          {/* Page header - simple fade in */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              All <span className="gradient-text">Projects</span>
            </h1>

            <div className="w-24 h-1 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble mx-auto rounded-full mb-6" />

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              A complete collection of tools, apps, and experiments I've built for
              the touring music industry and beyond.
            </p>
          </motion.div>

          {/* Projects grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <ProjectGrid showFilter={true} />
          </motion.div>

          {/* Bottom section */}
          <div className="mt-20 text-center">
            <p className="text-muted-foreground mb-4">
              More projects coming soon. Follow along on GitHub.
            </p>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-accent-mid/40 to-transparent mx-auto rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
