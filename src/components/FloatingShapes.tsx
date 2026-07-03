import { useEffect, useRef, useState } from 'react'

interface ShapeConfig {
  id: number
  type: 'circle' | 'square' | 'triangle' | 'cross' | 'sparkle' | 'squiggle'
  size: number
  top: string
  left: string
  color: string
  animationClass: string
  delay: string
  parallaxSpeed: number
}

const SHAPES: ShapeConfig[] = [
  {
    id: 1,
    type: 'sparkle',
    size: 28,
    top: '12%',
    left: '8%',
    color: 'text-sky-500/40 dark:text-sky-400/25',
    animationClass: 'animate-shape-1',
    delay: '-2s',
    parallaxSpeed: 0.04,
  },
  {
    id: 2,
    type: 'circle',
    size: 36,
    top: '25%',
    left: '80%',
    color: 'text-blue-500/35 dark:text-blue-400/25',
    animationClass: 'animate-shape-2',
    delay: '-7s',
    parallaxSpeed: -0.03,
  },
  {
    id: 3,
    type: 'triangle',
    size: 26,
    top: '42%',
    left: '12%',
    color: 'text-cyan-500/45 dark:text-cyan-400/30',
    animationClass: 'animate-shape-3',
    delay: '-12s',
    parallaxSpeed: 0.05,
  },
  {
    id: 4,
    type: 'cross',
    size: 22,
    top: '18%',
    left: '52%',
    color: 'text-indigo-500/40 dark:text-indigo-400/25',
    animationClass: 'animate-shape-1',
    delay: '-4s',
    parallaxSpeed: -0.02,
  },
  {
    id: 5,
    type: 'square',
    size: 32,
    top: '65%',
    left: '88%',
    color: 'text-sky-500/45 dark:text-sky-400/25',
    animationClass: 'animate-shape-2',
    delay: '-15s',
    parallaxSpeed: 0.035,
  },
  {
    id: 6,
    type: 'squiggle',
    size: 40,
    top: '55%',
    left: '28%',
    color: 'text-blue-500/40 dark:text-blue-400/25',
    animationClass: 'animate-shape-3',
    delay: '-9s',
    parallaxSpeed: -0.04,
  },
  {
    id: 7,
    type: 'sparkle',
    size: 34,
    top: '80%',
    left: '10%',
    color: 'text-cyan-500/40 dark:text-cyan-400/25',
    animationClass: 'animate-shape-2',
    delay: '-18s',
    parallaxSpeed: 0.025,
  },
  {
    id: 8,
    type: 'circle',
    size: 30,
    top: '88%',
    left: '72%',
    color: 'text-indigo-500/35 dark:text-indigo-400/25',
    animationClass: 'animate-shape-1',
    delay: '-5s',
    parallaxSpeed: -0.03,
  },
  {
    id: 9,
    type: 'cross',
    size: 26,
    top: '72%',
    left: '46%',
    color: 'text-sky-500/45 dark:text-sky-400/25',
    animationClass: 'animate-shape-3',
    delay: '-14s',
    parallaxSpeed: 0.045,
  },
  {
    id: 10,
    type: 'triangle',
    size: 24,
    top: '94%',
    left: '32%',
    color: 'text-blue-500/40 dark:text-blue-400/25',
    animationClass: 'animate-shape-2',
    delay: '-22s',
    parallaxSpeed: -0.015,
  },
  {
    id: 11,
    type: 'square',
    size: 28,
    top: '32%',
    left: '64%',
    color: 'text-cyan-500/35 dark:text-cyan-400/25',
    animationClass: 'animate-shape-1',
    delay: '-10s',
    parallaxSpeed: 0.03,
  },
  {
    id: 12,
    type: 'squiggle',
    size: 36,
    top: '4%',
    left: '76%',
    color: 'text-indigo-500/45 dark:text-indigo-400/25',
    animationClass: 'animate-shape-3',
    delay: '-6s',
    parallaxSpeed: -0.05,
  },
]

export function FloatingShapes() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return
      const x = e.clientX - window.innerWidth / 2
      const y = e.clientY - window.innerHeight / 2
      containerRef.current.style.setProperty('--mouse-x', `${x}px`)
      containerRef.current.style.setProperty('--mouse-y', `${y}px`)
    }

    // Only apply mouse tracking if mouse is available
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  if (!mounted) return null

  const renderShapeSvg = (type: string, size: number) => {
    switch (type) {
      case 'sparkle':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z" />
          </svg>
        )
      case 'circle':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="8" />
          </svg>
        )
      case 'triangle':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <polygon points="12 5 4 19 20 19" />
          </svg>
        )
      case 'cross':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        )
      case 'square':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="5" y="5" width="14" height="14" rx="2" ry="2" />
          </svg>
        )
      case 'squiggle':
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M 4,12 C 6,8 8,16 10,12 C 12,8 14,16 16,12 C 18,8 20,16 22,12" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none"
      style={
        {
          '--mouse-x': '0px',
          '--mouse-y': '0px',
        } as React.CSSProperties
      }
    >
      {SHAPES.map((shape) => (
        <div
          key={shape.id}
          className="absolute transition-transform duration-300 ease-out"
          style={{
            top: shape.top,
            left: shape.left,
            transform: `translate3d(calc(var(--mouse-x) * ${shape.parallaxSpeed}), calc(var(--mouse-y) * ${shape.parallaxSpeed}), 0)`,
          }}
        >
          <div
            className={`${shape.color} ${shape.animationClass}`}
            style={{
              animationDelay: shape.delay,
            }}
          >
            {renderShapeSvg(shape.type, shape.size)}
          </div>
        </div>
      ))}
    </div>
  )
}
