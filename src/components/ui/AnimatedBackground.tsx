import { motion } from 'framer-motion'

export function AnimatedBackground() {
  const bars = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />

      {/* Animated spectrum bars */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-1 h-32 opacity-20">
        {bars.map((i) => (
          <motion.div
            key={i}
            className="w-1 bg-gradient-to-t from-accent-bass via-accent-mid to-accent-treble rounded-full"
            initial={{ height: '20%' }}
            animate={{
              height: ['20%', `${30 + Math.random() * 50}%`, '20%'],
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Infinity,
              delay: i * 0.05,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Waveform SVG */}
      <svg
        className="absolute top-1/3 left-0 w-full h-32 opacity-10"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
        <motion.path
          d="M0,50 Q150,80 300,50 T600,50 T900,50 T1200,50"
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeInOut' }}
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  )
}
