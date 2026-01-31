import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

// Optimized easing curve for smooth, professional feel
const easeOutExpo = [0.16, 1, 0.3, 1]

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
    scale: 0.99,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: easeOutExpo,
      // Stagger children if using child animations
      when: 'beforeChildren',
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
        style={{
          // GPU acceleration for smooth transforms
          willChange: 'opacity, transform',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
