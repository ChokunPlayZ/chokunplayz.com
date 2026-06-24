'use client'

import { JustifiedLayout } from '@immich/justified-layout-wasm'
import { ExternalLink, MapPin, Moon, Sun, X, ArrowLeft } from 'lucide-react'
import { Blurhash } from 'react-blurhash'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getAlbumPhotos,
  getPhotoThumbnailUrl,
  getPhotoUrl,
} from '../lib/photos'
import type { PichausAlbum, PichausPhoto } from '../lib/photos'
import { useTheme } from './ThemeProvider'

interface PhotoModeProps {
  photos: PichausPhoto[]
  albums: PichausAlbum[]
  initialAlbumId?: string
  onAlbumChange?: (albumId: string | null) => void
  onExit: () => void
}

function parseEventDate(ts: number | null | undefined) {
  if (!ts) return { month: '---', day: '-' }
  const d = new Date(ts * 1000)
  return {
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate().toString(),
  }
}

function getYear(ts: number | null | undefined) {
  if (!ts) return 'Unknown'
  return new Date(ts * 1000).getFullYear().toString()
}

function groupByYear(albums: PichausAlbum[]) {
  const map = new Map<string, PichausAlbum[]>()
  for (const album of albums) {
    const year = getYear(album.eventDate)
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(album)
  }
  return [...map.entries()].sort((a, b) => {
    if (a[0] === 'Unknown') return 1
    if (b[0] === 'Unknown') return -1
    return Number(b[0]) - Number(a[0])
  })
}

// ── Photo tile (blurhash → image fade) ───────────────────────────────────────

function PhotoTile({
  photo,
  style,
}: {
  photo: PichausPhoto
  style: React.CSSProperties
}) {
  const [loaded, setLoaded] = useState(false)
  return (
    <a
      href={getPhotoUrl(photo.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="absolute overflow-hidden group"
      style={style}
    >
      {photo.blurhash && (
        <Blurhash
          hash={photo.blurhash}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: loaded ? 0 : 1,
            transition: 'opacity 0.6s ease',
          }}
        />
      )}
      <img
        src={getPhotoThumbnailUrl(photo.id)}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-[opacity,transform] duration-500"
        style={{ opacity: loaded ? 1 : 0 }}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        alt=""
      />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-t from-black/40 to-transparent" />
    </a>
  )
}

// ── Justified photo grid ──────────────────────────────────────────────────────

function JustifiedGrid({ photos }: { photos: PichausPhoto[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    setContainerWidth(el.offsetWidth)
    const ro = new ResizeObserver(() => setContainerWidth(el.offsetWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = useMemo(() => {
    if (!containerWidth || !photos.length) return null
    const aspectRatios = new Float32Array(
      photos.map((p) => (p.width && p.height ? p.width / p.height : 1)),
    )
    return new JustifiedLayout(aspectRatios, {
      rowHeight: 220,
      rowWidth: containerWidth,
      spacing: 3,
      heightTolerance: 0.15,
    })
  }, [photos, containerWidth])

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: layout?.containerHeight ?? 0 }}
    >
      {layout &&
        photos.map((photo, i) => {
          const { top, left, width, height } = layout.getPosition(i)
          return (
            <PhotoTile
              key={photo.id}
              photo={photo}
              style={{
                top,
                left,
                width,
                height,
                animation: 'pmAlbumIn 0.4s ease both',
                animationDelay: `${Math.min(i * 0.015, 0.8)}s`,
              }}
            />
          )
        })}
    </div>
  )
}

// ── Album view ────────────────────────────────────────────────────────────────

interface AlbumViewProps {
  album: PichausAlbum
  photos: PichausPhoto[]
  loading: boolean
  ready: boolean
  loadingMore: boolean
  total: number | null
  onBack: () => void
}

function AlbumView({
  album,
  photos,
  loading,
  ready,
  loadingMore,
  total,
  onBack,
}: AlbumViewProps) {
  const { month, day } = parseEventDate(album.eventDate)
  const year = getYear(album.eventDate)
  const picHausUrl = `https://p.ckl.moe/v/${album.id}`

  return (
    <div className="relative min-h-full">
      {/* Sticky header overlay */}
      <div className="sticky top-0 z-20 px-6 pt-6 pb-4 bg-linear-to-b from-(--bg-primary)/90 via-(--bg-primary)/60 to-transparent backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            {/* Back button */}
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs text-(--text-muted) hover:text-(--accent) transition-colors duration-200 group bg-(--bg-primary)/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-(--border) w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
              All events
            </button>

            {/* Album metadata */}
            <div className="flex items-start gap-4">
              <div className="shrink-0 text-right select-none pt-0.5">
                <p className="text-[10px] font-bold text-(--accent) uppercase tracking-wider leading-none mb-0.5 opacity-75">
                  {month}
                </p>
                <p className="text-2xl font-black leading-none text-(--text-primary) opacity-80">
                  {day}
                </p>
                <p className="text-xs font-bold text-(--text-muted) opacity-50 mt-0.5">
                  {year}
                </p>
              </div>
              <div>
                <h2 className="text-xl font-bold text-(--text-primary) leading-snug mb-1">
                  {album.title}
                </h2>
                {album.location && (
                  <div className="flex items-center gap-1 text-xs text-(--text-muted) opacity-60 mb-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {album.location}
                  </div>
                )}
                {(loading || ready) && total !== null && (
                  <p className="text-xs text-(--text-muted) opacity-40">
                    {total} photo{total !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
          <a
            href={picHausUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-(--border) hover:border-(--accent)/60 text-xs text-(--text-muted) hover:text-(--accent) transition-all duration-200 bg-(--bg-primary)/60 backdrop-blur-sm"
          >
            <ExternalLink className="w-3 h-3" />
            <span className="hidden sm:inline">Open in Pichaus</span>
          </a>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-wrap gap-0.75 px-0.75">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="bg-(--border) opacity-40 animate-pulse shrink-0"
              style={{
                width: [
                  220, 160, 180, 240, 200, 170, 210, 190, 250, 160, 200, 180,
                ][i % 12],
                height: 220,
              }}
            />
          ))}
        </div>
      )}

      {/* Photo grid */}
      {!loading && ready && photos.length === 0 && (
        <p className="text-center text-(--text-muted) opacity-40 py-16 text-sm">
          No photos found.
        </p>
      )}
      {!loading && ready && photos.length > 0 && (
        <JustifiedGrid photos={photos} />
      )}

      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="w-5 h-5 rounded-full border-2 border-(--accent)/30 border-t-(--accent) animate-spin" />
        </div>
      )}
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function PhotoMode({
  photos,
  albums,
  initialAlbumId,
  onAlbumChange,
  onExit,
}: PhotoModeProps) {
  const { theme, toggleTheme } = useTheme()
  const grouped = useMemo(() => groupByYear(albums), [albums])
  const [loaded, setLoaded] = useState(false)
  const [selectedAlbum, setSelectedAlbum] = useState<PichausAlbum | null>(null)
  const [albumPhotos, setAlbumPhotos] = useState<PichausPhoto[]>([])
  const [albumLoading, setAlbumLoading] = useState(false)
  const [albumReady, setAlbumReady] = useState(false)
  const [albumPage, setAlbumPage] = useState(1)
  const [albumHasMore, setAlbumHasMore] = useState(false)
  const [albumLoadingMore, setAlbumLoadingMore] = useState(false)
  const [albumTotal, setAlbumTotal] = useState<number | null>(null)
  const albumPanelRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<() => void>(() => {})
  const [windowWidth, setWindowWidth] = useState(1200)

  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const onResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const isMobile = windowWidth < 768
  const sidebarWidth = windowWidth < 1024 ? '320px' : '400px'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedAlbum) handleBack()
        else onExit()
      }
    }
    window.addEventListener('keydown', handleKey)
    const raf = requestAnimationFrame(() => setLoaded(true))
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
      cancelAnimationFrame(raf)
    }
  }, [onExit, selectedAlbum])

  // Keep load-more callback up to date without re-attaching the scroll listener
  loadMoreRef.current = async () => {
    if (!selectedAlbum || albumLoadingMore || !albumHasMore) return
    setAlbumLoadingMore(true)
    try {
      const nextPage = albumPage + 1
      const result = await getAlbumPhotos({
        data: { albumId: selectedAlbum.id, page: nextPage, limit: 50 },
      })
      if (result.photos.length > 0) {
        setAlbumPhotos((prev) => [...prev, ...result.photos])
        setAlbumPage(nextPage)
      }
      setAlbumHasMore(result.hasMore)
    } finally {
      setAlbumLoadingMore(false)
    }
  }

  // Attach scroll listener once per album selection
  useEffect(() => {
    const el = albumPanelRef.current
    if (!el || !selectedAlbum) return
    const onScroll = () => {
      if (el.scrollHeight - el.scrollTop - el.clientHeight < 400) {
        loadMoreRef.current()
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [selectedAlbum?.id])

  const didAutoSelect = useRef(false)
  useEffect(() => {
    if (!initialAlbumId || didAutoSelect.current || albums.length === 0) return
    const album = albums.find((a) => a.id === initialAlbumId)
    if (album) {
      didAutoSelect.current = true
      handleAlbumSelect(album)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAlbumId, albums])

  const handleAlbumSelect = async (album: PichausAlbum) => {
    setSelectedAlbum(album)
    setAlbumPhotos([])
    setAlbumReady(false)
    setAlbumLoading(true)
    setAlbumPage(1)
    setAlbumHasMore(false)
    setAlbumLoadingMore(false)
    setAlbumTotal(
      album.photoCount && album.photoCount > 0 ? album.photoCount : null,
    )
    onAlbumChange?.(album.id)
    if (album.id) {
      try {
        const result = await getAlbumPhotos({
          data: { albumId: album.id, page: 1, limit: 50 },
        })
        setAlbumPhotos(result.photos)
        setAlbumHasMore(result.hasMore)
        if (result.total !== null) setAlbumTotal(result.total)
      } finally {
        setAlbumLoading(false)
        setAlbumReady(true)
      }
    }
  }

  const handleBack = () => {
    setSelectedAlbum(null)
    setAlbumPhotos([])
    setAlbumReady(false)
    setAlbumPage(1)
    setAlbumHasMore(false)
    setAlbumTotal(null)
    onAlbumChange?.(null)
  }

  return (
    <div className="fixed inset-0 z-200 bg-(--bg-primary) animate-in fade-in duration-700">
      {/* ── Film-grain overlay ── */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.07] z-210"
        aria-hidden
      >
        <filter id="pmNoise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pmNoise)" />
      </svg>

      {/* ── Floating REC indicator ── */}
      <div className="fixed top-5 left-5 z-300 flex items-center gap-2 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-(--text-muted) opacity-40">
          REC
        </span>
      </div>

      {/* ── Floating controls (top-right) ── */}
      <div className="fixed top-4 right-4 z-300 flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-(--bg-secondary)/70 hover:bg-(--bg-secondary) border border-(--border) text-(--text-muted) hover:text-(--text-primary) transition-all duration-300 backdrop-blur-md"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-3.5 h-3.5" />
          ) : (
            <Sun className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          onClick={onExit}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-(--bg-secondary)/70 hover:bg-(--bg-secondary) border border-(--border) hover:border-(--accent)/50 text-(--text-muted) hover:text-(--accent) transition-all duration-300 backdrop-blur-md"
          aria-label="Exit"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Background layer ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
        {photos.length > 0 && (
          <div
            className="absolute opacity-55"
            style={{
              top: -300,
              left: -300,
              right: -300,
              bottom: -300,
              transform: 'rotate(-10deg)',
              transformOrigin: 'center center',
              overflow: 'hidden',
            }}
          >
            <BgStrips photos={photos} />
          </div>
        )}

        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <span
            className="font-black uppercase select-none"
            style={{
              fontSize: 'clamp(56px, 11vw, 160px)',
              letterSpacing: '0.3em',
              color: 'transparent',
              WebkitTextStroke:
                '1px color-mix(in srgb, var(--text-primary) 7%, transparent)',
              animation: 'pmDrift 16s ease-in-out infinite',
            }}
          >
            PHOTOGRAPH
          </span>
        </div>

        {/* Scanlines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
            animation: 'pmScan 10s linear infinite',
          }}
        />

        {/* Vignettes */}
        <div className="absolute inset-x-0 top-0 h-40 bg-linear-to-b from-(--bg-primary) to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-(--bg-primary) to-transparent" />
        <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-(--bg-primary)/80 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-(--bg-primary)/80 to-transparent" />
        <div className="absolute inset-0 bg-(--bg-primary)/45" />
      </div>

      {/* ── Two-panel foreground ── */}
      <div className="absolute inset-0 z-10 flex overflow-hidden">
        {/* ── Timeline ── */}
        <div
          className="shrink-0 h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            width: selectedAlbum ? (isMobile ? '0px' : sidebarWidth) : '100%',
            borderRight:
              selectedAlbum && !isMobile ? '1px solid var(--border)' : 'none',
            transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: isMobile && selectedAlbum ? 'hidden' : undefined,
          }}
        >
          <div className="px-6 py-16">
            <div className="max-w-xl mx-auto bg-(--bg-primary)/60 backdrop-blur-xl rounded-3xl px-8 py-10 border border-(--border) shadow-2xl">
              {/* Timeline header */}
              <div
                className={`mb-10 transition-[opacity,transform] duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}
              >
                <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest opacity-60 mb-1">
                  Timeline
                </p>
                <h2
                  className="text-2xl font-bold mb-1"
                  style={{
                    background:
                      'linear-gradient(90deg, var(--text-primary) 0%, var(--accent) 45%, var(--text-primary) 100%)',
                    backgroundSize: '200% auto',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'pmShimmer 5s linear infinite',
                  }}
                >
                  Moments in Film
                </h2>
                <p className="text-(--text-muted) text-sm">
                  {albums.length} events across {grouped.length} year
                  {grouped.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="relative">
                {/* Vertical spine */}
                <div className="absolute left-17.5 top-1 bottom-8 w-px bg-linear-to-b from-(--accent)/50 via-(--border)/40 to-transparent pointer-events-none" />

                {grouped.map(([year, events], gIdx) => (
                  <div key={year}>
                    {/* Year marker */}
                    <div
                      className={`flex items-center gap-4 ${gIdx > 0 ? 'mt-12' : ''} mb-5`}
                      style={
                        loaded
                          ? {
                              animation: 'pmSlideIn 0.6s ease both',
                              animationDelay: `${gIdx * 0.08}s`,
                            }
                          : { opacity: 0 }
                      }
                    >
                      <div className="w-12 shrink-0" />
                      <div className="relative z-10 flex items-center gap-3 -ml-1">
                        <div
                          className="w-5 h-5 rounded-full bg-(--bg-primary) border-2 border-(--accent)/70 flex items-center justify-center shrink-0"
                          style={
                            loaded
                              ? {
                                  animation:
                                    'pmGlowPulse 3s ease-in-out infinite',
                                  animationDelay: `${gIdx * 0.4}s`,
                                }
                              : {}
                          }
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-(--accent)/80" />
                        </div>
                        <span className="text-4xl font-black leading-none select-none text-(--text-muted) opacity-70">
                          {year}
                        </span>
                      </div>
                    </div>

                    {/* Events */}
                    {events.map((album, idx) => {
                      const { month, day } = parseEventDate(album.eventDate)
                      const location = album.location
                      const delay = (gIdx * 8 + idx) * 0.045

                      return (
                        <button
                          key={album.title}
                          onClick={() => handleAlbumSelect(album)}
                          className="w-full flex items-start gap-4 mb-6 group cursor-pointer text-left"
                          style={
                            loaded
                              ? {
                                  animation: 'pmSlideIn 0.5s ease both',
                                  animationDelay: `${delay}s`,
                                }
                              : { opacity: 0 }
                          }
                        >
                          {/* Date column */}
                          <div className="w-12 shrink-0 text-right pt-0.5 select-none">
                            <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wider leading-none mb-0.5 opacity-75">
                              {month}
                            </p>
                            <p className="text-xl font-black leading-none text-(--text-primary) opacity-80">
                              {day}
                            </p>
                          </div>

                          {/* Dot */}
                          <div className="relative z-10 mt-1.5 w-3 h-3 shrink-0 rounded-full bg-(--bg-secondary) border-2 border-(--accent)/40 group-hover:border-(--accent) group-hover:bg-(--accent)/20 group-hover:scale-125 group-hover:shadow-[0_0_8px_var(--accent)] transition-all duration-200" />

                          {/* Content */}
                          <div className="flex-1 min-w-0 group-hover:translate-x-0.5 transition-transform duration-200">
                            <h3 className="text-sm font-semibold text-(--text-primary) group-hover:text-(--accent) transition-colors duration-200 leading-snug pr-2">
                              {album.title}
                            </h3>
                            {location && (
                              <div className="flex items-center gap-1 mt-1 text-xs text-(--text-muted) opacity-60">
                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                {location}
                              </div>
                            )}
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-(--accent)/60 group-hover:text-(--accent) group-hover:gap-2 mt-2 transition-all duration-200">
                              View album →
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`text-center pb-10 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          >
            <p className="text-xs text-(--text-muted) opacity-20 tracking-widest">
              ESC TO EXIT
            </p>
          </div>
        </div>

        {/* ── Panel 2: Album view ── */}
        {/* ── Album panel (fills remaining space) ── */}
        <div
          ref={albumPanelRef}
          className="flex-1 h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={{
            opacity: selectedAlbum ? 1 : 0,
            pointerEvents: selectedAlbum ? 'auto' : 'none',
            transition: 'opacity 0.4s ease',
          }}
        >
          {selectedAlbum && (
            <AlbumView
              album={selectedAlbum}
              photos={albumPhotos}
              loading={albumLoading}
              ready={albumReady}
              loadingMore={albumLoadingMore}
              total={albumTotal}
              onBack={handleBack}
            />
          )}
        </div>
      </div>

      <style>{`
                @keyframes pmDrift {
                    0%, 100% { transform: translateY(0px) rotate(-12deg); }
                    50%       { transform: translateY(-28px) rotate(-12deg); }
                }
                @keyframes pmScan {
                    0%   { background-position: 0 0; }
                    100% { background-position: 0 100px; }
                }
                @keyframes pmShimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes pmSlideIn {
                    from { opacity: 0; transform: translateY(18px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes pmGlowPulse {
                    0%, 100% { box-shadow: 0 0 6px rgba(125,211,252,0.35); }
                    50%       { box-shadow: 0 0 18px rgba(125,211,252,0.85), 0 0 36px rgba(125,211,252,0.25); }
                }
                @keyframes pmAlbumIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
    </div>
  )
}

// ── Dedicated background strip renderer ──────────────────────────────────────

const BG_ROWS = 9
const BG_HEIGHT = 175
const BG_ROW_GAP = 10
const BG_IMG_GAP = 8
const BG_MIN_COVERAGE = 5000

function BgStrips({ photos }: { photos: PichausPhoto[] }) {
  const rows = useMemo(() => {
    const r: PichausPhoto[][] = Array.from({ length: BG_ROWS }, () => [])
    photos.forEach((p, i) => r[i % BG_ROWS].push(p))
    return r
  }, [photos])

  const rowMeta = useMemo(
    () =>
      rows.map((row, ri) => {
        const singleW = row.reduce(
          (s, p) => s + (p.width / p.height) * BG_HEIGHT + BG_IMG_GAP,
          0,
        )
        const copies = Math.max(2, Math.ceil(BG_MIN_COVERAGE / singleW) + 1)
        const goLeft = ri % 2 === 0
        const dur = Math.round(row.length * 7 + ri * 4)
        return { singleW, copies, goLeft, dur }
      }),
    [rows],
  )

  return (
    <>
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: BG_ROW_GAP }}
      >
        {rows.map((row, ri) => {
          if (!row.length) return null
          const { copies, dur } = rowMeta[ri]
          const animName = `bgStrip${ri}`
          return (
            <div key={ri} style={{ height: BG_HEIGHT, flexShrink: 0 }}>
              <div
                style={{
                  display: 'flex',
                  gap: BG_IMG_GAP,
                  animation: `${animName} ${dur}s linear infinite`,
                  willChange: 'transform',
                }}
              >
                {Array.from({ length: copies }, (_, ci) =>
                  row.map((photo) => (
                    <img
                      key={`${ci}-${photo.id}`}
                      src={getPhotoThumbnailUrl(photo.id)}
                      style={{
                        width: (photo.width / photo.height) * BG_HEIGHT,
                        height: BG_HEIGHT,
                        objectFit: 'cover',
                        borderRadius: 8,
                        flexShrink: 0,
                        display: 'block',
                      }}
                      loading="eager"
                      draggable={false}
                      alt=""
                    />
                  )),
                )}
              </div>
            </div>
          )
        })}
      </div>
      <style>
        {rowMeta
          .map(({ singleW, goLeft }, ri) => {
            const name = `bgStrip${ri}`
            const from = goLeft ? '0px' : `-${singleW}px`
            const to = goLeft ? `-${singleW}px` : '0px'
            return `@keyframes ${name} { 0% { transform: translateX(${from}); } 100% { transform: translateX(${to}); } }`
          })
          .join('\n')}
      </style>
    </>
  )
}
