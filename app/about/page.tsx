"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/blue-yard/chrome"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import TextReveal from "@/components/ui/text-reveal"

export default function AboutPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isExitingTo, setIsExitingTo] = useState<"" | "home" | "services">("")
  const isTransitioning = useRef(true) // Lock on mount

  // Prevent scroll inertia on load and prefetch routes
  useEffect(() => {
    router.prefetch("/")
    router.prefetch("/services")

    const timer = setTimeout(() => {
      isTransitioning.current = false
    }, 1200)
    return () => clearTimeout(timer)
  }, [router])

  // Bind scroll wheel & touch swipes to window for robust horizontal sliding (duration: 1800ms)
  useEffect(() => {
    const handleWindowWheel = (e: WheelEvent) => {
      if (isTransitioning.current || isExitingTo) return
      if (Math.abs(e.deltaY) < 15) return

      if (e.deltaY > 0) {
        if (currentSlide < 1) {
          setCurrentSlide(prev => prev + 1)
          isTransitioning.current = true
          setTimeout(() => { isTransitioning.current = false }, 1800)
        } else {
          // Scroll down on last slide goes to Services
          setIsExitingTo("services")
          setTimeout(() => { router.push("/services") }, 300)
        }
      } else {
        if (currentSlide > 0) {
          setCurrentSlide(prev => prev - 1)
          isTransitioning.current = true
          setTimeout(() => { isTransitioning.current = false }, 1800)
        } else {
          // Scroll up on first slide goes to Home
          setIsExitingTo("home")
          setTimeout(() => { router.push("/") }, 300)
        }
      }
    }

    let touchStartY = 0
    const handleWindowTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleWindowTouchEnd = (e: TouchEvent) => {
      if (isTransitioning.current || isExitingTo) return
      const diff = touchStartY - e.changedTouches[0].clientY

      if (Math.abs(diff) < 30) return

      if (diff > 0) {
        if (currentSlide < 1) {
          setCurrentSlide(prev => prev + 1)
          isTransitioning.current = true
          setTimeout(() => { isTransitioning.current = false }, 1800)
        } else {
          setIsExitingTo("services")
          setTimeout(() => { router.push("/services") }, 300)
        }
      } else {
        if (currentSlide > 0) {
          setCurrentSlide(prev => prev - 1)
          isTransitioning.current = true
          setTimeout(() => { isTransitioning.current = false }, 1800)
        } else {
          setIsExitingTo("home")
          setTimeout(() => { router.push("/") }, 300)
        }
      }
    }

    window.addEventListener("wheel", handleWindowWheel, { passive: true })
    window.addEventListener("touchstart", handleWindowTouchStart, { passive: true })
    window.addEventListener("touchend", handleWindowTouchEnd, { passive: true })

    return () => {
      window.removeEventListener("wheel", handleWindowWheel)
      window.removeEventListener("touchstart", handleWindowTouchStart)
      window.removeEventListener("touchend", handleWindowTouchEnd)
    }
  }, [currentSlide, isExitingTo, router])

  const navigateToSection = (index: number) => {
    if (index >= 0 && index <= 1) {
      setCurrentSlide(index)
    }
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black selection:bg-white/20 selection:text-white font-sans">
      
      {/* ── Background Gradients Slider (Layer 1 - behind content) ── */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">

        {/* Slide 1 BG: Deep Emerald & Champagne Gold */}
        <motion.div
          className="absolute w-full h-full"
          style={{
            backgroundColor: "#022c22", // Deep Emerald
            backgroundImage: "radial-gradient(at 0% 0%, #064e3b 0px, transparent 65%), radial-gradient(at 100% 100%, #065f46 0px, transparent 65%), radial-gradient(at 30% 80%, rgba(16, 185, 129, 0.15) 0px, transparent 70%), radial-gradient(at 80% 20%, rgba(212, 165, 116, 0.15) 0px, transparent 70%)" // Champagne highlights
          }}
          initial={false}
          animate={currentSlide === 0 && !isExitingTo ? {
            rotate: 0, width: '100%', height: '100%', x: 0, y: 0, zIndex: 1, opacity: 1, borderRadius: '0%'
          } : isExitingTo === "home" ? {
            rotate: -90, width: '20%', height: '20%', x: 200, y: 200, zIndex: -1, opacity: 0, borderRadius: '24px'
          } : {
            rotate: 90, width: '20%', height: '20%', x: -200, y: -200, zIndex: -1, opacity: 0, borderRadius: '24px'
          }}
          transition={{ duration: 0.6 }}
        />

        {/* Slide 2 BG: Midnight Sapphire & Platinum */}
        <motion.div
          className="absolute w-full h-full"
          style={{
            backgroundColor: "#020617", // Midnight Blue/Sapphire
            backgroundImage: "radial-gradient(at 0% 100%, #0f172a 0px, transparent 65%), radial-gradient(at 100% 0%, #1e3a8a 0px, transparent 65%), radial-gradient(at 70% 80%, rgba(59, 130, 246, 0.15) 0px, transparent 70%), radial-gradient(at 20% 20%, rgba(148, 163, 184, 0.15) 0px, transparent 70%)"
          }}
          initial={false}
          animate={currentSlide === 1 && !isExitingTo ? {
            rotate: 0, width: '100%', height: '100%', x: 0, y: 0, zIndex: 1, opacity: 1, borderRadius: '0%'
          } : isExitingTo === "services" ? {
            rotate: 90, width: '20%', height: '20%', x: -200, y: -200, zIndex: -1, opacity: 0, borderRadius: '24px'
          } : {
            rotate: -90, width: '20%', height: '20%', x: 200, y: 200, zIndex: -1, opacity: 0, borderRadius: '24px'
          }}
          transition={{ duration: 0.6 }}
        />
      </div>

      {/* ── Persistent Chrome Header ── */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className={`flex items-center justify-between w-full px-6 md:px-8 py-4 pointer-events-auto border-b shadow-sm backdrop-blur-md transition-colors duration-700 ${currentSlide === 0 ? "border-[#D4A574]/20 bg-black/20" : "border-[#93c5fd]/20 bg-black/20"}`}>
          <Link href="/">
            <Logo className={`transition-colors duration-700 ${currentSlide === 0 ? "text-[#D4A574]" : "text-[#93c5fd]"}`} style={{ fontFamily: 'var(--font-cormorant-garamond)' }} />
          </Link>
          
          {/* Header navigation & Home link */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-700 cursor-pointer ${currentSlide === 0 ? "text-[#D4A574]/80 hover:text-[#D4A574]" : "text-[#93c5fd]/80 hover:text-[#93c5fd]"}`}
            >
              Home
            </Link>
            <button
              onClick={() => setCurrentSlide(0)}
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-700 cursor-pointer ${currentSlide === 0 ? "text-[#D4A574] hover:text-[#D4A574]" : "text-[#93c5fd] hover:text-[#93c5fd]"}`}
            >
              About
            </button>
            <Link
              href="/services"
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition-colors duration-700 cursor-pointer ${currentSlide === 0 ? "text-[#D4A574]/80 hover:text-[#D4A574]" : "text-[#93c5fd]/80 hover:text-[#93c5fd]"}`}
            >
              Services
            </Link>
            <Link
              href="/#contact"
              className="uiverse-btn"
              style={{ "--bg": currentSlide === 0 ? "linear-gradient(to right, #064e3b, #047857)" : "linear-gradient(to right, #1e3a8a, #1d4ed8)" } as React.CSSProperties}
            >
              <span className="wrap text-white" style={{ padding: "8px 20px", fontSize: "10px" }}>
                <p>
                  <span>Get In Touch</span>
                </p>
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Slide Navigation (Vertical Dots) ── */}
      <div className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
        {[0, 1].map((idx) => (
          <button
            key={idx}
            onClick={() => navigateToSection(idx)}
            className={`rounded-full transition-all duration-300 ${
              currentSlide === idx 
                ? (currentSlide === 0 ? "w-6 h-1.5 bg-[#4A3B32]" : "w-6 h-1.5 bg-white") 
                : (currentSlide === 0 ? "w-1.5 h-1.5 bg-[#4A3B32]/40 hover:bg-[#4A3B32]/60" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60")
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* ── Foreground Content Slider (Layer 2 - top layer) ── */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">

        {/* Slide 1: Relationships & Innovative Strategies */}
        <motion.section
          className="absolute inset-0 flex items-center justify-center pointer-events-auto"
          initial={false}
          animate={currentSlide === 0 && !isExitingTo ? {
            rotate: 0, width: '100%', height: '100%', x: 0, y: 0, zIndex: 1, opacity: 1
          } : isExitingTo === "home" ? {
            rotate: -90, width: '20%', height: '20%', x: 200, y: 200, zIndex: -1, opacity: 0
          } : {
            rotate: 90, width: '20%', height: '20%', x: -200, y: -200, zIndex: -1, opacity: 0
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 md:px-12 pt-20 lg:pt-0">
            {/* Left Column: Text Content */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                About <span className="font-heading italic text-[#D4A574]" style={{ fontFamily: 'var(--font-cormorant-garamond)' }}>us</span>
              </h1>
              
              <div className="space-y-4 text-white/90 text-sm md:text-base leading-relaxed font-sans max-w-xl">
                <TextReveal text="Kreatify is a digital marketing company focused on building strong, recognizable brands through strategy-driven creativity. We help businesses connect with their audience by combining thoughtful branding, impactful visuals, and performance-oriented digital marketing." delay={0.2} isReady={currentSlide === 0} />
                <br />
                <br />
                <TextReveal text="Every campaign at Kreatify is designed with clarity and purpose, ensuring that brands don't just gain visibility, but earn attention and trust in an increasingly competitive digital space." delay={0.5} isReady={currentSlide === 0} />
              </div>
            </div>

            {/* Right Column: Custom graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[400px] aspect-square rounded-3xl overflow-hidden bg-white/10 border border-white/20 shadow-xl shadow-black/20 backdrop-blur-xl p-4 flex items-center justify-center">
                <img 
                  src="/team_lightbulb.png" 
                  alt="Team collaboration around a lightbulb table illustration"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Slide 2: Study & Discovery */}
        <motion.section
          className="absolute inset-0 flex items-center justify-center pointer-events-auto"
          initial={false}
          animate={currentSlide === 1 && !isExitingTo ? {
            rotate: 0, width: '100%', height: '100%', x: 0, y: 0, zIndex: 1, opacity: 1
          } : isExitingTo === "services" ? {
            rotate: 90, width: '20%', height: '20%', x: -200, y: -200, zIndex: -1, opacity: 0
          } : {
            rotate: -90, width: '20%', height: '20%', x: 200, y: 200, zIndex: -1, opacity: 0
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center px-6 md:px-12 pt-20 lg:pt-0">
            {/* Left Column: Custom graphic */}
            <div className="lg:col-span-5 flex justify-center order-2 lg:order-1">
              <div className="relative w-full max-w-[400px] aspect-square rounded-3xl overflow-hidden bg-white/10 border border-white/20 shadow-xl shadow-black/20 backdrop-blur-xl p-4 flex items-center justify-center">
                <img 
                  src="/fuzzy_lightbulb.png" 
                  alt="Fuzzy neon pink lightbulb 3D model"
                  className="w-full h-full object-contain rounded-2xl"
                />
              </div>
            </div>

            {/* Right Column: Text Content */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                Mission <br />
                <span className="font-heading italic text-[#93c5fd]" style={{ fontFamily: 'var(--font-cormorant-garamond)' }}>& Vision</span>
              </h2>
              
              <div className="space-y-4 text-white/90 text-sm md:text-base leading-relaxed font-sans max-w-xl">
                <div>
                  <strong className="text-white block mb-1">Mission</strong>
                  <TextReveal text="Our mission is to help brands communicate clearly and confidently in the digital world. We aim to create meaningful digital experiences that drive growth, consistency, and recognition for every brand we work with." delay={0.2} isReady={currentSlide === 1} />
                </div>
                <div>
                  <strong className="text-white block mb-1 mt-3">Vision</strong>
                  <TextReveal text="Our vision is to position Kreatify as a leading creative growth partner for modern businesses. We strive to set new standards in digital marketing by blending strategy, creativity, and technology to build brands that are future-ready and scalable." delay={0.4} isReady={currentSlide === 1} />
                </div>
              </div>

              <div className="pt-4">
                <Link 
                  href="/" 
                  className="inline-flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 border border-[#93c5fd]/30 px-8 py-4 text-xs font-bold uppercase tracking-wider text-white transition group cursor-pointer shadow-md shadow-black/20"
                >
                  <ArrowLeft className="h-4 w-4 transform transition-transform duration-300 group-hover:-translate-x-1 text-[#93c5fd]" />
                  <span>Return to Home</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.section>

      </div>
    </main>
  )
}
