import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Projects } from '@/pages/Projects'
import { NotFound } from '@/pages/NotFound'

// Component to handle scroll to hash on navigation
function ScrollToHash() {
  const location = useLocation()

  useEffect(() => {
    // If there's a hash in the URL, scroll to that element
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1))
      if (element) {
        // Small delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } else {
      // Scroll to top on route change without hash
      window.scrollTo(0, 0)
    }
  }, [location])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToHash />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
