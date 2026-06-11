interface SectionProps {
  title?: string
  children: React.ReactNode
  className?: string
  id?: string
  index?: number
}

export function Section({ title, children, className = '', id, index }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-32 ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        {title && (
          <div className="mb-12 md:mb-16">
            {index !== undefined && (
              <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest mb-3 opacity-60">
                {String(index).padStart(2, '0')}
              </p>
            )}
            <h2 className="text-3xl md:text-5xl font-bold text-(--text-primary) tracking-tight mb-5">
              {title}
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-px w-14 bg-linear-to-r from-(--accent) to-(--accent)/20 rounded-full" />
              <div className="w-1 h-1 rounded-full bg-(--accent)/40" />
              <div className="h-px w-4 bg-(--accent)/15 rounded-full" />
            </div>
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
