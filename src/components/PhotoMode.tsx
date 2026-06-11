'use client'

import { Await } from '@tanstack/react-router'
import { Camera, X, MapPin } from 'lucide-react'
import { Suspense, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { photoAlbums } from '../data/site'
import { PhotoSlideshow } from './PhotoSlideshow'
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

export function PhotoMode({ photosPromise, onExit }: PhotoModeProps) {
    const grouped = useMemo(() => groupByYear(photoAlbums), [])

    useEffect(() => {
        document.body.style.overflow = 'hidden'
        const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onExit() }
        window.addEventListener('keydown', handleKey)
        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKey)
        }
    }, [onExit])

    return createPortal(
        <div data-theme="dark" className="fixed inset-0 z-200 bg-(--bg-primary) flex flex-col animate-in fade-in duration-500">

            {/* ── Header ─────────────────────────────────────────── */}
            <div className="relative z-20 flex items-center justify-between px-6 py-4 shrink-0 border-b border-white/8 bg-(--bg-primary)/70 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <Camera className="w-5 h-5 text-(--accent)" />
                        <span className="text-sm font-semibold tracking-widest uppercase text-(--text-secondary)">
                            Photo Mode
                        </span>
                    </div>
                    <span className="hidden sm:inline text-xs text-(--text-muted) px-2.5 py-1 rounded-full bg-(--bg-secondary)/60 border border-white/10">
                        {photoAlbums.length} events
                    </span>
                </div>
                <button
                    onClick={onExit}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-(--bg-secondary)/60 hover:bg-(--accent)/15 border border-white/10 hover:border-(--accent)/40 text-(--text-secondary) hover:text-(--accent) transition-all duration-200 text-sm backdrop-blur-sm"
                    aria-label="Exit photo mode"
                >
                    <X className="w-4 h-4" />
                    <span className="hidden sm:inline font-medium">Exit</span>
                </button>
            </div>

            {/* ── Content area ───────────────────────────────────── */}
            <div className="flex-1 relative overflow-hidden">

                {/* ── Background: continuously scrolling photos ── */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                    <Suspense fallback={null}>
                        <Await promise={photosPromise}>
                            {(data: { photos: PichausPhoto[] }) => {
                                const photos = data?.photos ?? []
                                return photos.length > 0 ? (
                                    /*
                                     * Fixed pixel inset so coverage is independent of container
                                     * percentage math. -300px on every side ensures the rotated
                                     * grid fills all four corners on any screen up to ~2.5K.
                                     * Round-robin distribution gives every row the same photo
                                     * count, keeping rows long enough that the loop seam is
                                     * never inside the visible viewport.
                                     */
                                    <div
                                        className="absolute opacity-45"
                                        style={{
                                            top: -300, left: -300, right: -300, bottom: -300,
                                            transform: 'rotate(-10deg)',
                                            transformOrigin: 'center center',
                                        }}
                                    >
                                        <PhotoSlideshow
                                            photos={photos}
                                            rowCount={9}
                                            rowHeight={180}
                                            rowGap={0}
                                            distribute="roundRobin"
                                        />
                                    </div>
                                ) : null
                            }}
                        </Await>
                    </Suspense>

                    {/* Top & bottom vignette fade */}
                    <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-(--bg-primary) to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-(--bg-primary) to-transparent" />
                    {/* Side vignette */}
                    <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-(--bg-primary)/80 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-24 bg-linear-to-l from-(--bg-primary)/80 to-transparent" />
                    {/* Center overlay for timeline readability */}
                    <div className="absolute inset-0 bg-(--bg-primary)/55" />
                </div>

                {/* ── Foreground: scrollable timeline ── */}
                <div className="absolute inset-0 overflow-y-auto z-10">
                    <div className="px-6 py-12">
                        <div className="max-w-xl mx-auto">

                            {/* Timeline header */}
                            <div className="mb-10">
                                <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest opacity-60 mb-1">
                                    Timeline
                                </p>
                                <h2 className="text-2xl font-bold text-(--text-primary) mb-1">
                                    Moments in Film
                                </h2>
                                <p className="text-(--text-muted) text-sm">
                                    {photoAlbums.length} events across {grouped.length} year{grouped.length !== 1 ? 's' : ''}
                                </p>
                            </div>

                            {/*
                                Timeline layout:
                                [w-12 date col] [gap-4 = 1rem] [w-3 dot] [gap-4 = 1rem] [content]
                                Vertical line center x = 3rem + 1rem + 0.375rem = 4.375rem
                            */}
                            <div className="relative">
                                {/* Vertical spine */}
                                <div className="absolute left-17.5 top-1 bottom-8 w-px bg-linear-to-b from-(--accent)/50 via-(--border)/40 to-transparent pointer-events-none" />

                                {grouped.map(([year, events], gIdx) => (
                                    <div key={year}>
                                        {/* Year marker */}
                                        <div className={`flex items-center gap-4 ${gIdx > 0 ? 'mt-12' : ''} mb-5`}>
                                            <div className="w-12 shrink-0" />
                                            <div className="relative z-10 flex items-center gap-3">
                                                <div className="w-5 h-5 rounded-full bg-(--bg-primary) border-2 border-(--accent)/70 flex items-center justify-center shrink-0 shadow-[0_0_12px_var(--accent)]">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-(--accent)/80" />
                                                </div>
                                                <span className="text-4xl font-black leading-none select-none"
                                                    style={{ color: 'color-mix(in srgb, var(--text-primary) 12%, transparent)' }}>
                                                    {year}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Events */}
                                        {events.map((album) => {
                                            const { month, day, full } = parseEventDate(album.date)
                                            const location = 'location' in album ? album.location as string : undefined

                                            return (
                                                <a
                                                    key={album.title}
                                                    href={album.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-start gap-4 mb-6 group cursor-pointer"
                                                >
                                                    {/* Date column */}
                                                    <div className="w-12 shrink-0 text-right pt-0.5 select-none">
                                                        <p className="text-[10px] font-bold text-(--text-muted) uppercase tracking-wider leading-none mb-0.5 opacity-55">
                                                            {month}
                                                        </p>
                                                        <p className="text-xl font-black leading-none"
                                                            style={{ color: 'color-mix(in srgb, var(--text-primary) 20%, transparent)' }}>
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

                    <div className="text-center pb-10">
                        <p className="text-xs text-(--text-muted) opacity-25">Press Esc to exit</p>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    )
}
