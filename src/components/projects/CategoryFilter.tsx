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
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      {categories.map((category, index) => (
        <motion.button
          key={category}
          onClick={() => onCategoryChange(category)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 relative overflow-hidden',
            activeCategory === category
              ? 'text-white'
              : 'bg-surface text-muted-foreground hover:text-foreground'
          )}
        >
          {/* Active state background */}
          {activeCategory === category && (
            <motion.div
              layoutId="activeCategory"
              className="absolute inset-0 bg-gradient-to-r from-accent-bass-bright via-accent-mid to-accent-treble-bright rounded-full"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}

          {/* Hover background for inactive buttons */}
          {activeCategory !== category && (
            <div className="absolute inset-0 bg-surface hover:bg-surface-hover rounded-full transition-colors duration-200" />
          )}

          {/* Label */}
          <span className="relative z-10">
            {categoryLabels[category] || category}
          </span>
        </motion.button>
      ))}
    </motion.div>
  )
}
