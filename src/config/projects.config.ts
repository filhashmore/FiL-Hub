export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  category: 'audio-tools' | 'saas' | 'other'
  technologies: string[]
  links: {
    github?: string
    live?: string
  }
  metrics?: {
    label: string
    value: string
  }[]
  featured: boolean
  visible: boolean
  order: number
}

export const projectsConfig: Project[] = [
  {
    id: 'rf-scout',
    title: 'RF Scout',
    description: 'RF frequency coordination tool for touring audio professionals',
    longDescription: 'Real-time spectrum visualization with FCC API integration, automatic IM product avoidance, TV channel exclusion, and export to Shure WWB & Sennheiser WSM formats.',
    category: 'audio-tools',
    technologies: ['React', 'Vite', 'Tailwind', 'Framer Motion', 'FCC API'],
    links: {
      github: 'https://github.com/filhashmore/RF_Scout',
      live: 'https://rf-scout.vercel.app',
    },
    metrics: [
      { label: 'Frequency Range', value: '470-608 MHz' },
      { label: 'Preset Venues', value: '10+' },
    ],
    featured: true,
    visible: true,
    order: 1,
  },
  {
    id: 'setflow',
    title: 'SetFlow',
    description: 'Setlist builder with flow analysis and PDF export',
    longDescription: 'Build setlists with BPM/key metadata, Circle of Fifths key clash detection, energy analysis, and stage-optimized PDF export for low-light environments.',
    category: 'audio-tools',
    technologies: ['React', 'Vite', 'TypeScript', 'Tailwind', 'shadcn/ui'],
    links: {
      github: 'https://github.com/filhashmore/setflow',
      live: 'https://setflow.vercel.app',
    },
    featured: true,
    visible: true,
    order: 2,
  },
  {
    id: 'tour-flow-app',
    title: 'Tour Flow App',
    description: 'Mobile tour management for audio engineers and crew',
    longDescription: 'React Native + Expo app with multi-crew collaboration, tour scheduling, gear inventory, input list management, and AI assistant integration.',
    category: 'saas',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Zustand'],
    links: {
      github: 'https://github.com/filhashmore/tour-flow-app',
    },
    metrics: [
      { label: 'Version', value: 'v1.9.0' },
    ],
    featured: true,
    visible: true,
    order: 3,
  },
  {
    id: 'filmore-advance-portal',
    title: 'Filmore Advance Portal',
    description: 'Self-service venue advance portal for production logistics',
    longDescription: 'Venues access tech riders, stage plots, hospitality riders, and production docs with profile-based content filtering for different show types.',
    category: 'saas',
    technologies: ['React', 'Vite', 'Tailwind', 'Supabase'],
    links: {
      github: 'https://github.com/filhashmore/filmore-advance',
      live: 'https://filmore-advance.vercel.app',
    },
    featured: true,
    visible: true,
    order: 4,
  },
  {
    id: 'tour-advance-portal',
    title: 'Tour Advance Portal',
    description: 'Reusable advance portal template for touring artists',
    longDescription: 'Config-driven, multi-tenant template enabling any production manager to deploy their own venue advance system.',
    category: 'saas',
    technologies: ['React', 'Vite', 'TypeScript', 'Supabase'],
    links: {
      github: 'https://github.com/filhashmore/tour-advance-portal',
    },
    metrics: [
      { label: 'Version', value: 'v2.0.0' },
    ],
    featured: true,
    visible: true,
    order: 5,
  },
  {
    id: 'filmore-gear',
    title: 'Filmore Gear Inventory',
    description: 'Comprehensive gear tracking for touring production',
    longDescription: 'Real-time inventory tracking with consumables management, FLY pack assignments, and role-based acquisition approvals.',
    category: 'other',
    technologies: ['React', 'HTML/CSS', 'localStorage', 'Tailwind'],
    links: {
      github: 'https://github.com/filhashmore/filmore-gear',
      live: 'https://filmore-gear.vercel.app',
    },
    featured: false,
    visible: true,
    order: 6,
  },
  {
    id: 'filmore-epk',
    title: 'Filmore EPK',
    description: 'Electronic Press Kit website for FILMORE',
    longDescription: 'Next.js showcase with Framer Motion animations, discography, video gallery, and social media integration.',
    category: 'other',
    technologies: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind'],
    links: {
      github: 'https://github.com/filhashmore/filmore-bio',
      live: 'https://filmoremusic.vercel.app',
    },
    featured: false,
    visible: true,
    order: 7,
  },
  {
    id: 'filmore-1sheet',
    title: 'Filmore 1-Sheet',
    description: 'Digital press 1-sheet with Spotify analytics',
    longDescription: 'Press kit featuring 481M+ streams, Spotify demographics visualization, and streaming statistics.',
    category: 'other',
    technologies: ['HTML', 'CSS', 'Supabase Analytics'],
    links: {
      github: 'https://github.com/filhashmore/filmore-1sheet',
    },
    featured: false,
    visible: true,
    order: 8,
  },
  {
    id: 'yeehaw',
    title: 'YEEHAW',
    description: 'Promo landing page for FILMORE x Pitbull collab',
    longDescription: 'Minimal landing page with YouTube embed and streaming CTAs.',
    category: 'other',
    technologies: ['HTML', 'CSS'],
    links: {
      github: 'https://github.com/filhashmore/yeehaw',
    },
    featured: false,
    visible: true,
    order: 9,
  },
  {
    id: 'filmore-music',
    title: 'Filmore Music',
    description: 'Future music and artist platform',
    longDescription: 'Repository initialized for potential future development.',
    category: 'other',
    technologies: ['TBD'],
    links: {
      github: 'https://github.com/filhashmore/filmoremusic',
    },
    featured: false,
    visible: false,
    order: 10,
  },
]

export const categoryLabels: Record<string, string> = {
  'all': 'All Projects',
  'audio-tools': 'Audio Tools',
  'saas': 'SaaS',
  'other': 'Other',
}

export const getVisibleProjects = () =>
  projectsConfig.filter((p) => p.visible).sort((a, b) => a.order - b.order)

export const getFeaturedProjects = () =>
  projectsConfig.filter((p) => p.visible && p.featured).sort((a, b) => a.order - b.order)
