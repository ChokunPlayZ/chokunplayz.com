import { Briefcase, GraduationCap } from 'lucide-react'

interface ExperienceCardProps {
  company: string
  position: string
  period: string
  description: string
  type: 'work' | 'education'
}

export function ExperienceCard({
  company,
  position,
  period,
  description,
  type,
}: ExperienceCardProps) {
  const isWork = type === 'work'

  return (
    <div className="group relative pl-10 py-6 pr-6 glass-panel card-shine card-glow rounded-3xl transition-all duration-300">
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-5 bottom-5 w-0.5 rounded-full ${isWork ? 'bg-linear-to-b from-(--accent) to-(--accent)/15' : 'bg-linear-to-b from-violet-400 to-violet-400/15'}`}
      />

      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-7 w-3 h-3 rounded-full border-2 -translate-x-1.25 ${isWork ? 'border-(--accent) bg-(--bg-primary)' : 'border-violet-400 bg-(--bg-primary)'}`}
      />

      <div className="flex flex-col md:flex-row gap-3 md:items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2.5 rounded-xl shrink-0 ${isWork ? 'bg-(--accent)/10 text-(--accent)' : 'bg-violet-400/10 text-violet-400'}`}
          >
            {isWork ? (
              <Briefcase className="w-4 h-4" />
            ) : (
              <GraduationCap className="w-4 h-4" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-(--text-primary) leading-tight">
              {position}
            </h3>
            <p
              className={`text-sm font-medium ${isWork ? 'text-(--accent)' : 'text-violet-400'}`}
            >
              {company}
            </p>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-3 py-1.5 rounded-full self-start shrink-0 ${isWork ? 'bg-(--accent)/10 text-(--accent)' : 'bg-violet-400/10 text-violet-400'}`}
        >
          {period}
        </span>
      </div>

      <p className="text-(--text-secondary) leading-relaxed text-sm">
        {description}
      </p>
    </div>
  )
}
