import { motion, useReducedMotion, useInView } from 'framer-motion'
import { Mail, Github, ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/config/site.config'

// Optimized easing
const easeOutExpo = [0.16, 1, 0.3, 1]

export function Contact() {
  const shouldReduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="contact" ref={sectionRef} className="py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Section header */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">{"Let's Connect"}</h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
            className="w-16 h-1 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble mx-auto rounded-full mb-8 origin-center"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-lg text-muted-foreground mb-8 text-pretty"
          >
            Interested in collaborating on audio tools, creative tech, or touring production solutions?
            {"I'm always open to discussing new projects and opportunities."}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.4, ease: easeOutExpo }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Button size="lg" asChild>
                <a href={`mailto:${siteConfig.email}`}>
                  <Mail className="h-4 w-4" />
                  Get in Touch
                  <motion.span
                    initial={{ x: 0 }}
                    whileHover={{ x: 3 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </a>
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
                  View Projects
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Additional info */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-sm text-muted-foreground mt-8"
          >
            Based in Nashville, TN • Available for freelance & collaboration
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
