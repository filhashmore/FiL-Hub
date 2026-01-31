export const siteConfig = {
  title: 'FiL Hash',
  description: 'Developer portfolio showcasing audio tools, creative tech, and web applications for the touring music industry.',
  author: 'FiL Hash',
  siteUrl: 'https://fil-hub.vercel.app',
  githubUrl: 'https://github.com/filhashmore',
  email: 'filhashmore@protonmail.com',

  hero: {
    headline: 'Building audio tools and creative tech that resonate',
    subheadline: '',
    cta: {
      text: 'Explore Projects',
      href: '/projects',
    },
  },

  about: {
    bio: "FiL Hash brings 15 years of touring music industry experience to software development—spanning FOH & monitor engineering, production management, stage management, and playback. With a parallel career in photography, visual design, and branding for performing artists, FiL builds web and mobile tools that solve real production workflow problems—from RF coordination to setlist planning to venue advances.",
    highlights: [
      'Full-stack web & mobile development',
      'React, React Native, TypeScript',
      'Audio/RF engineering expertise',
      'Touring production workflow optimization',
      'Visual design & artist branding',
      'Supabase & serverless backends',
    ],
  },

  socialLinks: [
    { label: 'GitHub', url: 'https://github.com/filhashmore', icon: 'github' },
    { label: 'Email', url: 'mailto:filhashmore@protonmail.com', icon: 'mail' },
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
