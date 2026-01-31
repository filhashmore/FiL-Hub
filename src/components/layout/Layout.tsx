import { Outlet } from 'react-router-dom'
import { Suspense, useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Header } from './Header'
import { Footer } from './Footer'
import { PageTransition } from '@/components/ui/PageTransition'
import { LoadingScreen } from '@/components/ui/LoadingScreen'

export function Layout() {
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // Small delay to allow critical content to paint first
    const timer = setTimeout(() => setIsInitialLoad(false), 600)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      {/* Initial loading screen */}
      <AnimatePresence mode="wait">
        {isInitialLoad && <LoadingScreen key="loading" />}
      </AnimatePresence>

      <Header />

      <main className="flex-1 relative">
        <Suspense fallback={<div className="min-h-screen" />}>
          <PageTransition>
            <Outlet />
          </PageTransition>
        </Suspense>
      </main>

      <Footer />
    </div>
  )
}
