import { ArrowUpRight, Calendar, MapPin } from 'lucide-react'

interface PhotoAlbumCardProps {
  title: string
  date: string
  url: string
  location?: string
}

export function PhotoAlbumCard({
  title,
  date,
  url,
  location,
}: PhotoAlbumCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block p-5 rounded-2xl glass-panel hover:border-(--accent)/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 h-full"
    >
      <div className="absolute top-4 right-4 p-1.5 rounded-full bg-(--bg-primary)/50 text-(--text-muted) group-hover:bg-(--accent) group-hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100">
        <ArrowUpRight className="w-3.5 h-3.5" />
      </div>

      <div className="flex flex-col h-full">
        <h3 className="text-lg font-bold text-(--text-primary) group-hover:text-(--accent) transition-colors mb-2 line-clamp-1">
          {title}
        </h3>

        <div className="mt-auto flex flex-col gap-2 text-sm text-(--text-muted)">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  )
}
