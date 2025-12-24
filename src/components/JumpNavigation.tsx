import { useState, useEffect } from 'react'
import { Navigation, ArrowUp } from 'lucide-react'

interface Section {
    id: string
    label: string
    icon: React.ReactNode
    offset?: number
}

interface JumpNavigationProps {
    sections: Section[]
}

export function JumpNavigation({ sections }: JumpNavigationProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeSection, setActiveSection] = useState('')
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
                setIsOpen(false)
            }

            const currentScroll = window.scrollY + window.innerHeight / 3

            for (const section of sections) {
                const element = document.getElementById(section.id)
                if (element) {
                    const { top, bottom } = element.getBoundingClientRect()
                    const elementTop = top + window.scrollY
                    const elementBottom = bottom + window.scrollY

                    if (currentScroll >= elementTop && currentScroll < elementBottom) {
                        setActiveSection(section.id)
                        break
                    }
                }
            }
        }

        window.addEventListener('scroll', handleScroll)
        handleScroll() // Initial check
        return () => window.removeEventListener('scroll', handleScroll)
    }, [sections])

    const scrollToSection = (id: string, customOffset?: number) => {
        const element = document.getElementById(id)
        if (element) {
            const defaultOffset = -80 // Default offset for header
            const yOffset = customOffset !== undefined ? customOffset : defaultOffset
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset
            window.scrollTo({ top: y, behavior: 'smooth' })
            setIsOpen(false)
        }
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setIsOpen(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-6 left-6 z-40 flex flex-col-reverse items-start gap-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          flex items-center justify-center
          w-12 h-12 rounded-full glass-panel
          hover:scale-110 transition-all duration-300
          ${isOpen ? 'bg-(--accent)/20 ring-2 ring-(--accent)' : 'hover:bg-(--accent)/10'}
        `}
                aria-label="Toggle navigation menu"
            >
                <Navigation
                    className={`
            w-5 h-5 text-(--text-primary) 
            transition-transform duration-300 
            ${isOpen ? 'rotate-90' : ''}
          `}
                />
            </button>

            <div
                className={`
          flex flex-col gap-3 transition-all duration-300 origin-bottom-left
          ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8 pointer-events-none'}
        `}
            >
                {sections.map((section) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id, section.offset)}
                        className={`
              flex items-center gap-3 p-2 pr-4 rounded-full glass-panel
              hover:bg-(--accent)/10 transition-all duration-200 group
              backdrop-blur-md shadow-lg
              ${activeSection === section.id ? 'bg-(--accent)/10 ring-1 ring-(--accent)/30' : ''}
            `}
                    >
                        <div className={`
              flex items-center justify-center w-8 h-8 rounded-full 
              transition-colors duration-200
              ${activeSection === section.id
                                ? 'bg-(--accent) text-white'
                                : 'bg-(--bg-secondary)/50 text-(--text-muted) group-hover:bg-(--accent)/20 group-hover:text-(--accent)'
                            }
            `}>
                            {section.icon}
                        </div>
                        <span className={`
              text-sm font-medium whitespace-nowrap transition-colors
              ${activeSection === section.id ? 'text-(--accent)' : 'text-(--text-secondary) group-hover:text-(--text-primary)'}
            `}>
                            {section.label}
                        </span>
                    </button>
                ))}

                <button
                    onClick={scrollToTop}
                    className="flex items-center gap-3 p-2 pr-4 rounded-full glass-panel hover:bg-(--accent)/10 transition-all duration-200 group backdrop-blur-md shadow-lg"
                >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-(--bg-secondary)/50 text-(--text-muted) group-hover:bg-(--accent)/20 group-hover:text-(--accent) transition-colors duration-200">
                        <ArrowUp className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-(--text-secondary) group-hover:text-(--text-primary) whitespace-nowrap transition-colors">
                        Top
                    </span>
                </button>
            </div>
        </div>
    )
}
