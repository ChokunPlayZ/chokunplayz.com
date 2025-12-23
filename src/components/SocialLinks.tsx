import { Github, Instagram, Mail, Twitter } from 'lucide-react'
import type { socials } from '../data/site'

// Map icon names to Lucide components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  twitter: Twitter,
  instagram: Instagram,
  mail: Mail,
  // TikTok doesn't exist in lucide-react, we'll create a simple one
  tiktok: ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
}

interface SocialLinksProps {
  links: typeof socials
  className?: string
}

export function SocialLinks({ links, className = '' }: SocialLinksProps) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {links.map((social) => {
        const Icon = iconMap[social.icon]
        return (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="p-3 rounded-full text-(--text-muted) bg-(--bg-secondary)/50 border border-(--border) hover:text-white hover:bg-(--accent) hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
          >
            <Icon className="w-5 h-5" />
          </a>
        )
      })}
    </div>
  )
}
