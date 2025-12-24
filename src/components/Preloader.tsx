import { useEffect, useState } from 'react'

export function Preloader() {
    const [isVisible, setIsVisible] = useState(true)
    const [isRendered, setIsRendered] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Start loading animation
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval)
                    return 90
                }
                return prev + Math.random() * 10
            })
        }, 100)

        const handleLoad = () => {
            clearInterval(interval)
            setProgress(100)

            // Wait for progress bar to fill visually
            setTimeout(() => {
                setIsVisible(false)
                // Remove from DOM after transition completes
                setTimeout(() => setIsRendered(false), 700)
            }, 500)
        }

        if (document.readyState === 'complete') {
            // If already loaded, give it a moment to show the 100% state
            setTimeout(handleLoad, 500)
        } else {
            window.addEventListener('load', handleLoad)
            return () => {
                window.removeEventListener('load', handleLoad)
                clearInterval(interval)
            }
        }
    }, [])

    if (!isRendered) return null

    return (
        <div
            id="global-preloader"
            className={`fixed inset-0 z-9999 flex items-center justify-center bg-(--bg-primary) transition-opacity duration-700 ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
        >
            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-sky-300/30 dark:bg-sky-500/20 rounded-full blur-[80px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-200/30 dark:bg-blue-400/20 rounded-full blur-[80px] animate-pulse" />
            </div>

            <div className="relative flex flex-col items-center gap-4 w-64">
                {/* Progress Bar Container */}
                <div className="w-full h-1 bg-(--border) rounded-full overflow-hidden">
                    {/* Progress Bar Fill */}
                    <div
                        className="h-full bg-(--accent) transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Text */}
                <div className="flex justify-between w-full text-xs font-medium text-(--text-muted)">
                    <span className="font-['Outfit'] tracking-wider uppercase">Loading</span>
                    <span className="font-mono">{Math.round(progress)}%</span>
                </div>
            </div>
        </div>
    )
}
