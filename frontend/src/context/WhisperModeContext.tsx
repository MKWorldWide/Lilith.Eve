import React, { createContext, useState, useContext, ReactNode } from 'react'

interface WhisperContextProps {
  whisper: boolean
  toggleWhisper: () => void
}

const WhisperModeContext = createContext<WhisperContextProps | undefined>(undefined)

export const WhisperModeProvider = ({ children }: { children: ReactNode }) => {
  const [whisper, setWhisper] = useState(false)
  const toggleWhisper = () => setWhisper(w => !w)

  return (
    <WhisperModeContext.Provider value={{ whisper, toggleWhisper }}>
      {children}
    </WhisperModeContext.Provider>
  )
}

export const useWhisperMode = () => {
  const context = useContext(WhisperModeContext)
  if (!context) throw new Error('useWhisperMode must be used within WhisperModeProvider')
  return context
}
