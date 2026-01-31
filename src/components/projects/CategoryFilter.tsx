import { motion, useReducedMotion } from 'framer-motion'
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
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            'relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200',
            activeCategory === category
              ? 'text-white'
              : 'bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground'
          )}
        >
          {/* Animated background for active state */}
          {activeCategory === category && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 rounded-full bg-gradient-to-r from-accent-bass-bright via-accent-mid to-accent-treble-bright"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ zIndex: -1 }}
            />
          )}
          <span className="relative z-10">{categoryLabels[category] || category}</span>
        </motion.button>
      ))}
    </div>
  )
}
