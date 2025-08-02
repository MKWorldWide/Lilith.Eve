import { useEffect } from 'react'
import { useWhisperMode } from '@context/WhisperModeContext'

/**
 * Detects a secret swipe pattern (left-right-left) and toggles whisper mode.
 */
export const useSecretGesture = () => {
  const { toggleWhisper } = useWhisperMode()

  useEffect(() => {
    let startX: number | null = null
    let directionSequence: ('left' | 'right')[] = []

    const onTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (startX === null) return
      const dx = e.changedTouches[0].clientX - startX
      const dir = dx > 30 ? 'right' : dx < -30 ? 'left' : null
      if (dir) {
        directionSequence.push(dir)
        if (directionSequence.length > 3) directionSequence.shift()
        if (directionSequence.join('-') === 'left-right-left') {
          directionSequence = []
          toggleWhisper()
        }
      }
      startX = null
    }

    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchend', onTouchEnd)
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [toggleWhisper])
}
