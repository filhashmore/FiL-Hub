import { motion } from 'framer-motion'
import { Mail, Github, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { siteConfig } from '@/config/site.config'

export function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Section header */}
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble mx-auto rounded-full mb-8" />

          <p className="text-lg text-muted-foreground mb-8">
            Interested in collaborating on audio tools, creative tech, or touring production solutions?
            I'm always open to discussing new projects and opportunities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <a href={`mailto:${siteConfig.email}`}>
                <Mail className="h-4 w-4" />
                Get in Touch
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
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
          </div>

          {/* Additional info */}
          <p className="text-sm text-muted-foreground mt-8">
            Based in Nashville, TN • Available for freelance & collaboration
          </p>
        </motion.div>
      </div>
    </section>
  )
}
