import { motion, useReducedMotion, useInView } from 'framer-motion'
import { Code, Music, Wrench, Smartphone, Cloud, Database } from 'lucide-react'
import { useRef } from 'react'
import { siteConfig } from '@/config/site.config'

const iconMap: Record<string, React.ElementType> = {
  'Full-stack web & mobile development': Code,
  'React, React Native, TypeScript': Smartphone,
  'Audio/RF engineering expertise': Music,
  'Touring production workflow optimization': Wrench,
  'Config-driven, offline-first architecture': Cloud,
  'Supabase & serverless backends': Database,
}

// Optimized easing
const easeOutExpo = [0.16, 1, 0.3, 1]

// Container with stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
}

// Card animation
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: easeOutExpo,
    },
  },
}

export function About() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-16 md:py-24 bg-surface/30 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">About Me</h2>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
              className="w-16 h-1 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble mx-auto rounded-full origin-center"
            />
          </div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-muted-foreground text-center mb-12 text-pretty"
          >
            {siteConfig.about.bio}
          </motion.p>

          {/* Skills grid with staggered animation */}
          <motion.div
            variants={shouldReduceMotion ? {} : containerVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {siteConfig.about.highlights.map((skill, index) => {
              const Icon = iconMap[skill] || Code
              return (
                <motion.div
                  key={skill}
                  variants={shouldReduceMotion ? {} : cardVariants}
                  whileHover={shouldReduceMotion ? {} : { 
                    y: -2, 
                    transition: { duration: 0.2, ease: easeOutExpo } 
                  }}
                  className="card p-4 flex items-center gap-3"
                  style={{ willChange: 'transform' }}
                >
                  <motion.div 
                    className="p-2 rounded-md bg-accent-mid/10"
                    whileHover={shouldReduceMotion ? {} : { 
                      scale: 1.05,
                      backgroundColor: 'rgba(124, 58, 237, 0.15)',
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="h-5 w-5 text-accent-mid-bright" />
                  </motion.div>
                  <span className="text-sm font-medium">{skill}</span>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
