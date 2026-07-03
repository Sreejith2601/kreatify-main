"use client"

import { useEffect, useState, useRef } from "react"
import { ParticleSphere } from "./particle-sphere"
import { Logo, MenuButton } from "./chrome"
import { X } from "lucide-react"

const SECTIONS = ["Home", "About", "Services", "Portfolio", "Contact"]

export const orbTransformRef = { current: { left: 50, top: 95, scale: 1.0 } }

export function Carousel() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Quintic smootherstep — zero velocity AND zero acceleration at endpoints
  const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)

  useEffect(() => {
    let animationId: number
    let targetProgress = 0
    let currentProgress = 0

    const handleScroll = () => {
      // Calculate scroll progress (0 to 1) based on the whole document
      const h = window.innerHeight
      const totalScroll = document.documentElement.scrollHeight - h
      targetProgress = totalScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / totalScroll)) : 0
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })

    const tick = () => {
      // Smoothly interpolate scroll progress for the orb
      const diff = targetProgress - currentProgress
      if (Math.abs(diff) > 0.0001) {
        currentProgress += diff * 0.08
      } else {
        currentProgress = targetProgress
      }

      // We map the full scroll (0 -> 1) to the orb's movement (p: 0 -> 1)
      const p = currentProgress

      // ── Update WebGL global scroll state (NO React re-render) ──
      let left = 50
      let top = 95
      let scale = 1.0

      if (p <= 0.25) {
        const t = p / 0.25
        const s = smootherstep(Math.min(1, Math.max(0, t)))
        left  = 50 - s * 65   // 50% → -15%
        top   = 95 - s * 90   // 95% → 5%
        scale = 1.0 + s * 0.15
      } else {
        left  = -15
        top   = 5
        scale = 1.15
      }

      orbTransformRef.current = { left, top, scale }

      animationId = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
      cancelAnimationFrame(animationId)
    }
  }, [])

  const navigateToSection = (index: number) => {
    setIsMenuOpen(false)
    const h = window.innerHeight
    window.scrollTo({
      top: index * h,
      behavior: "smooth",
    })
  }

  return (
    <main className="relative min-h-screen bg-mesh-gradient selection:bg-[#0D0D0D] selection:text-[#F5F0EB] font-sans" ref={containerRef}>
      
      {/* ── Fixed Background Orb ── */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ParticleSphere />
      </div>

      {/* ── Persistent Chrome Header ── */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex items-center justify-between px-6 py-4 md:px-8 pointer-events-auto bg-[#F5F0EB]/70 backdrop-blur-xl border-b border-[#C9B99A]/30 shadow-sm">
          <Logo />
          <MenuButton onClick={() => setIsMenuOpen(true)} />
        </div>
      </div>

      {/* ── Native Scrolling Sections ── */}
      <div className="relative z-10 flex flex-col w-full">
        
        {/* Section 1: Home (Centered Hero) */}
        <section className="relative flex min-h-[100svh] w-full items-center justify-center px-6 pt-20">
          <div className="w-full max-w-4xl text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-[#0D0D0D] md:text-7xl lg:text-8xl">
              Elevate Your Brand.<br />Empower Your Future.
            </h1>
          </div>
        </section>

        {/* Section 2: About (Right Aligned) */}
        <section className="relative flex min-h-[100svh] w-full items-center justify-end px-6 py-20 md:px-16 lg:px-24">
          <div className="w-full max-w-[500px] space-y-8 bg-transparent p-0 border-none shadow-none backdrop-blur-none">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7A6A]">
              Who We Are
            </span>
            <p className="text-2xl font-normal leading-relaxed text-[#0D0D0D]">
              In a noisy digital world, standing out requires more than just aesthetics—it requires strategy, innovation, and seamless execution.
            </p>
            <p className="text-2xl font-normal leading-relaxed text-[#3D3835]">
              At Kreatify, we merge creative vision with technical excellence to build brands that resonate and software that performs.
            </p>
          </div>
        </section>

        {/* Section 3: Services (Left Aligned) */}
        <section className="relative flex min-h-[100svh] w-full items-center justify-start px-6 py-20 md:px-16 lg:px-24">
          <div className="w-full max-w-[600px] space-y-8 bg-transparent p-0 border-none shadow-none backdrop-blur-none">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7A6A]">
              Our Expertise
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-[#0D0D0D] md:text-5xl">
              Services & Solutions
            </h2>
            <p className="text-lg text-[#3D3835] leading-relaxed">
              We partner with ambitious teams to build foundational identities, scalable software, and high-converting marketing engines.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-6 rounded-xl bg-[#FDFBF8]/60 border border-[#C9B99A]/30 shadow-sm backdrop-blur-sm transition duration-300 hover:bg-[#FDFBF8]/90 hover:scale-[1.02]">
                <h3 className="text-xl font-bold text-[#0D0D0D]">Brand Strategy</h3>
                <p className="text-base text-[#3D3835] mt-2 leading-relaxed">
                  Crafting unforgettable identities and visual design systems that capture your essence.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#FDFBF8]/60 border border-[#C9B99A]/30 shadow-sm backdrop-blur-sm transition duration-300 hover:bg-[#FDFBF8]/90 hover:scale-[1.02]">
                <h3 className="text-xl font-bold text-[#0D0D0D]">Digital Marketing</h3>
                <p className="text-base text-[#3D3835] mt-2 leading-relaxed">
                  Data-driven marketing campaigns, SEO, and paid media that turn audiences into loyal customers.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#FDFBF8]/60 border border-[#C9B99A]/30 shadow-sm backdrop-blur-sm transition duration-300 hover:bg-[#FDFBF8]/90 hover:scale-[1.02] md:col-span-2">
                <h3 className="text-xl font-bold text-[#0D0D0D]">Software Engineering</h3>
                <p className="text-base text-[#3D3835] mt-2 leading-relaxed">
                  Custom web applications, mobile apps, and scalable digital architectures engineered for speed.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Portfolio Showcase (Right Aligned) */}
        <section className="relative flex min-h-[100svh] w-full items-center justify-end px-6 py-20 md:px-16 lg:px-24">
          <div className="w-full max-w-[700px] space-y-8 bg-transparent p-0 border-none shadow-none backdrop-blur-none">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7A6A]">
              Featured Work
            </span>
            <h2 className="text-4xl font-semibold tracking-tight text-[#0D0D0D] md:text-5xl">
              Client Success Stories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="p-6 rounded-xl bg-[#FDFBF8]/60 border border-[#C9B99A]/30 shadow-sm backdrop-blur-sm transition duration-300 hover:bg-[#FDFBF8]/90 hover:scale-[1.02]">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[#0D0D0D]">Nexus E-Commerce</h3>
                  <span className="text-[10px] font-mono bg-[#C9B99A]/20 text-[#6B5B45] px-2.5 py-1 rounded border border-[#C9B99A]/40 font-semibold uppercase tracking-wider">Web App</span>
                </div>
                <p className="text-base text-[#3D3835] mt-3 leading-relaxed">
                  A complete digital storefront overhaul resulting in a 200% increase in sales.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#FDFBF8]/60 border border-[#C9B99A]/30 shadow-sm backdrop-blur-sm transition duration-300 hover:bg-[#FDFBF8]/90 hover:scale-[1.02]">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[#0D0D0D]">Lumina SaaS</h3>
                  <span className="text-[10px] font-mono bg-[#C9B99A]/20 text-[#6B5B45] px-2.5 py-1 rounded border border-[#C9B99A]/40 font-semibold uppercase tracking-wider">Software</span>
                </div>
                <p className="text-base text-[#3D3835] mt-3 leading-relaxed">
                  End-to-end product design and software architecture for a leading tech startup.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#FDFBF8]/60 border border-[#C9B99A]/30 shadow-sm backdrop-blur-sm transition duration-300 hover:bg-[#FDFBF8]/90 hover:scale-[1.02]">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[#0D0D0D]">Apex Retail</h3>
                  <span className="text-[10px] font-mono bg-[#C9B99A]/20 text-[#6B5B45] px-2.5 py-1 rounded border border-[#C9B99A]/40 font-semibold uppercase tracking-wider">Branding</span>
                </div>
                <p className="text-base text-[#3D3835] mt-3 leading-relaxed">
                  A massive rebranding and marketing campaign for a national retailer.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-[#FDFBF8]/60 border border-[#C9B99A]/30 shadow-sm backdrop-blur-sm transition duration-300 hover:bg-[#FDFBF8]/90 hover:scale-[1.02]">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-[#0D0D0D]">Velocity Media</h3>
                  <span className="text-[10px] font-mono bg-[#C9B99A]/20 text-[#6B5B45] px-2.5 py-1 rounded border border-[#C9B99A]/40 font-semibold uppercase tracking-wider">Marketing</span>
                </div>
                <p className="text-base text-[#3D3835] mt-3 leading-relaxed">
                  Targeted SEO and paid social campaigns driving record-breaking ROI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Contact Form (Centered) */}
        <section className="relative flex min-h-[100svh] w-full items-center justify-center px-6 py-20">
          <div className="w-full max-w-[600px] space-y-8 bg-[#FDFBF8]/50 p-8 md:p-12 backdrop-blur-md rounded-2xl border border-[#C9B99A]/30 shadow-lg">
            <div className="text-center space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8A7A6A]">
                Get In Touch
              </span>
              <h2 className="text-4xl font-semibold tracking-tight text-[#0D0D0D] md:text-5xl">
                Start Your Project
              </h2>
            </div>
            <form className="space-y-4 pt-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-[#F5F0EB]/70 border border-[#C9B99A]/40 text-[#0D0D0D] placeholder-[#8A7A6A] focus:outline-none focus:ring-2 focus:ring-[#0D0D0D] focus:border-[#0D0D0D] focus:bg-[#FDFBF8] transition"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full px-5 py-4 rounded-xl bg-[#F5F0EB]/70 border border-[#C9B99A]/40 text-[#0D0D0D] placeholder-[#8A7A6A] focus:outline-none focus:ring-2 focus:ring-[#0D0D0D] focus:border-[#0D0D0D] focus:bg-[#FDFBF8] transition"
                />
              </div>
              <div>
                <textarea
                  placeholder="Tell us about your project..."
                  required
                  rows={4}
                  className="w-full px-5 py-4 rounded-xl bg-[#F5F0EB]/70 border border-[#C9B99A]/40 text-[#0D0D0D] placeholder-[#8A7A6A] focus:outline-none focus:ring-2 focus:ring-[#0D0D0D] focus:border-[#0D0D0D] focus:bg-[#FDFBF8] transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-[#0D0D0D] px-5 py-4 text-sm font-bold uppercase tracking-wider text-[#F5F0EB] transition hover:bg-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#0D0D0D] focus:ring-offset-2"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* ── Fullscreen Glassmorphic Menu Overlay ── */}
      <div
        className={`fixed inset-0 bg-[#F5F0EB]/97 backdrop-blur-xl transition-all duration-300 ease-in-out flex flex-col justify-center items-center`}
        style={{
          zIndex: 100,
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
        }}
      >
        <button
          type="button"
          onClick={() => setIsMenuOpen(false)}
          className="absolute right-6 top-6 md:right-8 md:top-8 flex h-11 w-11 items-center justify-center rounded-lg bg-[#FDFBF8] text-[#0D0D0D] border border-[#C9B99A]/40 shadow-sm transition hover:bg-[#F5F0EB] cursor-pointer"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        <nav className="flex flex-col gap-6 text-center">
          {SECTIONS.map((section, index) => (
            <button
              key={section}
              onClick={() => navigateToSection(index)}
              className="text-4xl font-bold tracking-wider text-[#0D0D0D] hover:text-[#8A7A6A] hover:scale-105 transition duration-150 cursor-pointer uppercase"
            >
              {section}
            </button>
          ))}
        </nav>
      </div>
    </main>
  )
}
