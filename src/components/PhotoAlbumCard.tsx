import { ArrowUpRight, Calendar, MapPin } from 'lucide-react'

interface PhotoAlbumCardProps {
  title: string
  date: string
  url: string
  location?: string
}

export function PhotoAlbumCard({ title, date, url, location }: PhotoAlbumCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block p-5 rounded-2xl glass-panel card-shine card-glow hover:-translate-y-1 transition-all duration-300 h-full"
    >
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-(--accent)/30 to-transparent pointer-events-none" />

      <div className="absolute top-4 right-4 p-1.5 rounded-full bg-(--bg-primary)/60 text-(--text-muted) group-hover:bg-(--accent) group-hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
        <ArrowUpRight className="w-3.5 h-3.5" />
      </div>

      <div className="flex flex-col h-full">
        <h3 className="text-base font-bold text-(--text-primary) group-hover:text-(--accent) transition-colors duration-200 mb-3 line-clamp-2 pr-7 leading-snug">
          {title}
        </h3>

        <div className="mt-auto flex flex-col gap-1.5 text-xs text-(--text-muted)">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>{date}</span>
          </div>
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>
      </div>
    </a>
  )
}
