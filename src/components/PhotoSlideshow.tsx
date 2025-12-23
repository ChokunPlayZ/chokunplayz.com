'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Calendar, ExternalLink, Maximize2, X } from 'lucide-react'
import { Blurhash } from 'react-blurhash'
import type { PichausPhoto } from '../lib/photos'
import { getPhotoThumbnailUrl, getPhotoUrl } from '../lib/photos'

interface PhotoSlideshowProps {
    photos: Array<PichausPhoto>
}

export function PhotoSlideshow({ photos }: PhotoSlideshowProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const [selectedPhoto, setSelectedPhoto] = useState<PichausPhoto | null>(null)
    const [canLoadImages, setCanLoadImages] = useState(false)

    useEffect(() => {
        // If the page is already loaded, load images immediately
        if (document.readyState === 'complete') {
            setCanLoadImages(true)
        } else {
            // Otherwise wait for the load event (scripts, styles, and other assets)
            const handleLoad = () => setCanLoadImages(true)
            window.addEventListener('load', handleLoad)
            return () => window.removeEventListener('load', handleLoad)
        }
    }, [])

    if (photos.length === 0) {
        return null
    }

    // Distribute photos to rows based on width to keep them balanced
    const rowCount = 5
    const rowHeight = 180 // Slightly smaller for 4 rows
    const spacing = 8

    // Initialize rows
    const rows: Array<Array<PichausPhoto>> = Array.from(
        { length: rowCount },
        () => [],
    )
    const rowWidths = new Array(rowCount).fill(0)

    photos.forEach((photo) => {
        // Calculate photo width at our target height
        const photoWidth = (photo.width / photo.height) * rowHeight + spacing

        // Find the shortest row
        let minRowIndex = 0
        for (let i = 1; i < rowCount; i++) {
            if (rowWidths[i] < rowWidths[minRowIndex]) {
                minRowIndex = i
            }
        }

        // Add photo to shortest row
        rows[minRowIndex].push(photo)
        rowWidths[minRowIndex] += photoWidth
    })

    // Calculate total width for each row
    const calculateRowWidth = (rowPhotos: Array<PichausPhoto>) =>
        rowPhotos.reduce(
            (acc, photo) => acc + (photo.width / photo.height) * rowHeight + spacing,
            0,
        )

    return (
        <>
            <div
                ref={containerRef}
                className="relative w-full overflow-hidden space-y-2"
            >
                {/* Gradient overlays for scroll hint */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-(--bg-primary) via-(--bg-primary)/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-(--bg-primary) via-(--bg-primary)/80 to-transparent z-10 pointer-events-none" />

                {rows.map((row, rowIndex) => {
                    const rowWidth = calculateRowWidth(row)
                    const direction = rowIndex % 2 === 0 ? 'left' : 'right'
                    const duration = row.length * 6 + rowIndex * 2 // Vary speed slightly

                    return (
                        <div
                            key={`row-${rowIndex}`}
                            className="flex"
                            style={{
                                width: rowWidth * 2,
                                gap: spacing,
                                animation: `scroll-${direction} ${duration}s linear infinite`,
                            }}
                        >
                            {[...row, ...row].map((photo, index) => (
                                <PhotoCard
                                    key={`row-${rowIndex}-photo-${photo.id}-${index}`}
                                    photo={photo}
                                    rowHeight={rowHeight}
                                    canLoad={canLoadImages}
                                    onClick={() => setSelectedPhoto(photo)}
                                />
                            ))}
                        </div>
                    )
                })}

                {/* CSS Keyframes for scroll animation */}
                <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
            </div>

            {/* Photo Viewer Modal */}
            {selectedPhoto && (
                <PhotoViewer
                    photo={selectedPhoto}
                    onClose={() => setSelectedPhoto(null)}
                />
            )}
        </>
    )
}

function PhotoCard({
    photo,
    rowHeight,
    canLoad,
    onClick,
}: {
    photo: PichausPhoto
    rowHeight: number
    canLoad: boolean
    onClick: () => void
}) {
    const [isLoaded, setIsLoaded] = useState(false)

    return (
        <div
            className="relative shrink-0 overflow-hidden rounded-xl group cursor-pointer transition-all duration-300 hover:brightness-110"
            style={{
                height: rowHeight,
                width: (photo.width / photo.height) * rowHeight,
            }}
            onClick={onClick}
        >
            {(!isLoaded || !canLoad) && photo.blurhash && (
                <div className="absolute inset-0 pointer-events-none">
                    <Blurhash
                        hash={photo.blurhash}
                        width="100%"
                        height="100%"
                        resolutionX={32}
                        resolutionY={32}
                        punch={1}
                    />
                </div>
            )}

            {canLoad && (
                <img
                    src={getPhotoThumbnailUrl(photo.id)}
                    alt={photo.album.title || 'Photo'}
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 pointer-events-auto ${isLoaded ? 'opacity-100' : 'opacity-0'
                        }`}
                    draggable={false}
                    onClick={(e) => {
                        e.stopPropagation()
                        onClick()
                    }}
                    onLoad={() => setIsLoaded(true)}
                />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 pointer-events-none" />
        </div>
    )
}

function PhotoViewer({
    photo,
    onClose,
}: {
    photo: PichausPhoto
    onClose: () => void
}) {
    const [isLoaded, setIsLoaded] = useState(false)

    // Prevent scroll when modal is open and handle ESC key
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        document.body.classList.add('modal-open')

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = 'unset'
            document.body.classList.remove('modal-open')
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [onClose])

    return createPortal(
        <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-all duration-200 hover:scale-110 z-110 group"
                aria-label="Close viewer"
            >
                <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="relative w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col items-center justify-center p-4 md:p-8 pointer-events-none">
                {/* Main Image */}
                <div className="relative flex-1 flex items-center justify-center w-full min-h-0">
                    {/* Blurhash Placeholder */}
                    {!isLoaded && photo.blurhash && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div
                                className="relative overflow-hidden rounded-sm shadow-2xl"
                                style={{
                                    aspectRatio: `${photo.width} / ${photo.height}`,
                                    maxHeight: '100%',
                                    maxWidth: '100%',
                                }}
                            >
                                <Blurhash
                                    hash={photo.blurhash}
                                    width="100%"
                                    height="100%"
                                    resolutionX={32}
                                    resolutionY={32}
                                    punch={1}
                                />
                            </div>
                        </div>
                    )}

                    {/* Loading Spinner (fallback if no blurhash) */}
                    {!isLoaded && !photo.blurhash && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        </div>
                    )}

                    <img
                        src={getPhotoUrl(photo.id)}
                        alt={photo.album.title || 'Photo'}
                        className={`max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-opacity duration-500 pointer-events-auto ${isLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                        onLoad={() => setIsLoaded(true)}
                    />
                </div>

                {/* Info Bar */}
                <div
                    className="w-full max-w-3xl mt-6 pointer-events-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="glass-panel border-white/10 bg-black/40 backdrop-blur-md rounded-2xl p-6 text-white transform transition-all hover:bg-black/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-1">
                                <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                                    {photo.album.title || 'Untitled Photo'}
                                    <a
                                        href={
                                            photo.album.id
                                                ? `https://p.ckl.moe/v/${photo.album.id}`
                                                : getPhotoUrl(photo.id)
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white/20 rounded"
                                        title="Open in new tab"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-white/70">
                                    {photo.dateTaken && (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(photo.dateTaken * 1000).toLocaleDateString(
                                                undefined,
                                                { year: 'numeric', month: 'long', day: 'numeric' },
                                            )}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Maximize2 className="w-4 h-4" />
                                        {photo.width} × {photo.height}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    )
}
