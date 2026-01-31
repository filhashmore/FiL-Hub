import { useState, useCallback, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Github } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { navigationConfig, socialLinks } from '@/config/navigation.config'
import { cn } from '@/lib/utils'

// Optimized spring config for smooth animations
const springConfig = { type: 'spring', stiffness: 400, damping: 30 }

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()

  // Track scroll position for header styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll progress for the progress bar
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 25,
    restDelta: 0.0001,
  })
  const progressOpacity = useTransform(smoothProgress, [0, 0.02], [0, 1])

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/'
    if (href.startsWith('/#')) return false // Hash links aren't "active"
    return location.pathname.startsWith(href)
  }

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      // Handle hash links (e.g., /#about, /#contact)
      if (href.startsWith('/#')) {
        e.preventDefault()
        const hash = href.substring(1) // Remove leading /
        const targetId = hash.substring(1) // Remove #

        if (location.pathname === '/') {
          // Already on home page, just scroll
          const element = document.getElementById(targetId)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        } else {
          // Navigate to home first, then scroll
          navigate('/')
          // Use setTimeout to wait for navigation
          setTimeout(() => {
            const element = document.getElementById(targetId)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' })
            }
          }, 100)
        }
      }
      setIsOpen(false)
    },
    [location.pathname, navigate]
  )

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled 
          ? "border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80" 
          : "border-transparent bg-transparent"
      )}
      style={{ 
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        willChange: 'background-color, border-color',
      }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.span 
            className="text-xl font-bold gradient-text"
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            transition={springConfig}
          >
            FiL Hub
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationConfig.map((item) =>
            item.href.startsWith('/#') ? (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent-bass-bright cursor-pointer',
                  'text-muted-foreground'
                )}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-accent-bass-bright',
                  isActive(item.href)
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {socialLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="icon"
              asChild
              className="hidden sm:flex"
            >
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                <Github className="h-5 w-5" />
              </a>
            </Button>
          ))}
          <ThemeToggle />

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Scroll Progress Bar - attached to bottom of header */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] origin-left pointer-events-none"
        style={{ 
          scaleX: smoothProgress,
          opacity: progressOpacity,
          background: 'linear-gradient(90deg, #3b82f6 0%, #7c3aed 50%, #ec4899 100%)',
          willChange: 'transform, opacity',
        }}
      />

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-border bg-background/98 backdrop-blur-lg overflow-hidden"
            style={{ WebkitBackdropFilter: 'blur(12px)' }}
          >
            <nav className="container mx-auto flex flex-col gap-1 p-4">
              {navigationConfig.map((item, index) =>
                item.href.startsWith('/#') ? (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground cursor-pointer active:bg-surface-hover"
                  >
                    {item.label}
                  </motion.a>
                ) : (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-md text-sm font-medium transition-colors active:bg-surface-hover',
                        isActive(item.href)
                          ? 'bg-surface text-foreground'
                          : 'text-muted-foreground hover:bg-surface hover:text-foreground'
                      )}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                )
              )}
              <div className="h-px bg-border my-2" />
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navigationConfig.length + index) * 0.05 }}
                  className="px-4 py-3 rounded-md text-sm font-medium text-muted-foreground hover:bg-surface hover:text-foreground flex items-center gap-2 active:bg-surface-hover"
                >
                  <Github className="h-4 w-4" />
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
