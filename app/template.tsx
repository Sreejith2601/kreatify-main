"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

let isFirstMount = true

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    isFirstMount = false
  }, [])

  // Rotating Slide Transition
  // Starts rotated 90deg, scaled down, and translated out.
  // Rotates into full screen seamlessly.
  return (
    <motion.div
      key={pathname}
      initial={isFirstMount ? false : { rotate: 90, width: '20%', height: '20%', x: -200, y: -200, opacity: 0, borderRadius: '24px' }}
      animate={{ rotate: 0, width: '100%', height: '100%', x: 0, y: 0, opacity: 1, borderRadius: '0%' }}
      transition={{ 
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1]
      }}
      className="w-full min-h-screen origin-center"
    >
      {children}
    </motion.div>
  )
}
