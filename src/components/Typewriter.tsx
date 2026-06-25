import { useEffect, useState } from 'react'

interface TypewriterProps {
  words: Array<string>
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
  interactiveWord?: string
  onInteractiveWordClick?: () => void
}

export function Typewriter({
  words,
  typingSpeed = 150,
  deletingSpeed = 200,
  pauseTime = 2000,
  interactiveWord,
  onInteractiveWordClick,
}: TypewriterProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const handleTyping = () => {
      const fullText = words[currentWordIndex]

      if (isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length - 1))
      } else {
        setCurrentText(fullText.substring(0, currentText.length + 1))
      }

      if (!isDeleting && currentText === fullText) {
        setTimeout(() => setIsDeleting(true), pauseTime)
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false)
        setCurrentWordIndex((prev) => (prev + 1) % words.length)
      }
    }

    const timer = setTimeout(
      handleTyping,
      isDeleting ? deletingSpeed : typingSpeed,
    )

    return () => clearTimeout(timer)
  }, [
    currentText,
    isDeleting,
    words,
    currentWordIndex,
    typingSpeed,
    deletingSpeed,
    pauseTime,
  ])

  const isInteractive =
    interactiveWord &&
    onInteractiveWordClick &&
    words[currentWordIndex] === interactiveWord

  return (
    <span
      className={`inline-block min-w-[2ch] transition-all duration-200 ${isInteractive ? 'cursor-pointer underline decoration-dotted underline-offset-4 hover:opacity-75' : ''}`}
      onClick={isInteractive ? onInteractiveWordClick : undefined}
      title={isInteractive ? 'Enter photo mode' : undefined}
    >
      {currentText}
      <span className="animate-pulse ml-1 inline-block w-1.5 h-5 bg-current align-middle" />
    </span>
  )
}
