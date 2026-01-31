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
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            activeCategory === category
              ? 'bg-gradient-to-r from-accent-bass-bright via-accent-mid to-accent-treble-bright text-white'
              : 'bg-surface text-muted-foreground hover:bg-surface-hover hover:text-foreground'
          )}
        >
          {categoryLabels[category] || category}
        </button>
      ))}
    </div>
  )
}
