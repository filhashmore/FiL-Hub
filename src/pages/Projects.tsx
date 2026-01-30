import { motion } from 'framer-motion'
import { ProjectGrid } from '@/components/projects/ProjectGrid'

export function Projects() {
  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Page header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">All Projects</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-accent-bass via-accent-mid to-accent-treble mx-auto rounded-full mb-4" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete collection of tools, apps, and experiments I've built for
            the touring music industry and beyond.
          </p>
        </motion.div>

        {/* Projects grid with filter */}
        <ProjectGrid showFilter={true} />
      </div>
    </div>
  )
}
