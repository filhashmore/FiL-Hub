import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { CategoryFilter } from './CategoryFilter'
import { getVisibleProjects } from '@/config/projects.config'

interface ProjectGridProps {
  showFilter?: boolean
  limit?: number
}

// Container animation - simple fade
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
}

export function ProjectGrid({ showFilter = true, limit }: ProjectGridProps) {
  const [activeCategory, setActiveCategory] = useState('all')
  const allProjects = getVisibleProjects()

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

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filteredProjects.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No projects found in this category.
        </p>
      )}
    </div>
  )
}
