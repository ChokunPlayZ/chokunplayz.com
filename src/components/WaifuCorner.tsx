import { useEffect, useState } from 'react'

interface WaifuCornerProps {
  url: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  styles?: React.CSSProperties
}

const CORNER_POSITIONS = {
  'top-left': { top: 0, left: 0 },
  'top-right': { top: 0, right: 0 },
  'bottom-left': { bottom: 0, left: 0 },
  'bottom-right': { bottom: 0, right: 0 },
} as const

const HIDDEN_TRANSFORMS = {
  'top-left': 'translate(-100%, -100%)',
  'top-right': 'translate(100%, -100%)',
  'bottom-left': 'translate(-100%, 100%)',
  'bottom-right': 'translate(100%, 100%)',
} as const

const PROXIMITY_PX = 220

export function WaifuCorner({ url, position, styles }: WaifuCornerProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isRetreated, setIsRetreated] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX
      const y = e.clientY
      const w = window.innerWidth
      const h = window.innerHeight

      const near =
        (position === 'bottom-left' &&
          x < PROXIMITY_PX &&
          y > h - PROXIMITY_PX) ||
        (position === 'bottom-right' &&
          x > w - PROXIMITY_PX &&
          y > h - PROXIMITY_PX) ||
        (position === 'top-left' && x < PROXIMITY_PX && y < PROXIMITY_PX) ||
        (position === 'top-right' && x > w - PROXIMITY_PX && y < PROXIMITY_PX)

      setIsRetreated(near)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [position])

  const transform =
    !isVisible || isRetreated
      ? HIDDEN_TRANSFORMS[position]
      : (styles?.transform ?? 'translate(0, 0)')

  return (
    <div
      className="fixed z-50 pointer-events-none transition-transform duration-500 ease-in-out"
      style={{
        ...CORNER_POSITIONS[position],
        ...styles,
        transform,
      }}
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
