import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { categoryLabels } from '@/config/projects.config'

interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <motion.div
      className="flex flex-wrap gap-2 justify-center mb-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative overflow-hidden',
            activeCategory === category
              ? 'text-white'
              : 'bg-surface text-muted-foreground hover:text-foreground hover:bg-surface-hover'
          )}
        >
          {/* Active state background with layout animation */}
          {activeCategory === category && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 bg-gradient-to-r from-accent-bass-bright via-accent-mid to-accent-treble-bright rounded-full -z-0"
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}

          {/* Label */}
          <span className="relative z-10">
            {categoryLabels[category] || category}
          </span>
        </button>
      ))}
    </motion.div>
  )
}
