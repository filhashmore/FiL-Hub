import { motion } from 'framer-motion'
import { Code, Music, Wrench, Smartphone, Cloud, Database } from 'lucide-react'
import { siteConfig } from '@/config/site.config'

const iconMap: Record<string, React.ElementType> = {
  'Full-stack web & mobile development': Code,
  'React, React Native, TypeScript': Smartphone,
  'Audio/RF engineering expertise': Music,
  'Touring production workflow optimization': Wrench,
  'Config-driven, offline-first architecture': Cloud,
  'Supabase & serverless backends': Database,
}

// Simple container with stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
}

// Card animation - simple fade up
const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-surface/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble mx-auto rounded-full" />
          </div>

          {/* Bio */}
          <p className="text-lg text-muted-foreground text-center mb-12">
            {siteConfig.about.bio}
          </p>

          {/* Skills grid with staggered animation */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {siteConfig.about.highlights.map((skill) => {
              const Icon = iconMap[skill] || Code
              return (
                <motion.div
                  key={skill}
                  variants={cardVariants}
                  className="card p-4 flex items-center gap-3 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="p-2 rounded-md bg-accent-mid/10">
                    <Icon className="h-5 w-5 text-accent-mid-bright" />
                  </div>
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
