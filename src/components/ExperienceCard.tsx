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
    return (
        <div className="group relative p-6 glass-panel rounded-3xl hover:bg-(--accent)/5 transition-colors duration-300">
            <div className="flex flex-col md:flex-row gap-4 md:items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-(--accent)/10 text-(--accent)">
                        {type === 'work' ? (
                            <Briefcase className="w-5 h-5" />
                        ) : (
                            <GraduationCap className="w-5 h-5" />
                        )}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-(--text-primary)">{position}</h3>
                        <p className="text-(--text-secondary) font-medium">{company}</p>
                    </div>
                </div>
                <div className="text-sm font-medium text-(--text-muted) px-3 py-1 rounded-full bg-(--bg-secondary)/50 self-start md:self-center">
                    {period}
                </div>
            </div>
            <p className="text-(--text-secondary) leading-relaxed">{description}</p>
        </div>
    )
}
