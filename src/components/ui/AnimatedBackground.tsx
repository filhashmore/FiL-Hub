import { InteractiveWaves } from './InteractiveWaves'
import { SpectrumAnalyzer } from './SpectrumAnalyzer'

export function AnimatedBackground() {
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

      {/* Reactive spectrum analyzer */}
      <SpectrumAnalyzer />

      {/* Bottom fade to background */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background via-background/70 to-transparent pointer-events-none" />
    </div>
  )
}
