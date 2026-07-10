"use client"

import { useState } from "react"
import { Carousel } from "@/components/blue-yard/carousel"
import SplashScreen from "@/components/splash-screen"

export default function Page() {
  const [splashFinished, setSplashFinished] = useState(false)

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {!splashFinished && (
        <SplashScreen onComplete={() => setSplashFinished(true)} />
      )}
      
      {/* We always mount the carousel so the 3D canvas can initialize while loading */}
      <div 
        className="w-full h-full transition-opacity duration-1000"
        style={{ opacity: splashFinished ? 1 : 0, pointerEvents: splashFinished ? 'auto' : 'none' }}
      >
        <Carousel isReady={splashFinished} />
      </div>
    </main>
  )
}
