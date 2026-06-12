import { Link } from '@tanstack/react-router'
import { ArrowUpRight, MapPin } from 'lucide-react'
import { getPhotoThumbnailUrl } from '../lib/photos'
import type { PichausAlbum } from '../lib/photos'

function formatEventDate(ts: number | null | undefined): string {
  if (!ts) return 'Unknown date'
  const d = new Date(ts * 1000)
  return d.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function PhotoAlbumCard({
  id,
  title,
  eventDate,
  location,
  photoCount,
  coverPhoto,
}: PichausAlbum) {
  const hasCover = !!coverPhoto

  return (
    <Link
      to="/photos"
      search={{ album: id }}
      className="group relative flex flex-col rounded-2xl glass-panel card-shine card-glow hover:-translate-y-1 transition-all duration-300 overflow-hidden h-full"
    >
      {/* Cover photo */}
      {hasCover ? (
        <div className="relative w-full aspect-video overflow-hidden bg-(--bg-secondary)">
          <img
            src={getPhotoThumbnailUrl(coverPhoto.id)}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {photoCount != null && photoCount > 0 && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-black/50 text-white backdrop-blur-sm">
              {photoCount} photos
            </span>
          )}
        </div>
      ) : (
        <div className="relative w-full aspect-video bg-(--bg-secondary) flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-(--accent)/10 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-(--accent)/40" />
          </div>
          {photoCount != null && photoCount > 0 && (
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-(--bg-primary)/60 text-(--text-muted) border border-(--border)">
              {photoCount} photos
            </span>
          )}
        </div>
      )}

      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-(--accent)/30 to-transparent pointer-events-none" />

      {/* Arrow icon */}
      <div className="absolute top-3 right-3 p-1.5 rounded-full bg-(--bg-primary)/60 text-(--text-muted) group-hover:bg-(--accent) group-hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
        <ArrowUpRight className="w-3.5 h-3.5" />
      </div>

      {/* Text content */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-base font-bold text-(--text-primary) group-hover:text-(--accent) transition-colors duration-200 mb-3 line-clamp-2 pr-7 leading-snug">
          {title}
        </h3>

        <div className="mt-auto flex flex-col gap-1.5 text-xs text-(--text-muted)">
          <span>{formatEventDate(eventDate)}</span>
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="line-clamp-1">{location}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
