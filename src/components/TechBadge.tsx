interface TechBadgeProps {
  name: string
}

export function TechBadge({ name }: TechBadgeProps) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-(--accent)/10 text-(--accent) border border-(--accent)/20 hover:bg-(--accent)/20 transition-colors duration-200 cursor-default shadow-sm backdrop-blur-sm">
      {name}
    </span>
  )
}
