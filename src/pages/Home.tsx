import { Hero } from '@/components/sections/Hero'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'

export function Home() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <About />
      <Contact />
    </>
  )
}
