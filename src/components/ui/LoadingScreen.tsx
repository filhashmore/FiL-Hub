import { motion } from 'framer-motion'

// Smooth loading animation with audio-inspired visuals
export function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Animated waveform bars */}
        <div className="flex items-end gap-1 h-12">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 bg-gradient-to-t from-accent-bass-bright via-accent-mid to-accent-treble rounded-full"
              initial={{ height: 8 }}
              animate={{ 
                height: [8, 32 + Math.random() * 16, 8],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: [0.4, 0, 0.6, 1],
              }}
            />
          ))}
        </div>
        
        {/* Brand text */}
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-bold gradient-text"
        >
          FiL Hub
        </motion.span>
      </div>
    </motion.div>
  )
}

// Skeleton components for content loading
export function ProjectCardSkeleton() {
  return (
    <div className="card p-6 h-[280px]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="skeleton h-6 w-3/4 rounded" />
          <div className="skeleton h-5 w-16 rounded-full" />
        </div>
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="flex gap-2 mt-4">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
          <div className="skeleton h-6 w-14 rounded-full" />
        </div>
      </div>
      <div className="absolute bottom-6 left-6 right-6 flex gap-2">
        <div className="skeleton h-9 flex-1 rounded-md" />
        <div className="skeleton h-9 flex-1 rounded-md" />
      </div>
    </div>
  )
}

export function HeroSkeleton() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-3xl w-full space-y-6 text-center">
        <div className="skeleton h-4 w-32 mx-auto rounded" />
        <div className="skeleton h-12 w-full rounded" />
        <div className="skeleton h-12 w-3/4 mx-auto rounded" />
        <div className="skeleton h-6 w-2/3 mx-auto rounded" />
        <div className="flex justify-center gap-4 pt-4">
          <div className="skeleton h-11 w-36 rounded-md" />
          <div className="skeleton h-11 w-36 rounded-md" />
        </div>
      </div>
    </div>
  )
}
