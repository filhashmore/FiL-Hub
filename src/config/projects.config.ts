export type ProjectStatus = 'active' | 'beta' | 'in-development' | 'paused' | 'unreleased'

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  category: 'audio-tools' | 'saas' | 'other'
  technologies: string[]
  status: ProjectStatus
  links: {
    github?: string
    live?: string
  }
  accessCode?: string
  metrics?: {
    label: string
    value: string
  }[]
  featured: boolean
  visible: boolean
  order: number
}

export const statusLabels: Record<ProjectStatus, { label: string; color: string }> = {
  'active': { label: 'Active', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  'beta': { label: 'Beta', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  'in-development': { label: 'In Development', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  'paused': { label: 'Paused', color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  'unreleased': { label: 'Unreleased', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
}

export const projectsConfig: Project[] = [
  {
    id: 'rf-scout',
    title: 'RF Scout',
    description: 'RF frequency coordination tool for touring audio professionals',
    longDescription: 'Real-time spectrum visualization with FCC API integration, automatic IM product avoidance, TV channel exclusion, and export to Shure WWB & Sennheiser WSM formats.',
    category: 'audio-tools',
    status: 'beta',
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
    status: 'beta',
    technologies: ['React', 'Vite', 'TypeScript', 'Tailwind', 'shadcn/ui'],
    links: {
      github: 'https://github.com/filhashmore/setflow',
      live: 'https://setflow-beryl.vercel.app',
    },
    featured: true,
    visible: true,
    order: 2,
  },
  {
    id: 'filmore-advance-portal',
    title: 'Filmore Advance Portal',
    description: 'Self-service venue advance portal for production logistics',
    longDescription: 'Venues access tech riders, stage plots, hospitality riders, and production docs with profile-based content filtering for different show types.',
    category: 'saas',
    status: 'beta',
    technologies: ['React', 'Vite', 'Tailwind', 'Supabase'],
    links: {
      github: 'https://github.com/filhashmore/filmore-advance',
      live: 'https://filmore-advance.vercel.app',
    },
    accessCode: 'DEMO or FLY1',
    featured: true,
    visible: true,
    order: 3,
  },
  {
    id: 'tour-advance-portal',
    title: 'Tour Advance Portal',
    description: 'Reusable advance portal template for touring artists',
    longDescription: 'Config-driven, multi-tenant template enabling any production manager to deploy their own venue advance system.',
    category: 'saas',
    status: 'in-development',
    technologies: ['React', 'Vite', 'TypeScript', 'Supabase'],
    links: {
      github: 'https://github.com/filhashmore/tour-advance-portal',
      live: 'https://tour-advance-portal.vercel.app',
    },
    featured: true,
    visible: true,
    order: 4,
  },
  {
    id: 'filmore-gear',
    title: 'Filmore Gear Inventory',
    description: 'Comprehensive gear tracking for touring production',
    longDescription: 'Real-time inventory tracking with consumables management, FLY pack assignments, and role-based acquisition approvals.',
    category: 'saas',
    status: 'beta',
    technologies: ['React', 'HTML/CSS', 'localStorage', 'Tailwind'],
    links: {
      github: 'https://github.com/filhashmore/filmore-gear',
      live: 'https://filmore-gear.vercel.app',
    },
    accessCode: 'DEMO4',
    featured: true,
    visible: true,
    order: 5,
  },
  {
    id: 'filmore-1sheet',
    title: 'Filmore 1-Sheet',
    description: 'Digital press 1-sheet with Spotify analytics',
    longDescription: 'Press kit featuring 481M+ streams, Spotify demographics visualization, and streaming statistics.',
    category: 'other',
    status: 'active',
    technologies: ['HTML', 'CSS', 'Supabase Analytics'],
    links: {
      github: 'https://github.com/filhashmore/filmore-1sheet',
      live: 'https://filmore-1sheet.vercel.app',
    },
    featured: true,
    visible: true,
    order: 6,
  },
  {
    id: 'tour-flow-app',
    title: 'Tour Flow App',
    description: 'Mobile tour management for audio engineers and crew',
    longDescription: 'React Native + Expo app with multi-crew collaboration, tour scheduling, gear inventory, input list management, and AI assistant integration.',
    category: 'saas',
    status: 'paused',
    technologies: ['React Native', 'Expo', 'TypeScript', 'Supabase', 'Zustand'],
    links: {
      github: 'https://github.com/filhashmore/tour-flow-app',
    },
    featured: false,
    visible: true,
    order: 7,
  },
  {
    id: 'filmore-bio',
    title: 'Filmore Bio',
    description: 'Artist biography website for FILMORE',
    longDescription: 'Next.js artist bio site with Framer Motion animations, tour dates, video gallery, and social media integration.',
    category: 'other',
    status: 'active',
    technologies: ['Next.js', 'TypeScript', 'Framer Motion', 'Tailwind'],
    links: {
      github: 'https://github.com/filhashmore/filmore-bio',
      live: 'https://filmore-bio.vercel.app',
    },
    featured: false,
    visible: true,
    order: 8,
  },
  {
    id: 'deej-gala-music',
    title: 'Deej Gala Music',
    description: 'Music artist website for DEEJ GALA',
    longDescription: 'Cyberpunk-styled artist showcase with hero parallax, discography, gallery, and social links.',
    category: 'other',
    status: 'active',
    technologies: ['React', 'Vite', 'TypeScript', 'Tailwind', 'Framer Motion'],
    links: {
      github: 'https://github.com/filhashmore/DeejGalaMusic',
      live: 'https://deej-gala-music.vercel.app',
    },
    featured: false,
    visible: true,
    order: 9,
  },
  {
    id: 'ddr-healthandfitness',
    title: 'DDR Health & Fitness',
    description: 'Personal trainer website for David D. Rogers',
    longDescription: 'Nashville-based personal trainer site with scroll animations, service packages, and contact integration.',
    category: 'other',
    status: 'active',
    technologies: ['React', 'Vite', 'TypeScript', 'Tailwind', 'Framer Motion'],
    links: {
      github: 'https://github.com/filhashmore/ddr-healthandfitness',
      live: 'https://ddr-healthandfitness.vercel.app',
    },
    featured: false,
    visible: true,
    order: 10,
  },
  {
    id: 'yeehaw',
    title: 'YEEHAW',
    description: 'Promo landing page for FILMORE x Pitbull collab',
    longDescription: 'Minimal landing page with YouTube embed and streaming CTAs.',
    category: 'other',
    status: 'active',
    technologies: ['HTML', 'CSS'],
    links: {
      github: 'https://github.com/filhashmore/yeehaw',
      live: 'https://yeehaw-beta.vercel.app',
    },
    featured: false,
    visible: true,
    order: 11,
  },
  {
    id: 'filmore-music',
    title: 'Filmore Music',
    description: 'Future music and artist platform',
    longDescription: 'Repository initialized for potential future development.',
    category: 'other',
    status: 'unreleased',
    technologies: ['TBD'],
    links: {
      github: 'https://github.com/filhashmore/filmoremusic',
    },
    featured: false,
    visible: false,
    order: 12,
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
