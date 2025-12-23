import { ArrowUpRight } from 'lucide-react'
import { TechBadge } from './TechBadge'

interface ProjectCardProps {
  name: string
  description: string
  url: string
  tech: ReadonlyArray<string>
}

export function ProjectCard({
  name,
  description,
  url,
  tech,
}: ProjectCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col h-full p-6 rounded-2xl glass-panel hover:border-(--accent)/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-bold text-(--text-primary) group-hover:text-(--accent) transition-colors">
          {name}
        </h3>
        <div className="p-2 rounded-full bg-(--bg-secondary) text-(--text-muted) group-hover:bg-(--accent) group-hover:text-white transition-all duration-300 transform group-hover:rotate-45">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      <p className="text-(--text-secondary) mb-6 leading-relaxed grow">
        {description}
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {tech.map((t) => (
          <TechBadge key={t} name={t} />
        ))}
      </div>
    </a>
  )
}
