import { useState, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { CategoryFilter } from './CategoryFilter'
import { getVisibleProjects } from '@/config/projects.config'

interface ProjectGridProps {
  showFilter?: boolean
  limit?: number
}

// Optimized easing
const easeOutExpo = [0.16, 1, 0.3, 1]

// Container animation with optimized stagger
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
}

export function ProjectGrid({ showFilter = true, limit }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const allProjects = getVisibleProjects()
  const shouldReduceMotion = useReducedMotion()

  const categories = useMemo(() => {
    const cats = new Set(allProjects.map((p) => p.category))
    return ['all', ...Array.from(cats)]
  }, [allProjects])

  const filteredProjects = useMemo(() => {
    let projects =
      activeCategory === 'all'
        ? allProjects
        : allProjects.filter((p) => p.category === activeCategory)

    if (limit) {
      projects = projects.slice(0, limit)
    }

    return projects
  }, [allProjects, activeCategory, limit])

  return (
    <div>
      {showFilter && (
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      )}

      <LayoutGroup>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory}
            variants={shouldReduceMotion ? {} : containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout={!shouldReduceMotion}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ willChange: 'opacity' }}
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.3, 
                  ease: easeOutExpo,
                  layout: { duration: 0.3, ease: easeOutExpo },
                }}
              >
                <ProjectCard project={project} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </LayoutGroup>

      <AnimatePresence>
        {filteredProjects.length === 0 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
            className="text-center text-muted-foreground py-12"
          >
            No projects found in this category.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
