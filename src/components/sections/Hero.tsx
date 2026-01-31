import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Github } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { AnimatedBackground } from '@/components/ui/AnimatedBackground'
import { siteConfig } from '@/config/site.config'

// Optimized easing curves
const easeOutExpo = [0.16, 1, 0.3, 1]

// Container variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easeOutExpo,
    },
  },
}

export function Hero() {
  const shouldReduceMotion = useReducedMotion()

  // Simplified variants for reduced motion
  const getVariants = (variants: typeof itemVariants) => 
    shouldReduceMotion ? { hidden: { opacity: 0 }, visible: { opacity: 1 } } : variants

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <AnimatedBackground />

      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto text-center"
        >
          {/* Pre-headline */}
          <motion.p
            variants={getVariants(itemVariants)}
            className="text-accent-mid-bright text-sm font-medium tracking-wide uppercase mb-4"
          >
            Developer Portfolio
          </motion.p>

          {/* Main headline with word-by-word reveal */}
          <motion.h1
            variants={getVariants(itemVariants)}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-balance"
          >
            {siteConfig.hero.headline.split(' ').map((word, i) => (
              <motion.span
                key={i}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.3 + i * 0.05,
                  duration: 0.4,
                  ease: easeOutExpo,
                }}
                className={`inline-block ${
                  word === 'audio' || word === 'creative' || word === 'resonate'
                    ? 'gradient-text'
                    : ''
                }`}
                style={{ willChange: 'opacity, transform' }}
              >
                {word}&nbsp;
              </motion.span>
            ))}
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={getVariants(itemVariants)}
            className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty"
          >
            {siteConfig.hero.subheadline}
          </motion.p>

          {/* CTA Buttons with hover effects */}
          <motion.div
            variants={getVariants(itemVariants)}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Button asChild size="lg">
                <Link to={siteConfig.hero.cta.href}>
                  {siteConfig.hero.cta.text}
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Button variant="outline" size="lg" asChild>
                <a
                  href={siteConfig.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  View GitHub
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  )
}
