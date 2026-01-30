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

export function About() {
  return (
    <section id="about" className="py-16 md:py-24 bg-surface/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Section header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble mx-auto rounded-full" />
          </div>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground text-center mb-12"
          >
            {siteConfig.about.bio}
          </motion.p>

          {/* Skills grid - 6 items in 2 rows of 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {siteConfig.about.highlights.map((skill, index) => {
              const Icon = iconMap[skill] || Code
              return (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card p-4 flex items-center gap-3"
                >
                  <div className="p-2 rounded-md bg-accent-mid/10">
                    <Icon className="h-5 w-5 text-accent-mid-bright" />
                  </div>
                  <span className="text-sm font-medium">{skill}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
