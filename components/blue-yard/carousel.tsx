"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ParticleSphere } from "./particle-sphere"
import { motion } from "framer-motion"
import { Logo, MenuButton } from "@/components/blue-yard/chrome"
import MagneticButton from "@/components/magnetic-button"
import TextHighlighter from "@/components/ui/text-highlighter"
import TextReveal from "@/components/ui/text-reveal"
import { X, Target, Sparkles, Cpu, Layers, TrendingUp, Code2, ArrowRight } from "lucide-react"
import { CSSTransition, TransitionGroup } from "react-transition-group"
import "./carousel.css"

const SECTIONS = ["Home", "Vision", "Connect"]

const ABOUT_TABS = [
  {
    title: "Strategy",
    icon: Target,
    tagline: "Insight-driven pathways",
    description: "In a noisy digital world, standing out requires more than just aesthetics. We define clarity, analyze landscape, and craft pathways that allow your brand to rise above the noise and engage meaningfully.",
  },
  {
    title: "Design",
    icon: Sparkles,
    tagline: "Elegant visual poetry",
    description: "We merge creative vision with professional style. We build responsive, stunning layouts, select premium typography, and add subtle micro-interactions to create a flawless user journey.",
  },
  {
    title: "Technology",
    icon: Cpu,
    tagline: "Scalable performance architecture",
    description: "We engineer robust, custom web applications and scalable digital solutions. Optimized for speed, reliability, and security, our codebases are built to withstand tomorrow's scale.",
  },
]

const SERVICES_DATA = [
  {
    number: "01",
    title: "Brand Strategy",
    icon: Layers,
    path: "brand-strategy",
    description: "Build memorable identities that customers instantly recognize.",
    capabilities: [
      "Identity Design",
      "Brand Positioning",
      "Logo Systems",
      "Packaging Design",
      "Brand Guidelines",
      "Visual Language"
    ]
  },
  {
    number: "02",
    title: "Digital Marketing",
    icon: TrendingUp,
    path: "digital-marketing",
    description: "Data-driven growth strategies that convert attention into loyalty.",
    capabilities: [
      "SEO & Optimization",
      "Paid Advertising",
      "Social Media Growth",
      "Email Marketing",
      "Analytics & Reporting",
      "Growth Strategy"
    ]
  },
  {
    number: "03",
    title: "Software Solutions",
    icon: Code2,
    path: "software-solutions",
    description: "High-performance digital products engineered to scale smoothly.",
    capabilities: [
      "Web Applications",
      "Custom CRM Platforms",
      "API Development",
      "Dashboard Systems",
      "Cloud Integration",
      "AI Automation"
    ]
  },
  {
    number: "04",
    title: "Content Creation",
    icon: Sparkles,
    path: "content-creation",
    description: "Compelling visual storytelling that brings your brand vision to life.",
    capabilities: [
      "Photography",
      "Videography",
      "Motion Graphics",
      "Copywriting",
      "Product Content",
      "Creative Campaigns"
    ]
  }
]

export const orbTransformRef = { current: { left: 50, top: 50, scale: 1.0 } }

interface CarouselProps {
  isReady?: boolean;
}

export function Carousel({ isReady = true }: CarouselProps) {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMoving, setIsMoving] = useState(false)
  const isTransitioning = useRef(true) // Lock on mount
  
  // Prevent scroll inertia on load and prefetch next route
  useEffect(() => {
    router.prefetch("/about")
    
    // Check initial hash
    if (window.location.hash === "#contact") {
      setCurrentSlide(2)
    }

    const handleHashChange = () => {
      if (window.location.hash === "#contact") {
        setCurrentSlide(2)
      } else if (window.location.hash === "") {
        setCurrentSlide(0)
      }
    }
    window.addEventListener("hashchange", handleHashChange)
    
    const timer = setTimeout(() => {
      isTransitioning.current = false
    }, 1200)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener("hashchange", handleHashChange)
    }
  }, [router])

  // Touch tracking for mobile swipe support
  const touchStart = useRef(0)

  // Track slide transition timing to show/hide wave borders dynamically
  useEffect(() => {
    setIsMoving(true)
    const timer = setTimeout(() => {
      setIsMoving(false)
    }, 700) // Start fading out before the slide completely stops to prevent lag
    return () => clearTimeout(timer)
  }, [currentSlide])
  
  // Smoothly animate the orb based on active slide (matching the slide transition curve and duration)
  useEffect(() => {
    let animationId: number
    let target = { left: 50, top: 50, scale: 1.0 }
    
    const isMobile = window.innerWidth < 768
    
    if (currentSlide === 0) {
      target = { left: isMobile ? 50 : 78, top: isMobile ? 85 : 50, scale: isMobile ? 0.6 : 0.9 }
    } else if (currentSlide === 1) {
      target = { left: 85, top: 25, scale: 0.75 }
    } else if (currentSlide === 2) {
      target = { left: 15, top: 75, scale: 0.75 }
    }

    const startTime = performance.now()
    const startLeft = orbTransformRef.current.left
    const startTop = orbTransformRef.current.top
    const startScale = orbTransformRef.current.scale
    const DURATION = 1200 // Matches slide transition duration

    const tick = () => {
      const elapsed = performance.now() - startTime
      const p = Math.min(1, elapsed / DURATION)
      
      // Buttery smooth easeInOutCubic curve
      const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2

      orbTransformRef.current = {
        left: startLeft + (target.left - startLeft) * eased,
        top: startTop + (target.top - startTop) * eased,
        scale: startScale + (target.scale - startScale) * eased
      }

      if (p < 1) {
        animationId = requestAnimationFrame(tick)
      }
    }
    
    tick()
    return () => cancelAnimationFrame(animationId)
  }, [currentSlide])

  // Scroll down to navigate to About page
  useEffect(() => {
    const handleWindowWheel = (e: WheelEvent) => {
      if (isTransitioning.current || isExiting) return
      if (e.deltaY > 15) {
        setIsExiting(true)
        setTimeout(() => {
          router.push("/about")
        }, 300)
      }
    }

    let touchStartY = 0
    const handleWindowTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const handleWindowTouchEnd = (e: TouchEvent) => {
      if (isTransitioning.current || isExiting) return
      const diff = touchStartY - e.changedTouches[0].clientY
      if (diff > 30) {
        setIsExiting(true)
        setTimeout(() => {
          router.push("/about")
        }, 300)
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
  }, [isExiting, router])

  const navigateToSection = (index: number) => {
    setIsMenuOpen(false)
    if (index >= 0 && index <= 2) {
      setCurrentSlide(index)
    }
  }

  return (
    <main 
      className="relative w-screen h-screen overflow-hidden bg-black selection:bg-white/20 selection:text-white font-sans"
    >
      <style>{`
        @keyframes waveMoveVertical {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-wave-vertical {
          animation: waveMoveVertical 12s linear infinite;
        }
      `}</style>

      {/* ── Background Gradients/Images Slider (Layer 1 - behind orb) ── */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        
        {/* Slide 1: Dark Elegant Backdrop */}
        <motion.div 
          className="absolute flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0d0806] overflow-hidden rounded-3xl"
          initial={false}
          animate={!isExiting ? {
            rotate: 0, width: '100%', height: '100%', x: 0, y: 0, zIndex: 1, opacity: 1, borderRadius: '0%'
          } : {
            rotate: -90, width: '20%', height: '20%', x: 200, y: 200, zIndex: -1, opacity: 0, borderRadius: '24px'
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle warm vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a0d05]/20 via-transparent to-[#1a0d05]/10" />
        </motion.div>
      </div>

      {/* ── Fixed Background Orb (Layer 2 - middle) ── */}
      <motion.div 
        className="fixed inset-0 pointer-events-none" 
        style={{ zIndex: 10 }}
        initial={false}
        animate={!isExiting ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <ParticleSphere />
      </motion.div>

      {/* ── Persistent Chrome Header ── */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between w-full px-6 md:px-8 py-4 pointer-events-auto backdrop-blur-md border-b border-[#B87333]/15 bg-black/30">
          <Logo className="pointer-events-auto select-none text-[16px] font-bold leading-[1.05] tracking-[0.25em] text-[#D4A574]" style={{ fontFamily: 'var(--font-cormorant-garamond)' }} />
          
          {/* Persistent CTA Button */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => navigateToSection(0)}
              className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70 hover:text-[#D4A574] transition-colors duration-1000 cursor-pointer"
            >
              Home
            </button>
            <Link 
              href="/about"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70 hover:text-[#D4A574] transition-colors duration-1000 cursor-pointer"
            >
              About
            </Link>
            <Link 
              href="/services"
              className="text-xs font-semibold uppercase tracking-[0.15em] text-white/70 hover:text-[#D4A574] transition-colors duration-1000 cursor-pointer"
            >
              Services
            </Link>
            <button
              onClick={() => navigateToSection(2)}
              className="uiverse-btn"
              style={{ "--bg": "linear-gradient(to right, #2a1506, #4a2810)" } as React.CSSProperties}
            >
              <span className="wrap text-white" style={{ padding: "8px 20px", fontSize: "10px" }}>
                <p>
                  <span>Get In Touch</span>
                </p>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Foreground Content Slider (Layer 3 - top layer) ── */}
      <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none bg-transparent">
        
        {/* Slide 1: Home (Centered Hero) */}
        <motion.section 
          id="home" 
          className="absolute flex items-center justify-center px-6 pointer-events-auto"
          initial={false}
          animate={(!isExiting && currentSlide === 0) ? {
            rotate: 0, width: '100%', height: '100%', x: 0, y: 0, zIndex: 1, opacity: 1
          } : {
            rotate: currentSlide > 0 ? 45 : -45, width: '80%', height: '80%', x: currentSlide > 0 ? -200 : 200, y: 0, zIndex: -1, opacity: 0
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full text-left flex flex-col items-start justify-center space-y-4 md:space-y-6 pl-4 sm:pl-8 md:pl-16 lg:pl-24 pt-16 md:pt-0">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl leading-[0.95] text-white/80">
              <span className="font-sans font-bold uppercase tracking-[0.05em] block"><TextReveal text="Elevate" delay={0.1} isReady={isReady} /></span>
              <span className="font-sans font-bold uppercase tracking-[0.05em] block"><TextReveal text="Empower" delay={0.3} isReady={isReady} /></span>
            </h1>
            
            {/* Divider line */}
            <div className="w-32 h-[1px] bg-[#D4A574]/40" />

            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
              <TextHighlighter highlightColor="linear-gradient(135deg, rgba(184,115,51,0.15), rgba(184,115,51,0.08))" direction="ltr" transition={{ duration: 0.8, delay: 0.8, type: 'ease' }} isReady={isReady}>
                <span className="relative inline-block px-5 py-1 rounded-lg border border-white/10 backdrop-blur-md" style={{ fontFamily: 'var(--font-cormorant-garamond)', background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))' }}>
                  <span className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, transparent 100%)' }} />
                  <span className="relative italic font-medium text-[#D4A574]"><TextReveal text="Your Brand." delay={0.5} isReady={isReady} /></span>
                </span>
              </TextHighlighter>
              <br />
              <TextHighlighter highlightColor="linear-gradient(135deg, rgba(184,115,51,0.15), rgba(184,115,51,0.08))" direction="ltr" transition={{ duration: 0.8, delay: 1.2, type: 'ease' }} isReady={isReady}>
                <span className="relative inline-block px-5 py-1 mt-2 rounded-lg border border-white/10 backdrop-blur-md" style={{ fontFamily: 'var(--font-cormorant-garamond)', background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))' }}>
                  <span className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, transparent 100%)' }} />
                  <span className="relative italic font-medium text-[#D4A574]"><TextReveal text="Your Future." delay={0.7} isReady={isReady} /></span>
                </span>
              </TextHighlighter>
            </div>

            <div className="pt-2">
              <MagneticButton
                onClick={() => navigateToSection(2)}
                className="uiverse-btn"
                style={{ "--bg": "linear-gradient(to right, #2a1506, #4a2810)" } as React.CSSProperties}
              >
                <span className="wrap text-white">
                  <p>
                    <span>Get In Touch</span>
                    <span className="flex items-center gap-1">Contact Us <span className="text-[12px] font-sans font-bold">→</span></span>
                  </p>
                </span>
              </MagneticButton>
            </div>
          </div>
        </motion.section>

        {/* Slide 3: Connect (Premium Contact Form) */}
        <motion.section 
          id="connect" 
          className="absolute flex items-center justify-center px-4 md:px-6 pointer-events-auto w-full h-full"
          initial={false}
          animate={(!isExiting && currentSlide === 2) ? {
            rotate: 0, width: '100%', height: '100%', x: 0, y: 0, zIndex: 1, opacity: 1
          } : {
            rotate: currentSlide < 2 ? -45 : 45, width: '80%', height: '80%', x: currentSlide < 2 ? 200 : -200, y: 0, zIndex: -1, opacity: 0
          }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column: Typography & Info */}
            <div className="space-y-6 md:space-y-8 pl-0 md:pl-4 pt-16 md:pt-0">
              <h2 className="text-3xl sm:text-4xl md:text-6xl text-[#D4A574] leading-tight">
                <span className="font-sans font-bold uppercase tracking-[0.05em] block text-lg mb-2 text-white/50"><TextReveal text="Connect With Us" delay={0.1} isReady={isReady} /></span>
                <span style={{ fontFamily: 'var(--font-cormorant-garamond)' }} className="italic font-medium"><TextReveal text="Let's craft" delay={0.3} isReady={isReady} /></span><br />
                <TextHighlighter highlightColor="linear-gradient(to right, rgba(184,115,51,0.2), rgba(184,115,51,0.1))" direction="ltr" transition={{ duration: 0.8, delay: 1.0, type: 'ease' }} isReady={isReady}>
                  <span className="font-sans font-bold uppercase tracking-tight text-white/80"><TextReveal text="Something Extraordinary" delay={0.5} isReady={isReady} /></span>
                </TextHighlighter>
              </h2>
              
              <div className="space-y-4 text-white/60 font-sans text-sm md:text-base">
                <p className="max-w-sm leading-relaxed">
                  Whether you're looking to redefine your brand, launch a new digital product, or scale your marketing efforts, our team is ready to collaborate.
                </p>
                <div className="flex flex-col gap-2 pt-4 border-t border-[#B87333]/20 max-w-xs">
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B87333]"></span> hello@kreatify.agency</span>
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B87333]"></span> +1 (555) 123-4567</span>
                  <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#B87333]"></span> New York & London</span>
                </div>
              </div>
            </div>

            {/* Right Column: Premium Glass Form */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#B87333]/20 to-[#B87333]/5 rounded-[32px] blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-[32px] p-8 md:p-10 space-y-6">
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-[#D4A574] uppercase">First Name</label>
                    <input type="text" className="w-full bg-white/5 border-b border-[#B87333]/30 px-3 py-2 text-white/90 focus:outline-none focus:border-[#D4A574] focus:bg-white/10 transition-all rounded-t-md placeholder:text-white/30" placeholder="Jane" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold tracking-widest text-[#D4A574] uppercase">Last Name</label>
                    <input type="text" className="w-full bg-white/5 border-b border-[#B87333]/30 px-3 py-2 text-white/90 focus:outline-none focus:border-[#D4A574] focus:bg-white/10 transition-all rounded-t-md placeholder:text-white/30" placeholder="Doe" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-[#D4A574] uppercase">Email Address</label>
                  <input type="email" className="w-full bg-white/5 border-b border-[#B87333]/30 px-3 py-2 text-white/90 focus:outline-none focus:border-[#D4A574] focus:bg-white/10 transition-all rounded-t-md placeholder:text-white/30" placeholder="jane@example.com" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold tracking-widest text-[#D4A574] uppercase">Project Details</label>
                  <textarea rows={4} className="w-full bg-white/5 border-b border-[#B87333]/30 px-3 py-2 text-white/90 focus:outline-none focus:border-[#D4A574] focus:bg-white/10 transition-all rounded-t-md resize-none placeholder:text-white/30" placeholder="Tell us about your vision..." />
                </div>

                <div className="pt-4">
                  <button className="w-full py-4 bg-[#B87333] hover:bg-[#CD7F32] text-white rounded-xl text-xs font-bold uppercase tracking-widest transition-colors shadow-lg hover:shadow-xl shadow-[#B87333]/20">
                    Send Inquiry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  )
}
