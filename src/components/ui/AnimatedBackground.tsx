import { motion } from 'framer-motion'
import { InteractiveWaves } from './InteractiveWaves'

export function AnimatedBackground() {
  const bars = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle gradient orbs for depth */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-bass/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-accent-treble/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent-mid/5 rounded-full blur-3xl pointer-events-none" />

      {/* Interactive wave fibers */}
      <InteractiveWaves />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80 pointer-events-none" />

      {/* Animated spectrum bars at bottom */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-[3px] h-40 opacity-25 pointer-events-none">
        {bars.map((i) => {
          // Fibonacci-influenced heights for organic feel
          const baseHeight = 15 + (Math.sin(i * 0.5) * 10)
          const maxHeight = 40 + (Math.cos(i * 0.3) * 25)

          return (
            <motion.div
              key={i}
              className="w-[3px] bg-gradient-to-t from-accent-bass via-accent-mid to-accent-treble rounded-full"
              initial={{ height: `${baseHeight}%` }}
              animate={{
                height: [
                  `${baseHeight}%`,
                  `${maxHeight}%`,
                  `${baseHeight + 10}%`,
                  `${maxHeight - 10}%`,
                  `${baseHeight}%`
                ],
              }}
              transition={{
                duration: 2 + Math.random() * 1.5,
                repeat: Infinity,
                delay: i * 0.08,
                ease: 'easeInOut',
              }}
            />
          )
        })}
      </div>

      {/* Bottom fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none" />
    </div>
  )
}
