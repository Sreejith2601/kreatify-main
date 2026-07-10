"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/blue-yard/chrome"
import { ParticleSphere } from "@/components/blue-yard/particle-sphere"
import { orbTransformRef } from "@/components/blue-yard/carousel"
import { ArrowLeft, ArrowRight, ExternalLink, Image as ImageIcon, PlayCircle } from "lucide-react"

const PORTFOLIO_DETAIL_DATA: Record<string, {
  title: string
  tag: string
  description: string
  badges: string[]
  monogram: string
  fullDescription: string
  liveUrl: string
}> = {
  "castelion": {
    title: "Castelion", tag: "CASTELION", badges: ["EXIT"], monogram: "Cs",
    description: "Rebranding and deep identity design for an aerospace leader.",
    fullDescription: "We overhauled Castelion's entire visual identity to align with their cutting-edge aerospace innovations. This included a rigorous logo redesign, brand guidelines, and an interactive digital presence that communicates precision and speed.",
    liveUrl: "#"
  },
  "chemify": {
    title: "Chemify", tag: "CHEMIFY", badges: ["PRIOR WORK"], monogram: "Ch",
    description: "Minimalist brand development and visual guidelines for automated chemistry.",
    fullDescription: "Chemify required a brand language that felt both scientifically rigorous and approachable. We delivered a clean, minimalist identity system, complete with bespoke iconography and a custom web application interface for their automated chemistry platform.",
    liveUrl: "#"
  },
  "groq": {
    title: "Groq", tag: "GROQ", badges: ["EXIT", "PRIOR WORK"], monogram: "Gq",
    description: "Web experience architecture and brand positioning for fast AI hardware.",
    fullDescription: "For Groq, we engineered a high-performance web experience to match their high-speed AI hardware. The project involved deep structural architecture, brand positioning, and the creation of highly technical 3D product visualizations.",
    liveUrl: "#"
  },
  "corintis": {
    title: "Corintis", tag: "CORINTIS", badges: ["EXIT"], monogram: "Cr",
    description: "Custom UI dashboard and brand assets for liquid cooling solutions.",
    fullDescription: "We designed a comprehensive UI dashboard for Corintis to monitor their advanced liquid cooling systems. Alongside the software interface, we developed a cohesive brand asset library that highlights their sustainable and high-tech approach.",
    liveUrl: "#"
  },
  "filecoin": {
    title: "Filecoin", tag: "FILECOIN", badges: ["EXIT"], monogram: "Fc",
    description: "Identity system and decentralized web platform development.",
    fullDescription: "Working with Filecoin, we crafted a robust identity system tailored for the Web3 space. We designed and developed their core decentralized web platforms, focusing on accessibility, clear documentation, and community engagement.",
    liveUrl: "#"
  },
  "ionq": {
    title: "Ionq", tag: "IONQ", badges: ["EXIT", "PRIOR WORK"], monogram: "Iq",
    description: "Design engineering systems for quantum hardware.",
    fullDescription: "IonQ needed a design system as sophisticated as their quantum computers. We built a scalable engineering design system that unified their software interfaces and marketing materials, ensuring a consistent, futuristic brand experience.",
    liveUrl: "#"
  },
  "flashbots": {
    title: "Flashbots", tag: "FLASHBOTS", badges: ["EXIT"], monogram: "Fb",
    description: "Product interface strategy and brand logo systems.",
    fullDescription: "We helped Flashbots establish a distinct visual identity within the blockchain ecosystem. Our work included a complete logo system redesign and a strategic overhaul of their product interfaces to improve user trust and clarity.",
    liveUrl: "#"
  },
  "harmattan-ai": {
    title: "Harmattan AI", tag: "HARMATTAN AI", badges: ["PRIOR WORK"], monogram: "Ha",
    description: "Strategic marketing direction and AI branding collateral.",
    fullDescription: "For Harmattan AI, we provided strategic marketing direction and produced a suite of premium branding collateral. The project focused on positioning them as thought leaders in AI through clean, authoritative design and targeted messaging.",
    liveUrl: "#"
  },
  "parloa": {
    title: "Parloa", tag: "PARLOA", badges: ["PRIOR WORK"], monogram: "Pa",
    description: "SaaS interface guidelines and visual identity system.",
    fullDescription: "We defined the SaaS interface guidelines for Parloa, ensuring a seamless user experience across their conversational AI platform. Our visual identity work brought a fresh, modern aesthetic that stands out in the B2B software market.",
    liveUrl: "#"
  },
  "privy": {
    title: "Privy", tag: "PRIVY", badges: ["EXIT"], monogram: "Pr",
    description: "Brand identity systems and front-end interface framework design.",
    fullDescription: "Privy partnered with us to design their brand identity system and architect their front-end interface framework. The result is a highly polished, developer-friendly platform that seamlessly integrates into modern web applications.",
    liveUrl: "#"
  },
  "peak-games": {
    title: "Peak Games", tag: "PEAK GAMES", badges: ["EXIT"], monogram: "Pk",
    description: "Dynamic creative campaign and visual rebranding assets.",
    fullDescription: "We launched a dynamic creative campaign for Peak Games, accompanied by a complete set of visual rebranding assets. The project injected vibrant energy into their brand, helping them connect with a broader, more engaged audience.",
    liveUrl: "#"
  },
  "marvel-fusion": {
    title: "Marvel Fusion", tag: "MARVEL FUSION", badges: ["PRIOR WORK"], monogram: "Mf",
    description: "Technical branding and high-end agency visual styles.",
    fullDescription: "Marvel Fusion required technical branding that communicated the complexity of fusion energy while maintaining a high-end agency aesthetic. We developed a visual style that balances scientific accuracy with compelling, premium design.",
    liveUrl: "#"
  }
}

export default function PortfolioDetail() {
  const params = useParams()
  const id = params?.id as string
  const project = PORTFOLIO_DETAIL_DATA[id]

  const [isScrolled, setIsScrolled] = useState(false)

  // Align particle orb to top-right corner on subpage load
  useEffect(() => {
    orbTransformRef.current = { left: -15, top: 5, scale: 1.15 }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-mesh-gradient p-6 text-center">
        <h1 className="text-3xl font-bold text-[#E4E9E9]">Project Not Found</h1>
        <p className="mt-2 text-[#C4CCCC] font-sans">The requested portfolio project could not be located.</p>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#E4E9E9] border border-white/15 px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#15475A] transition hover:bg-white/20 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Return Home
        </Link>
      </div>
    )
  }

  return (
    <main className="relative min-h-screen bg-mesh-gradient font-sans pb-24">
      {/* Background 3D Orb */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ParticleSphere />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className={`flex items-center justify-between w-full px-6 md:px-8 pointer-events-auto transition-all duration-300 border-b ${
          isScrolled 
            ? "py-3 bg-white/5 border-white/10 shadow-sm backdrop-blur-md" 
            : "py-5 bg-transparent border-transparent backdrop-blur-none"
        }`}>
          <Link href="/">
            <Logo />
          </Link>
          <Link href="/" className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-white/5 border border-white/10 text-xs font-bold uppercase tracking-wider text-[#E4E9E9] transition hover:bg-white/15 hover:scale-105 shadow-sm backdrop-blur-md">
            Close Project <span className="ml-2">✕</span>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-40 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
        <Link href="/#portfolio" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A9B2B2] hover:text-white transition mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to Portfolio
        </Link>
        
        <div className="space-y-6 max-w-3xl">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full uppercase">
              {project.tag}
            </span>
            {project.badges.map((badge) => (
              <span key={badge} className="text-[10px] font-mono font-bold tracking-widest text-[#C4CCCC] bg-white/5 px-3 py-1 rounded-full uppercase border border-white/10">
                {badge}
              </span>
            ))}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-heading font-medium italic text-[#E4E9E9] leading-tight">
            {project.title}
          </h1>
          <p className="text-xl md:text-2xl text-[#C4CCCC] font-sans leading-relaxed max-w-2xl">
            {project.description}
          </p>
          
          <div className="pt-6 flex flex-wrap gap-4">
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6EE7F9] via-[#4F46E5] to-[#C084FC] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_0_24px_rgba(110,231,249,0.3)] shadow-md">
              <span>Visit Live Website</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Media & Content Gallery */}
      <div className="relative z-10 mt-24 px-6 md:px-12 lg:px-16 max-w-7xl mx-auto space-y-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-2xl font-heading font-medium text-[#E4E9E9]">Project Overview</h3>
            <p className="text-[#C4CCCC] leading-relaxed">
              {project.fullDescription}
            </p>
            <div className="pt-6 border-t border-white/10">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A9B2B2] mb-4">Core Deliverables</p>
              <ul className="space-y-3">
                {["Visual Identity", "Web Application", "Brand Guidelines", "Motion Assets"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#E4E9E9]">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="lg:col-span-2 space-y-8">
            {/* Main Video/Media Placeholder */}
            <div className="w-full aspect-[16/9] bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-sm relative overflow-hidden group cursor-pointer hover:border-cyan-500/40 transition">
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-500" />
              <PlayCircle className="h-16 w-16 text-[#C4CCCC] group-hover:text-cyan-400 transition duration-300 transform group-hover:scale-110 mb-4" />
              <p className="text-sm font-semibold uppercase tracking-wider text-[#A9B2B2] group-hover:text-white transition">Showreel / Walkthrough Video</p>
              <p className="text-xs text-[#A9B2B2]/80 mt-2">Placeholder - Ready for MP4/WebM Upload</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Placeholder 1 */}
              <div className="w-full aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-sm relative overflow-hidden group hover:border-cyan-500/40 transition">
                <ImageIcon className="h-10 w-10 text-[#C4CCCC] group-hover:text-cyan-400 transition duration-300 mb-3" />
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A9B2B2]">Brand Assets</p>
              </div>
              {/* Image Placeholder 2 */}
              <div className="w-full aspect-square bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center shadow-sm relative overflow-hidden group hover:border-cyan-500/40 transition">
                <ImageIcon className="h-10 w-10 text-[#C4CCCC] group-hover:text-cyan-400 transition duration-300 mb-3" />
                <p className="text-xs font-semibold uppercase tracking-wider text-[#A9B2B2]">Interface Design</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
