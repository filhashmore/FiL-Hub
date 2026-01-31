import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLink, Github, Key } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { statusLabels, type Project } from '@/config/projects.config'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  index?: number
}

// Optimized easing
const easeOutExpo = [0.16, 1, 0.3, 1]

// Card animation variants
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: easeOutExpo,
      delay: index * 0.05,
    },
  }),
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const statusInfo = statusLabels[project.status]
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.article
      variants={shouldReduceMotion ? {} : cardVariants}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={shouldReduceMotion ? {} : { y: -4, transition: { duration: 0.2, ease: easeOutExpo } }}
      className="card p-6 flex flex-col h-full relative overflow-hidden group
                 hover:shadow-lg hover:shadow-accent-mid/5"
      style={{ 
        willChange: 'transform',
        transform: 'translateZ(0)',
      }}
    >
      {/* Hover glow - optimized with GPU acceleration */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-bass/8 via-transparent to-accent-treble/8" />
      </motion.div>

      <div className="relative z-10">
        {/* Header with Status */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <span
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0',
                statusInfo.color
              )}
            >
              {statusInfo.label}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Tech stack badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="tech">{tech}</Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="secondary">+{project.technologies.length - 4}</Badge>
          )}
        </div>

        {/* Metrics (if any) */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="flex gap-4 mb-4 text-sm">
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <span className="text-accent-bass-bright font-semibold">
                  {metric.value}
                </span>{' '}
                <span className="text-muted-foreground">{metric.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Access Code (if any) */}
        {project.accessCode && (
          <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-md bg-accent-mid/10 border border-accent-mid/20">
            <Key className="h-4 w-4 text-accent-mid-bright shrink-0" />
            <span className="text-xs text-muted-foreground">Access Code:</span>
            <code className="text-xs font-mono text-accent-mid-bright">
              {project.accessCode}
            </code>
          </div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex gap-2 pt-4 border-t border-border relative z-10">
        {project.links.github && (
          <Button variant="ghost" size="sm" asChild className="flex-1">
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4" />
              Code
            </a>
          </Button>
        )}
        {project.links.live && (
          <Button variant="secondary" size="sm" asChild className="flex-1">
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Live Demo
            </a>
          </Button>
        )}
      </div>
    </motion.article>
  )
}
