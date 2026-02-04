import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Github, Key } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { statusLabels, type Project } from '@/config/projects.config'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
}

// Card animation - more visible entrance
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusInfo = statusLabels[project.status]
  const [showAllTech, setShowAllTech] = useState(false)
  const visibleTech = showAllTech ? project.technologies : project.technologies.slice(0, 4)
  const hiddenCount = project.technologies.length - 4

  return (
    <motion.article
      variants={cardVariants}
      className="card p-6 flex flex-col h-full relative overflow-hidden group
                 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-lg
                 will-change-transform"
    >
      {/* Hover glow - pure CSS */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100
                   transition-opacity duration-300 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-bass/8 via-transparent to-accent-treble/8" />
      </div>

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
          <AnimatePresence mode="popLayout">
            {visibleTech.map((tech) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
              >
                <Badge variant="tech">{tech}</Badge>
              </motion.div>
            ))}
          </AnimatePresence>
          {hiddenCount > 0 && !showAllTech && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-accent-mid/20 transition-colors"
              onClick={() => setShowAllTech(true)}
              role="button"
              aria-label={`Show ${hiddenCount} more technologies`}
            >
              +{hiddenCount}
            </Badge>
          )}
          {showAllTech && hiddenCount > 0 && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-accent-mid/20 transition-colors"
              onClick={() => setShowAllTech(false)}
              role="button"
              aria-label="Show fewer technologies"
            >
              −
            </Badge>
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
