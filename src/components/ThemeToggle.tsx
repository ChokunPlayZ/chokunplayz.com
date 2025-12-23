import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle fixed top-6 right-6 z-50 p-3 rounded-full glass-panel hover:scale-110 hover:rotate-12 transition-all duration-300 cursor-pointer"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-(--text-muted) hover:text-(--text-primary)" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400 hover:text-yellow-300" />
      )}
    </button>
  )
}
