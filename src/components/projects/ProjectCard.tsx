import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { ExternalLink, Github, Key } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { statusLabels, type Project } from '@/config/projects.config'
import { cn } from '@/lib/utils'

interface ProjectCardProps {
  project: Project
  index: number
}

// Animation presets - each card gets a unique entrance based on position
const getEntranceVariant = (index: number) => {
  const patterns = [
    { x: -30, y: 20, rotate: -2 },   // slide from left
    { x: 0, y: 40, rotate: 0 },      // slide from bottom
    { x: 30, y: 20, rotate: 2 },     // slide from right
    { x: -20, y: 30, rotate: -1 },   // diagonal left
    { x: 0, y: 50, rotate: 0 },      // deep bottom
    { x: 20, y: 30, rotate: 1 },     // diagonal right
  ]
  return patterns[index % patterns.length]
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const statusInfo = statusLabels[project.status]
  const cardRef = useRef<HTMLElement>(null)

  // Parallax effect for card content
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  })

  // Smooth parallax values
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })
  const badgeY = useTransform(smoothProgress, [0, 1], [8, -8])
  const glowOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0, 0.6, 0.6, 0])

  // Get entrance animation based on index
  const entrance = getEntranceVariant(index)

  // Row-based stagger delay (cards in same row animate together-ish)
  const row = Math.floor(index / 3)
  const col = index % 3
  const staggerDelay = row * 0.15 + col * 0.05

  return (
    <motion.article
      ref={cardRef}
      initial={{
        opacity: 0,
        x: entrance.x,
        y: entrance.y,
        rotate: entrance.rotate,
        scale: 0.95
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1
      }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: staggerDelay,
        ease: [0.25, 0.46, 0.45, 0.94] // custom easing for smooth feel
      }}
      whileHover={{
        y: -6,
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="card p-6 flex flex-col h-full relative overflow-hidden group"
    >
      {/* Animated glow effect on scroll */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: glowOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-accent-bass/5 via-accent-mid/5 to-accent-treble/5" />
      </motion.div>

      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-bass/8 via-transparent to-accent-treble/8" />
        <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-accent-bass/20 via-accent-mid/10 to-accent-treble/20 blur-sm" />
      </div>

      <div className="relative z-10">
        {/* Header with Status */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <motion.h3
              className="text-lg font-semibold"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: staggerDelay + 0.1 }}
            >
              {project.title}
            </motion.h3>
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: staggerDelay + 0.2, type: "spring", stiffness: 200 }}
              className={cn(
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border shrink-0',
                statusInfo.color
              )}
            >
              {statusInfo.label}
            </motion.span>
          </div>
          <motion.p
            className="text-sm text-muted-foreground line-clamp-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: staggerDelay + 0.15 }}
          >
            {project.description}
          </motion.p>
        </div>

        {/* Tech stack badges with subtle parallax */}
        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          style={{ y: badgeY }}
        >
          {project.technologies.slice(0, 4).map((tech, techIndex) => (
            <motion.div
              key={tech}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: staggerDelay + 0.2 + techIndex * 0.05,
                duration: 0.3
              }}
            >
              <Badge variant="tech">{tech}</Badge>
            </motion.div>
          ))}
          {project.technologies.length > 4 && (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: staggerDelay + 0.4 }}
            >
              <Badge variant="secondary">+{project.technologies.length - 4}</Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Metrics (if any) */}
        {project.metrics && project.metrics.length > 0 && (
          <motion.div
            className="flex gap-4 mb-4 text-sm"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: staggerDelay + 0.25 }}
          >
            {project.metrics.map((metric) => (
              <div key={metric.label}>
                <span className="text-accent-bass-bright font-semibold">
                  {metric.value}
                </span>{' '}
                <span className="text-muted-foreground">{metric.label}</span>
              </div>
            ))}
          </motion.div>
        )}

        {/* Access Code (if any) */}
        {project.accessCode && (
          <motion.div
            className="flex items-center gap-2 mb-4 px-3 py-2 rounded-md bg-accent-mid/10 border border-accent-mid/20"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: staggerDelay + 0.3 }}
          >
            <Key className="h-4 w-4 text-accent-mid-bright shrink-0" />
            <span className="text-xs text-muted-foreground">Access Code:</span>
            <code className="text-xs font-mono text-accent-mid-bright">
              {project.accessCode}
            </code>
          </motion.div>
        )}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Action buttons */}
      <motion.div
        className="flex gap-2 pt-4 border-t border-border relative z-10"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: staggerDelay + 0.35 }}
      >
        {project.links.github && (
          <Button variant="ghost" size="sm" asChild className="flex-1 group/btn">
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
              Code
            </a>
          </Button>
        )}
        {project.links.live && (
          <Button variant="secondary" size="sm" asChild className="flex-1 group/btn">
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
              Live Demo
            </a>
          </Button>
        )}
      </motion.div>
    </motion.article>
  )
}
