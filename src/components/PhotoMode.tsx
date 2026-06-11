'use client'

import { Await } from '@tanstack/react-router'
import { MapPin, X } from 'lucide-react'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { photoAlbums } from '../data/site'
import { getPhotoThumbnailUrl } from '../lib/photos'
import type { PichausPhoto } from '../lib/photos'

interface PhotoModeProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    photosPromise: any
    onExit: () => void
}

type Album = (typeof photoAlbums)[number]

function parseEventDate(dateStr: string) {
    const d = new Date(`${dateStr}T12:00:00`)
    return {
        month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
        day:   d.getDate().toString(),
        full:  d.toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    }
}

function groupByYear(albums: readonly Album[]) {
    const map = new Map<string, Album[]>()
    for (const album of albums) {
        const year = album.date.slice(0, 4)
        if (!map.has(year)) map.set(year, [])
        map.get(year)!.push(album)
    }
    return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))
}

function LoadTrigger({ onLoad }: { onLoad: () => void }) {
    useEffect(() => { onLoad() }, [onLoad])
    return null
}

export function PhotoMode({ photosPromise, onExit }: PhotoModeProps) {
    const grouped = useMemo(() => groupByYear(photoAlbums), [])
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onExit() }
        window.addEventListener('keydown', handleKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKey)
        }
    }, [onExit])

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

                {/* Scrolling photo strips */}
                <Suspense fallback={null}>
                    <Await promise={photosPromise}>
                        {(data: { photos: PichausPhoto[] }) => {
                            const photos = data?.photos ?? []
                            return (
                                <>
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
                                    <LoadTrigger onLoad={() => setLoaded(true)} />
                                </>
                            )
                        }}
                    </Await>
                </Suspense>

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

            {/* ── Foreground: scrollable timeline ── */}
            <div className="absolute inset-0 overflow-y-auto z-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="px-6 py-16">
                    <div className="max-w-xl mx-auto">

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
                                {photoAlbums.length} events across {grouped.length} year{grouped.length !== 1 ? 's' : ''}
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
                                            <span className="text-4xl font-black leading-none select-none text-(--text-muted) opacity-40">
                                                {year}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Events */}
                                    {events.map((album, idx) => {
                                        const { month, day, full } = parseEventDate(album.date)
                                        const location = 'location' in album ? album.location as string : undefined
                                        const delay = (gIdx * 8 + idx) * 0.045

                                        return (
                                            <a
                                                key={album.title}
                                                href={album.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-start gap-4 mb-6 group cursor-pointer"
                                                style={loaded ? { animation: 'pmSlideIn 0.5s ease both', animationDelay: `${delay}s` } : { opacity: 0 }}
                                            >
                                                {/* Date column */}
                                                <div className="w-12 shrink-0 text-right pt-0.5 select-none">
                                                    <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wider leading-none mb-0.5 opacity-55">
                                                        {month}
                                                    </p>
                                                    <p className="text-xl font-black leading-none text-(--text-muted) opacity-60">
                                                        {day}
                                                    </p>
                                                </div>

                                                {/* Dot */}
                                                <div className="relative z-10 mt-1.5 w-3 h-3 shrink-0 rounded-full bg-(--bg-secondary) border-2 border-(--accent)/40 group-hover:border-(--accent) group-hover:bg-(--accent)/20 group-hover:scale-125 group-hover:shadow-[0_0_8px_var(--accent)] transition-all duration-200" />

                                                {/* Content */}
                                                <div className="flex-1 min-w-0 group-hover:translate-x-0.5 transition-transform duration-200">
                                                    <h3 className="text-sm font-bold text-(--text-primary) group-hover:text-(--accent) transition-colors duration-200 leading-snug pr-2">
                                                        {album.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                                                        {location && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-(--text-muted) opacity-55">
                                                                <MapPin className="w-2.5 h-2.5 shrink-0" />
                                                                {location}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-(--text-muted) opacity-35">
                                                            {full}
                                                        </span>
                                                    </div>
                                                    <span className="inline-flex items-center gap-1 text-xs font-medium text-(--accent)/40 group-hover:text-(--accent) group-hover:gap-2 mt-2 transition-all duration-200">
                                                        View album →
                                                    </span>
                                                </div>
                                            </a>
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
