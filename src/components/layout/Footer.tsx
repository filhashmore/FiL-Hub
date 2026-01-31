import { motion, useReducedMotion } from 'framer-motion'
import { Github, Mail } from 'lucide-react'
import { siteConfig } from '@/config/site.config'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const shouldReduceMotion = useReducedMotion()

  return (
    <footer className="border-t border-border bg-surface/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-lg font-bold gradient-text">FiL Hub</span>
            <p className="text-sm text-muted-foreground">
              Audio tools & creative tech
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <motion.a
              href={siteConfig.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </motion.a>
            <motion.a
              href={`mailto:${siteConfig.email}`}
              whileHover={shouldReduceMotion ? {} : { scale: 1.1, y: -2 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </motion.a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            {'\u00A9'} {currentYear} CHECK ONE TWO ENTERPRISE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
