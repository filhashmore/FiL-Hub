export interface NavItem {
  label: string
  href: string
  external?: boolean
}

export const navigationConfig: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export const socialLinks: NavItem[] = [
  { label: 'GitHub', href: 'https://github.com/filhashmore', external: true },
]
