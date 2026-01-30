# FiL Hub

Personal developer portfolio showcasing audio tools, creative tech, and web applications for the touring music industry.

## Tech Stack

- **Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS 3.4 + shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **Language:** TypeScript
- **Deployment:** Vercel

## Features

- Config-driven project showcase
- Dark/light theme toggle
- Responsive mobile-first design
- Audio-inspired visual elements
- PWA support

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/     # Header, Footer, Layout
│   ├── sections/   # Hero, About, Contact
│   ├── projects/   # ProjectCard, ProjectGrid
│   └── ui/         # Button, Badge, ThemeToggle
├── config/         # Site, projects, navigation configs
├── hooks/          # useTheme, useMobile
├── lib/            # Utility functions
├── pages/          # Home, Projects, NotFound
└── styles/         # Global CSS
```

## Configuration

Edit `src/config/projects.config.ts` to add/remove/reorder projects:

```typescript
{
  id: 'project-id',
  title: 'Project Name',
  description: 'Short description',
  category: 'audio-tools' | 'saas' | 'other',
  technologies: ['React', 'TypeScript'],
  links: { github: '...', live: '...' },
  featured: true,  // Show on homepage
  visible: true,   // Toggle visibility
  order: 1,        // Display order
}
```

## License

MIT © FiL Hash
