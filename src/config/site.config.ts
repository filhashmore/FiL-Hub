export const siteConfig = {
  title: 'FiL Hash',
  description: 'Developer portfolio showcasing audio tools, creative tech, and web applications for the touring music industry.',
  author: 'FiL Hash',
  siteUrl: 'https://fil-hub.vercel.app',
  githubUrl: 'https://github.com/filhashmore',
  email: 'filhashmore@gmail.com',

  hero: {
    headline: 'Building audio tools and creative tech that resonate',
    subheadline: 'Full-stack developer • Audio engineer • 10 years touring production',
    cta: {
      text: 'Explore Projects',
      href: '/projects',
    },
  },

  about: {
    bio: "Production manager for touring artist FILMORE with 10 years as a front-of-house engineer. I build web and mobile apps that solve real touring workflow problems—from RF coordination to setlist planning to venue advances.",
    highlights: [
      'Full-stack web & mobile development',
      'React, React Native, TypeScript',
      'Audio/RF engineering expertise',
      'Touring production workflow optimization',
      'Config-driven, offline-first architecture',
      'Supabase & serverless backends',
    ],
  },

  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/filhashmore', icon: 'github' },
    { label: 'Email', url: 'mailto:filhashmore@gmail.com', icon: 'mail' },
  ],

  seo: {
    keywords: [
      'audio developer',
      'touring production',
      'React developer',
      'creative tech',
      'freelance developer',
      'RF coordination',
      'music technology',
    ],
    ogImage: '/og-image.png',
  },

  pwa: {
    enabled: true,
    name: 'FiL Hub',
    shortName: 'FiL Hub',
    description: 'FiL Hash Developer Portfolio',
  },
}

export type SiteConfig = typeof siteConfig
