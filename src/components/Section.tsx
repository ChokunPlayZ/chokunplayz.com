interface SectionProps {
  title?: string
  children: React.ReactNode
  className?: string
  id?: string
}

export function Section({ title, children, className = '', id }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-32 ${className}`}>
      <div className="max-w-4xl mx-auto px-6">
        {title && (
          <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-(--text-primary) tracking-tight mb-4">
              {title}
            </h2>
            <div className="h-1 w-20 bg-linear-to-r from-(--accent) to-transparent rounded-full" />
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
