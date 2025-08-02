import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

/**
 * SilkyFlow component adds smooth fade and slide transitions
 * between route changes for a more sensual UI experience.
 */
const variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeInOut' } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.3, ease: 'easeInOut' } }
}

export const SilkyFlow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} variants={variants} initial="initial" animate="animate" exit="exit" style={{ height: '100%' }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
