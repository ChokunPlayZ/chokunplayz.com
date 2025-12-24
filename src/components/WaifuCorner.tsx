import { useEffect, useState } from 'react'

interface WaifuCornerProps {
    url: string
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
    styles?: React.CSSProperties
}

export function WaifuCorner({ url, position, styles }: WaifuCornerProps) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Trigger animation after mount
        const timer = setTimeout(() => setIsVisible(true), 100)
        return () => clearTimeout(timer)
    }, [])

    // Position styles
    const positionStyles = {
        'top-left': { top: 0, left: 0, transform: isVisible ? 'translate(0, 0)' : 'translate(-100%, -100%)' },
        'top-right': { top: 0, right: 0, transform: isVisible ? 'translate(0, 0)' : 'translate(100%, -100%)' },
        'bottom-left': { bottom: 0, left: 0, transform: isVisible ? 'translate(0, 0)' : 'translate(-100%, 100%)' },
        'bottom-right': { bottom: 0, right: 0, transform: isVisible ? 'translate(0, 0)' : 'translate(100%, 100%)' },
    }

    const baseStyle = positionStyles[position]

    // Merge base transform with custom transform if it exists
    const combinedStyle = {
        ...baseStyle,
        ...styles,
        // If we are visible, we want to allow custom transform. 
        // But standard slide-in uses transform too. 
        // Strategy: Apply slide-in logic to a wrapper, apply custom transforms to the inner image? 
        // OR: Just let the user control it fully.
        // Better strategy for "sinking" fix: Let the container be fixed, apply offsets via margin/transform on the inner or outer.
        // Let's apply custom styles to the OUTER container, but be careful about the transition.
        transform: isVisible
            ? (styles?.transform || 'translate(0, 0)')
            : baseStyle.transform
    }

    return (
        <div
            className="fixed z-50 pointer-events-none transition-transform duration-1000 cubic-bezier(0.34, 1.56, 0.64, 1)"
            style={combinedStyle}
        >
            <img
                src={url}
                alt="Seasonal Waifu"
                className="block drop-shadow-2xl"
                style={{
                    maxHeight: '300px',
                    maxWidth: '300px',
                    width: 'auto',
                    height: 'auto',
                }}
            />
        </div>
    )
}
