import { motion } from 'framer-motion'
import { ExternalLink, Github } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Project } from '@/config/projects.config'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="card p-6 flex flex-col h-full"
    >
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
      </div>

      {/* Tech stack badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.slice(0, 4).map((tech) => (
          <Badge key={tech} variant="tech">
            {tech}
          </Badge>
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

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <div className="flex gap-2 pt-4 border-t border-border">
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
