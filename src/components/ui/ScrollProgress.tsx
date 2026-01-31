import { motion, useScroll, useSpring, useTransform } from 'framer-motion'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  
  // Smooth spring physics for butter-smooth scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    restDelta: 0.0001,
  })

  // Fade in the progress bar after scrolling starts
  const opacity = useTransform(smoothProgress, [0, 0.02], [0, 1])

  return (
    <motion.div
      className="fixed top-16 left-0 right-0 h-[2px] z-40 origin-left pointer-events-none"
      style={{ 
        scaleX: smoothProgress,
        opacity,
        background: 'linear-gradient(90deg, #3b82f6 0%, #7c3aed 50%, #ec4899 100%)',
        // GPU acceleration
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
    />
  )
}
