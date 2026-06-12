'use client'

import { ExternalLink, MapPin, X, ArrowLeft } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { getAlbumPhotos, getPhotoThumbnailUrl, getPhotoUrl } from '../lib/photos'
import type { PichausAlbum, PichausPhoto } from '../lib/photos'

interface PhotoModeProps {
    photos: PichausPhoto[]
    albums: PichausAlbum[]
    onExit: () => void
}

function parseEventDate(dateStr: string) {
    const d = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`)
    return {
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day:   d.getDate().toString(),
    }
}

function groupByYear(albums: PichausAlbum[]) {
    const map = new Map<string, PichausAlbum[]>()
    for (const album of albums) {
        const year = album.eventDate.slice(0, 4)
        if (!map.has(year)) map.set(year, [])
        map.get(year)!.push(album)
    }
    return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))
}

// ── Album view ────────────────────────────────────────────────────────────────

interface AlbumViewProps {
    album: PichausAlbum
    photos: PichausPhoto[]
    loading: boolean
    ready: boolean
    onBack: () => void
}

function AlbumView({ album, photos, loading, ready, onBack }: AlbumViewProps) {
    const { month, day } = parseEventDate(album.eventDate)
    const year = album.eventDate.slice(0, 4)
    const picHausUrl = `https://p.ckl.moe/v/${album.id}`

    return (
        <div className="px-6 py-16 min-h-full">
            <div className="max-w-2xl mx-auto">

                {/* Back button */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm text-(--text-muted) hover:text-(--accent) transition-colors duration-200 mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
                    All events
                </button>

                {/* Album header */}
                <div className="mb-8 bg-(--bg-primary)/60 backdrop-blur-xl rounded-3xl px-8 py-6 border border-white/5 shadow-2xl">
                    <div className="flex items-start justify-between gap-4">
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
                                    <div className="flex items-center gap-1 text-xs text-(--text-muted) opacity-60 mb-2">
                                        <MapPin className="w-3 h-3 shrink-0" />
                                        {album.location}
                                    </div>
                                )}
                                {!loading && ready && (
                                    <p className="text-xs text-(--text-muted) opacity-40">
                                        {album.photoCount ?? photos.length} photo{(album.photoCount ?? photos.length) !== 1 ? 's' : ''}
                                    </p>
                                )}
                            </div>
                        </div>
                        <a
                            href={picHausUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 hover:border-(--accent)/40 text-xs text-(--text-muted) hover:text-(--accent) transition-all duration-200"
                        >
                            <ExternalLink className="w-3 h-3" />
                            <span className="hidden sm:inline">Open in Pichaus</span>
                        </a>
                    </div>
                </div>

                {/* Loading skeleton */}
                {loading && (
                    <div style={{ columns: '2 160px', gap: '8px' }}>
                        {Array.from({ length: 8 }, (_, i) => (
                            <div
                                key={i}
                                className="mb-2 rounded-xl bg-white/5 animate-pulse"
                                style={{
                                    breakInside: 'avoid',
                                    height: [160, 220, 180, 240, 200, 170, 210, 190][i % 8],
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Photo grid */}
                {!loading && ready && photos.length === 0 && (
                    <p className="text-center text-(--text-muted) opacity-40 py-16 text-sm">No photos found.</p>
                )}
                {!loading && ready && photos.length > 0 && (
                    <div style={{ columns: '2 160px', gap: '8px' }}>
                        {photos.map((photo, i) => (
                            <a
                                key={photo.id}
                                href={getPhotoUrl(photo.id)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mb-2 rounded-xl overflow-hidden group relative"
                                style={{
                                    breakInside: 'avoid',
                                    animation: 'pmAlbumIn 0.4s ease both',
                                    animationDelay: `${Math.min(i * 0.025, 0.6)}s`,
                                }}
                            >
                                <img
                                    src={getPhotoThumbnailUrl(photo.id)}
                                    width={photo.width}
                                    height={photo.height}
                                    className="w-full block group-hover:scale-105 transition-transform duration-500"
                                    loading="lazy"
                                    alt=""
                                />
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-t from-black/40 to-transparent rounded-xl" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// ── Main component ────────────────────────────────────────────────────────────

export function PhotoMode({ photos, albums, onExit }: PhotoModeProps) {
    const grouped = useMemo(() => groupByYear(albums), [albums])
    const [loaded, setLoaded] = useState(false)
    const [selectedAlbum, setSelectedAlbum] = useState<PichausAlbum | null>(null)
    const [albumPhotos, setAlbumPhotos] = useState<PichausPhoto[]>([])
    const [albumLoading, setAlbumLoading] = useState(false)
    const [albumReady, setAlbumReady] = useState(false)

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

    const handleAlbumSelect = async (album: PichausAlbum) => {
        setSelectedAlbum(album)
        setAlbumPhotos([])
        setAlbumReady(false)
        setAlbumLoading(true)
        const albumId = album.id
        if (albumId) {
            try {
                const result = await getAlbumPhotos({ data: albumId })
                setAlbumPhotos(result.photos)
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
    }

    return (
        <div data-theme="dark" className="fixed inset-0 z-200 bg-(--bg-primary) animate-in fade-in duration-700">

            {/* ── Film-grain overlay ── */}
            <svg className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.07] z-210" aria-hidden>
                <filter id="pmNoise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="4" stitchTiles="stitch" />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#pmNoise)" />
            </svg>

            {/* ── Floating REC indicator ── */}
            <div className="fixed top-5 left-5 z-300 flex items-center gap-2 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-white/25">REC</span>
            </div>

            {/* ── Floating exit button ── */}
            <button
                onClick={onExit}
                className="fixed top-4 right-4 z-300 w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/12 border border-white/10 hover:border-(--accent)/50 text-white/35 hover:text-(--accent) transition-all duration-300 backdrop-blur-md"
                aria-label="Exit"
            >
                <X className="w-3.5 h-3.5" />
            </button>

            {/* ── Background layer ── */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">

                {photos.length > 0 && (
                    <div
                        className="absolute opacity-55"
                        style={{
                            top: -300, left: -300, right: -300, bottom: -300,
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
                            WebkitTextStroke: '1px rgba(125,211,252,0.045)',
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
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)',
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

                {/* ── Panel 1: Timeline (shrinks to sidebar when album open) ── */}
                <div
                    className="h-full shrink-0 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    style={{
                        width: selectedAlbum ? '360px' : '100%',
                        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                        <div className="px-5 py-16">
                            <div className="max-w-xl mx-auto bg-(--bg-primary)/60 backdrop-blur-xl rounded-3xl px-8 py-10 border border-white/5 shadow-2xl">

                                {/* Timeline header */}
                                <div className={`mb-10 transition-[opacity,transform] duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-3'}`}>
                                    <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest opacity-60 mb-1">
                                        Timeline
                                    </p>
                                    <h2
                                        className="text-2xl font-bold mb-1"
                                        style={{
                                            background: 'linear-gradient(90deg, var(--text-primary) 0%, var(--accent) 45%, var(--text-primary) 100%)',
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
                                        {albums.length} events across {grouped.length} year{grouped.length !== 1 ? 's' : ''}
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
                                                style={loaded ? { animation: 'pmSlideIn 0.6s ease both', animationDelay: `${gIdx * 0.08}s` } : { opacity: 0 }}
                                            >
                                                <div className="w-12 shrink-0" />
                                                <div className="relative z-10 flex items-center gap-3">
                                                    <div
                                                        className="w-5 h-5 rounded-full bg-(--bg-primary) border-2 border-(--accent)/70 flex items-center justify-center shrink-0"
                                                        style={loaded ? { animation: 'pmGlowPulse 3s ease-in-out infinite', animationDelay: `${gIdx * 0.4}s` } : {}}
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
                                                        style={loaded ? { animation: 'pmSlideIn 0.5s ease both', animationDelay: `${delay}s` } : { opacity: 0 }}
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

                        <div className={`text-center pb-10 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
                            <p className="text-xs text-(--text-muted) opacity-20 tracking-widest">ESC TO EXIT</p>
                        </div>
                    </div>

                    {/* ── Panel 2: Album view (slides in from right) ── */}
                    <div
                        className="flex-1 h-full overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        style={{
                            transform: selectedAlbum ? 'translateX(0)' : 'translateX(100%)',
                            opacity: selectedAlbum ? 1 : 0,
                            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease',
                            pointerEvents: selectedAlbum ? 'auto' : 'none',
                        }}
                    >
                        {selectedAlbum && (
                            <AlbumView
                                album={selectedAlbum}
                                photos={albumPhotos}
                                loading={albumLoading}
                                ready={albumReady}
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

    const rowMeta = useMemo(() =>
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
    [rows])

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: BG_ROW_GAP }}>
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
                                    ))
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
            <style>{rowMeta.map(({ singleW, goLeft }, ri) => {
                const name = `bgStrip${ri}`
                const from = goLeft ? '0px' : `-${singleW}px`
                const to   = goLeft ? `-${singleW}px` : '0px'
                return `@keyframes ${name} { 0% { transform: translateX(${from}); } 100% { transform: translateX(${to}); } }`
            }).join('\n')}</style>
        </>
    )
}
