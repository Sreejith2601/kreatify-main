"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Check if we've already shown the splash screen in this session
    const hasSeenSplash = sessionStorage.getItem("kreatify-splash-seen")
    if (hasSeenSplash) {
      setIsVisible(false)
      onComplete()
      return
    }

    // Fast counter animation from 0 to 100
    const duration = 2000 // 2 seconds total
    const interval = 20 // update every 20ms
    const steps = duration / interval
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      const rawProgress = Math.min((currentStep / steps) * 100, 100)
      // Add a slight easing to the counter (slows down near the end)
      const easedProgress = rawProgress === 100 ? 100 : rawProgress + (100 - rawProgress) * 0.05
      
      setProgress(Math.floor(Math.min(easedProgress, 100)))

      if (currentStep >= steps) {
        clearInterval(timer)
        setTimeout(() => {
          setIsVisible(false)
          sessionStorage.setItem("kreatify-splash-seen", "true")
          setTimeout(onComplete, 800) // wait for fade out animation
        }, 400)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080808] text-[#E4E9E9]"
        >
          {/* Logo Reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold tracking-[0.25em] uppercase mb-8"
            style={{ fontFamily: 'var(--font-cormorant-garamond)' }}
          >
            Kreatify
          </motion.div>

          {/* Minimalist Progress Line */}
          <div className="w-48 h-[1px] bg-white/20 relative overflow-hidden mb-4">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-[#E0115F]" // Ruby Red from the new palette
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          {/* Percentage Counter */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm font-sans tracking-widest text-white/50"
          >
            {progress}%
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
