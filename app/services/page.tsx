"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/blue-yard/chrome"
import { motion } from "framer-motion"
import { ArrowRight, Layers, TrendingUp, Code2, Sparkles } from "lucide-react"
import { ParticleSphere } from "@/components/blue-yard/particle-sphere"
import TextReveal from "@/components/ui/text-reveal"

const SLIDES = [
  {
    number: "01",
    title: "Brand Strategy",
    tagline: "Establish Authority",
    description:
      "Build memorable identities that customers instantly recognize. We craft premium brand frameworks — from visual identity to voice — that command trust and stand the test of time.",
    icon: Layers,
    path: "brand-strategy",
    bgClass: "bg-[#0f0714]",
    style: { backgroundImage: "radial-gradient(at 0% 0%, #2e103c 0px, transparent 65%), radial-gradient(at 100% 100%, #1e0926 0px, transparent 65%), radial-gradient(at 30% 80%, rgba(212, 165, 116, 0.15) 0px, transparent 70%)" }, // Deep Amethyst & Champagne
    accent: "#111827",
    btnTextColor: "text-white",
    capabilities: ["Identity Design", "Brand Positioning", "Logo Systems", "Packaging Design", "Brand Guidelines", "Visual Language"],
    image: "/branding_magnifier_nobg.webp",
    blendMode: "", // Removed mix-blend-multiply for dark backgrounds
    rotateHover: 1,
  },
  {
    number: "02",
    title: "Digital Marketing",
    tagline: "Accelerate Engagement",
    description:
      "Data-driven growth strategies that convert attention into loyalty. From SEO to paid social, we engineer campaigns that turn clicks into customers and customers into advocates.",
    icon: TrendingUp,
    path: "digital-marketing",
    bgClass: "bg-[#041113]", 
    style: { backgroundImage: "radial-gradient(at 0% 100%, #082f34 0px, transparent 65%), radial-gradient(at 100% 0%, #064047 0px, transparent 65%), radial-gradient(at 70% 80%, rgba(20, 184, 166, 0.15) 0px, transparent 70%)" }, // Deep Obsidian & Teal
    accent: "#0D9488",
    capabilities: ["SEO & Optimization", "Paid Advertising", "Social Media Growth", "Email Marketing", "Analytics & Reporting", "Growth Strategy"],
    image: "/digital_marketing_nobg.webp",
    blendMode: "",
    rotateHover: -1,
  },
  {
    number: "03",
    title: "Software Solutions",
    tagline: "Engineer Innovation",
    description:
      "High-performance digital products engineered to scale smoothly. We build robust web applications, custom platforms, and cloud-native systems that are fast, secure, and future-ready.",
    icon: Code2,
    path: "software-solutions",
    bgClass: "bg-[#180a04]", 
    style: { backgroundImage: "radial-gradient(at 100% 100%, #3d1b09 0px, transparent 65%), radial-gradient(at 0% 0%, #59250b 0px, transparent 65%), radial-gradient(at 20% 80%, rgba(210, 115, 58, 0.15) 0px, transparent 70%)" }, // Midnight Copper
    accent: "#D2733A",
    btnTextColor: "text-white",
    capabilities: ["Web Applications", "Custom CRM Platforms", "API Development", "Dashboard Systems", "Cloud Integration", "AI Automation"],
    image: "/software_nobg.webp",
    blendMode: "",
    rotateHover: 1,
  },
  {
    number: "04",
    title: "Content Creation",
    tagline: "Tell Unforgettable Stories",
    description:
      "Compelling visual storytelling that brings your brand vision to life. Photography, videography, motion graphics, and copy that resonates deeply and drives real engagement.",
    icon: Sparkles,
    path: "content-creation",
    bgClass: "bg-[#1f060a]", 
    style: { backgroundImage: "radial-gradient(at 0% 100%, #4a0d17 0px, transparent 65%), radial-gradient(at 100% 0%, #6d1020 0px, transparent 65%), radial-gradient(at 50% 50%, rgba(244, 63, 94, 0.15) 0px, transparent 70%)" }, // Deep Crimson & Rose
    accent: "#E11D48",
    capabilities: ["Photography", "Videography", "Motion Graphics", "Copywriting", "Product Content", "Creative Campaigns"],
    image: "/content_nobg.webp",
    blendMode: "",
    rotateHover: -1,
  },
]

const TOTAL = SLIDES.length

export default function ServicesPage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isExitingTo, setIsExitingTo] = useState<"" | "about" | "contact">("")
  const isTransitioning = useRef(true) // Lock on mount

  // Prevent scroll inertia on load and prefetch next route
  useEffect(() => {
    router.prefetch("/about")
    router.prefetch("/#contact")

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "")
      if (hash) {
        const idx = SLIDES.findIndex(s => s.path === hash)
        if (idx !== -1) {
          setCurrentSlide(idx)
        }
      }
    }

    // Check initial hash on mount
    handleHashChange()
    window.addEventListener("hashchange", handleHashChange)

    const timer = setTimeout(() => {
      isTransitioning.current = false
    }, 1200)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [router])

  // Sync URL hash with current slide
  useEffect(() => {
    if (SLIDES[currentSlide]) {
      router.replace(`/services#${SLIDES[currentSlide].path}`, { scroll: false })
    }
  }, [currentSlide, router])

  useEffect(() => {
    const handleWindowWheel = (e: WheelEvent) => {
      if (isTransitioning.current) return
      if (Math.abs(e.deltaY) < 15) return

      if (e.deltaY > 0) {
        if (currentSlide < TOTAL - 1) {
          setCurrentSlide(prev => prev + 1)
          isTransitioning.current = true
          setTimeout(() => { isTransitioning.current = false }, 800)
        } else {
          setIsExitingTo("contact")
          setTimeout(() => { router.push("/#contact") }, 300)
        }
      } else {
        if (currentSlide > 0) {
          setCurrentSlide(prev => prev - 1)
          isTransitioning.current = true
          setTimeout(() => { isTransitioning.current = false }, 800)
        } else {
          setIsExitingTo("about")
          setTimeout(() => { router.push("/about") }, 300)
        }
      }
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning.current) return
      const diff = touchStartY - e.changedTouches[0].clientY
      if (Math.abs(diff) < 30) return
      if (diff > 0) {
        if (currentSlide < TOTAL - 1) {
          setCurrentSlide(prev => prev + 1)
          isTransitioning.current = true
          setTimeout(() => { isTransitioning.current = false }, 800)
        } else {
          setIsExitingTo("contact")
          setTimeout(() => { router.push("/#contact") }, 300)
        }
      } else if (diff < 0) {
        if (currentSlide > 0) {
          setCurrentSlide(prev => prev - 1)
          isTransitioning.current = true
          setTimeout(() => { isTransitioning.current = false }, 800)
        } else {
          setIsExitingTo("about")
          setTimeout(() => { router.push("/about") }, 300)
        }
      }
    }

    window.addEventListener("wheel", handleWindowWheel, { passive: true })
    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchend", handleTouchEnd, { passive: true })
    return () => {
      window.removeEventListener("wheel", handleWindowWheel)
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [currentSlide])

  return (
    <main className="relative w-screen h-screen overflow-hidden font-sans bg-black selection:bg-white/20 selection:text-white">

      {/* ── Background Colors (Layer 0) ── */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        {SLIDES.map((slide, i) => (
          <motion.div
            key={slide.number}
            className={`absolute w-full h-full ${slide.bgClass}`}
            style={slide.style}
            initial={false}
            animate={currentSlide === i && !isExitingTo ? {
              rotate: 0, width: "100%", height: "100%", x: 0, y: 0, zIndex: 1, opacity: 1, borderRadius: "0%"
            } : isExitingTo === "about" ? {
              rotate: 90, width: "20%", height: "20%", x: -200, y: -200, zIndex: -1, opacity: 0, borderRadius: "24px"
            } : isExitingTo === "contact" ? {
              rotate: -90, width: "20%", height: "20%", x: 200, y: 200, zIndex: -1, opacity: 0, borderRadius: "24px"
            } : (currentSlide < i ? {
              rotate: -90, width: "20%", height: "20%", x: 200, y: 200, zIndex: -1, opacity: 0, borderRadius: "24px"
            } : {
              rotate: 90, width: "20%", height: "20%", x: -200, y: -200, zIndex: -1, opacity: 0, borderRadius: "24px"
            })}
            transition={{ duration: 0.6 }}
          />
        ))}
      </div>

      {/* ── Persistent Chrome Header ── */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between w-full px-6 md:px-8 py-4 pointer-events-auto border-b border-white/10 shadow-sm backdrop-blur-md bg-black/10">
          <Link href="/">
            <Logo className="text-white" />
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60 hover:text-white transition cursor-pointer"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-xs font-semibold uppercase tracking-[0.15em] text-white/60 hover:text-white transition cursor-pointer"
              >
                About
              </Link>
              <button
                onClick={() => setCurrentSlide(0)}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-white hover:text-white transition cursor-pointer"
              >
                Services
              </button>
            </div>
            {/* Dot indicators */}
            <div className="flex items-center gap-2">
              {SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    currentSlide === idx ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <Link
              href="/#contact"
              className="uiverse-btn pointer-events-auto"
              style={{ "--bg": "linear-gradient(to right, #000000, #3f3f46)" } as React.CSSProperties}
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

      {/* ── Foreground Slides (Layer 2) ── */}
      <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
        {SLIDES.map((slide, i) => {
          const Icon = slide.icon
          return (
            <motion.section
              key={slide.number}
              className="absolute flex w-full h-full px-4 sm:px-6 md:px-12 lg:px-24 pointer-events-auto overflow-y-auto overflow-x-hidden"
              initial={false}
              animate={currentSlide === i && !isExitingTo ? {
                rotate: 0, width: "100%", height: "100%", x: 0, y: 0, zIndex: 1, opacity: 1
              } : isExitingTo === "about" ? {
                rotate: 90, width: "20%", height: "20%", x: -200, y: -200, zIndex: -1, opacity: 0
              } : isExitingTo === "contact" ? {
                rotate: -90, width: "20%", height: "20%", x: 200, y: 200, zIndex: -1, opacity: 0
              } : (currentSlide < i ? {
                rotate: -90, width: "20%", height: "20%", x: 200, y: 200, zIndex: -1, opacity: 0
              } : {
                rotate: 90, width: "20%", height: "20%", x: -200, y: -200, zIndex: -1, opacity: 0
              })}
              transition={{ duration: 0.6 }}
            >
              <div className="w-full min-h-full mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-24">

                {/* Left: Text */}
                <div className="lg:col-span-5 space-y-6">


                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-tight">
                    <TextReveal text={slide.title} isReady={currentSlide === i} />
                  </h1>

                  <div className="text-base md:text-lg text-white/60 leading-relaxed max-w-xl">
                    <TextReveal text={slide.description} delay={0.3} isReady={currentSlide === i} />
                  </div>

                  <Link
                    href={`/services/${slide.path}`}
                    className="uiverse-btn"
                    style={{ "--bg": slide.accent } as React.CSSProperties}
                  >
                    <span className="wrap" style={{ color: slide.btnTextColor === 'text-white' ? '#fff' : '#000' }}>
                      <p>
                        <span>Explore Service</span>
                        <span className="flex items-center gap-1">Let's Go <ArrowRight className="h-3.5 w-3.5" /></span>
                      </p>
                    </span>
                  </Link>
                </div>

                {/* Right: Responsive custom slide illustration */}
                <div className="lg:col-span-7 flex justify-center w-full">
                  <motion.img 
                    src={slide.image} 
                    alt={slide.title} 
                    className={`w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl object-contain cursor-pointer select-none ${slide.blendMode || ''}`}
                    whileHover={{ scale: 1.05, y: -10, rotate: slide.rotateHover }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  />
                </div>
              </div>
            </motion.section>
          )
        })}
      </div>

      {/* Slide counter */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 text-xs font-mono text-white/30 tracking-widest uppercase select-none">
        {String(currentSlide + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </div>
    </main>
  )
}
