"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/blue-yard/chrome"
import { ParticleSphere } from "@/components/blue-yard/particle-sphere"
import { orbTransformRef } from "@/components/blue-yard/carousel"
import TextReveal from "@/components/ui/text-reveal"
import FadeUp from "@/components/ui/fade-up"
import { ArrowLeft, ArrowRight, Target, Sparkles, Cpu, Layers, TrendingUp, Code2, CheckCircle2, PhoneCall, Monitor, Smartphone, Video, PenTool, FileText } from "lucide-react"

const SERVICES_DETAIL_DATA: Record<string, {
  title: string
  subtitle: string
  description: string
  icon: any
  bannerGradient: string
  capabilities: string[]
  process: { step: string; title: string; desc: string }[]
  faqs: { q: string; a: string }[]
}> = {
  "brand-strategy": {
    title: "Brand Strategy & Identity",
    subtitle: "01 / Establish Authority",
    description: "In a hyper-competitive digital landscape, standing out requires a strong foundation of visual storytelling, strategic positioning, and consistent guidelines. We build premium, memorable identities that instantly build trust and recognition.",
    icon: Layers,
    bannerGradient: "from-cyan-500/20 to-blue-500/10",
    capabilities: [
      "Visual Identity & Logomarks",
      "Brand Core Positioning",
      "Comprehensive Style Guides",
      "Typography & Color Hierarchies",
      "Packaging & Collateral Design",
      "Brand Narrative Development"
    ],
    process: [
      { step: "01", title: "Discovery & Analysis", desc: "Deep dive into your market landscape, customer segments, and competitor positioning." },
      { step: "02", title: "Concept Development", desc: "Drafting initial style directions, color schemes, and aesthetic definitions." },
      { step: "03", title: "Refinement & Handover", desc: "Polishing assets and packing high-resolution layout guidelines for your team." }
    ],
    faqs: [
      { q: "How long does a full branding project take?", a: "Typically, projects span between 4 to 6 weeks from strategy definition to final delivery." },
      { q: "Will I get editable vectors of all logo assets?", a: "Yes, all layouts are provided in fully customizable Figma, SVG, and Adobe Illustrator formats." }
    ]
  },
  "digital-marketing": {
    title: "Digital Marketing & Growth",
    subtitle: "02 / Accelerate Engagement",
    description: "Convert digital impressions into lifetime customer loyalty. Using organic optimizations, targeted outreach channels, and deep web analytics, we design marketing campaigns that drive measurable business outcomes.",
    icon: TrendingUp,
    bannerGradient: "from-blue-500/20 to-purple-500/10",
    capabilities: [
      "SEO Auditing & Content Optimization",
      "Pay-Per-Click Advertising",
      "Social Media Growth Blueprints",
      "High-Conversion Email Funnels",
      "Campaign Data & Analytics",
      "Audience Segmentation Research"
    ],
    process: [
      { step: "01", title: "Audience Profiling", desc: "Pinpointing target users, online platforms, and search term patterns." },
      { step: "02", title: "Campaign Launch", desc: "Setting up landing sites, writing targeted copy, and launching ads." },
      { step: "03", title: "Ongoing Optimization", desc: "Analyzing performance data daily and reallocating budgets to maximize return on investment." }
    ],
    faqs: [
      { q: "Do you manage ad spend directly?", a: "We oversee campaign setups and execution, but direct ad budget is billed to your client accounts." },
      { q: "When will we see organic SEO results?", a: "SEO compound improvements typically begin showing notable search ranking shifts within 90 days." }
    ]
  },
  "software-solutions": {
    title: "Custom Software Solutions",
    subtitle: "03 / Engineer Innovation",
    description: "High-performance digital products engineered to scale smoothly. From robust web applications to customized database engines, we construct reliable, secure platforms optimized for speed and longevity.",
    icon: Code2,
    bannerGradient: "from-purple-500/20 to-pink-500/10",
    capabilities: [
      "Custom React & Next.js Platforms",
      "Tailored CRM & Dashboard Architecture",
      "API Integrations & Automations",
      "Database Scalability Planning",
      "Cloud Hosting & Architecture",
      "AI & LLM Integration Workflows"
    ],
    process: [
      { step: "01", title: "Architecture Blueprint", desc: "Drafting schema designs, API contracts, and interface flowcharts." },
      { step: "02", title: "Agile Development", desc: "Iterative sprints with live builds shared every two weeks." },
      { step: "03", title: "Deployment & Support", desc: "Setting up CI/CD pipelines, analytics monitoring, and security safeguards." }
    ],
    faqs: [
      { q: "What tech stack do you recommend?", a: "We build primarily with Next.js, Node.js, TypeScript, PostgreSQL, and AWS/Vercel for optimal velocity." },
      { q: "Do you offer post-launch maintenance?", a: "Yes, we provide monthly hosting, maintenance, and security monitoring packages." }
    ]
  },
  "content-creation": {
    title: "Premium Content Creation",
    subtitle: "04 / Tell Unforgettable Stories",
    description: "Connect visually. We create high-end design assets, motion animations, and engaging marketing copy that aligns with your brand values and grabs audience attention.",
    icon: Sparkles,
    bannerGradient: "from-cyan-500/20 to-pink-500/10",
    capabilities: [
      "Brand Videography & Motion Design",
      "Commercial Product Photography",
      "Creative Ad Art Direction",
      "UX Copywriting & Microcopy",
      "Social Asset Production Kits",
      "Interactive 3D Visual Assets"
    ],
    process: [
      { step: "01", title: "Moodboarding", desc: "Collaborating on visual style directions, color styling, and scripts." },
      { step: "02", title: "Asset Production", desc: "Recording, designing, and polishing original graphics and animations." },
      { step: "03", title: "Format Optimizations", desc: "Exporting layout files sized for mobile, desktop, print, and social media." }
    ],
    faqs: [
      { q: "Who owns the copyright of created content?", a: "Upon project completion and payment, all digital copyrights transfer to your business." },
      { q: "Can you create custom 3D animations?", a: "Yes, we construct custom interactive 3D assets for both web browser and video formats." }
    ]
  }
}

function SocialMediaPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3] w-full" style={{ "--glow-color": "#06B6D4" } as React.CSSProperties}>
      <div className="bg-pane w-full h-full p-1 flex items-center justify-center overflow-hidden relative">
        <img src="/social_media.png" alt="Social Media Dashboard" className="w-full h-full object-cover rounded-[inherit]" />
      </div>
    </div>
  )
}

function SeoPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3] w-full" style={{ "--glow-color": "#10B981" } as React.CSSProperties}>
      <div className="bg-pane w-full h-full p-1 flex items-center justify-center overflow-hidden relative">
        <img src="/seo_analytics.png" alt="SEO Analytics" className="w-full h-full object-cover rounded-[inherit]" />
      </div>
    </div>
  )
}

function AdsCampaignPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3]" style={{ "--glow-color": "#F59E0B" } as React.CSSProperties}>
      {/* Glass Pane Content */}
      <div className="bg-pane p-6 flex flex-col justify-between">
        {/* Ads Campaign Details */}
        <div className="flex justify-between items-start border-b border-white/5 pb-3">
          <div>
            <span className="text-[8px] font-mono text-white/40 block">CAMPAIGN ROI STATUS</span>
            <span className="text-xs font-bold text-[#E4E9E9]">GOOGLE & META ADS</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-400">4.8x ROAS</span>
        </div>
        
        {/* Conversion funnel indicators */}
        <div className="my-auto space-y-2">
          <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
            <span>IMPRESSIONS (1.2M)</span>
            <div className="w-32 bg-white/5 h-2 rounded-full overflow-hidden border border-white/10"><div className="bg-amber-400 h-full w-[85%]" /></div>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
            <span>CLICKS (98K)</span>
            <div className="w-32 bg-white/5 h-2 rounded-full overflow-hidden border border-white/10"><div className="bg-amber-400 h-full w-[55%]" /></div>
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-white/50">
            <span>CONVERSIONS (12K)</span>
            <div className="w-32 bg-white/5 h-2 rounded-full overflow-hidden border border-white/10"><div className="bg-amber-400 h-full w-[25%]" /></div>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="flex justify-between items-center text-[9px] font-mono text-white/30 border-t border-white/5 pt-3">
          <span>DAILY AD SPEND LIMIT</span>
          <span>OPTIMIZED DAILY</span>
        </div>
      </div>
    </div>
  )
}

function WebDevPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3] w-full" style={{ "--glow-color": "#3B82F6" } as React.CSSProperties}>
      <div className="bg-pane w-full h-full p-1 flex items-center justify-center overflow-hidden relative">
        <img src="/web_dev.png" alt="Web Development" className="w-full h-full object-cover rounded-[inherit]" />
      </div>
    </div>
  )
}

function SoftwareDevPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3]" style={{ "--glow-color": "#8B5CF6" } as React.CSSProperties}>
      {/* Glass Pane Content */}
      <div className="bg-pane p-6 flex flex-col justify-between">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 text-[8px] font-mono text-white/40 border-b border-white/5 pb-2">
          <span className="w-2 h-2 rounded-full bg-violet-500" />
          <span>BASH - api_server.log</span>
        </div>
        
        {/* Script code console lines */}
        <div className="my-auto space-y-1.5 font-mono text-[8px] text-white/50 px-1">
          <p className="text-violet-400">&gt; npm run start:prod</p>
          <p>✔ Server initialized on port 8080</p>
          <p className="text-emerald-400">✔ database pool connection: [OK]</p>
          <p className="animate-pulse">_ listening for requests...</p>
        </div>
        
        {/* Terminal Footer */}
        <div className="flex justify-between items-center text-[9px] font-mono text-white/30 border-t border-white/5 pt-3">
          <span>DOCKER CONTAINERIZED</span>
          <span className="text-violet-400 font-bold">PORT 8080</span>
        </div>
      </div>
    </div>
  )
}

function MobileDevPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3]" style={{ "--glow-color": "#EC4899" } as React.CSSProperties}>
      {/* Glass Pane Content */}
      <div className="bg-pane p-6 flex flex-col justify-between items-center">
        {/* Mobile Device Frame UI */}
        <div className="w-24 h-40 rounded-2xl border-2 border-white/10 bg-black/40 p-2 flex flex-col justify-between relative">
          <div className="w-8 h-1 bg-white/20 rounded-full mx-auto" />
          
          <div className="my-auto space-y-2">
            <div className="w-10 h-10 rounded-full bg-pink-500/10 border border-pink-500/30 mx-auto flex items-center justify-center text-pink-400">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="h-1 bg-white/20 rounded w-[80%] mx-auto" />
            <div className="h-1 bg-white/10 rounded w-[50%] mx-auto" />
          </div>
          
          <div className="w-12 h-0.5 bg-white/20 rounded-full mx-auto" />
        </div>
        
        <div className="w-full flex justify-between text-[9px] font-mono text-white/30 mt-1">
          <span>REACT NATIVE / FLUTTER</span>
          <span className="text-pink-400 font-bold">iOS / ANDROID</span>
        </div>
      </div>
    </div>
  )
}

function VideoProdPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3] w-full" style={{ "--glow-color": "#EF4444" } as React.CSSProperties}>
      <div className="bg-pane w-full h-full p-1 flex items-center justify-center overflow-hidden relative">
        <img src="/video_prod.png" alt="Video Production" className="w-full h-full object-cover rounded-[inherit]" />
      </div>
    </div>
  )
}

function GraphicDesignPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3]" style={{ "--glow-color": "#EC4899" } as React.CSSProperties}>
      {/* Glass Pane Content */}
      <div className="bg-pane p-6 flex flex-col justify-between">
        {/* Vector Grid mockup */}
        <div className="my-auto relative w-full aspect-[16/9] rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          <PenTool className="w-8 h-8 text-pink-400 relative z-10" />
          
          {/* Mock Anchor Points */}
          <span className="absolute top-6 left-10 w-2 h-2 bg-pink-500 border border-white rounded-sm" />
          <span className="absolute bottom-6 right-10 w-2 h-2 bg-pink-500 border border-white rounded-sm" />
        </div>
        
        {/* Footer info */}
        <div className="flex justify-between items-center text-[9px] font-mono text-white/30 border-t border-white/5 pt-3">
          <span>VECTOR PATH LAYOUT</span>
          <span className="text-pink-400 font-bold">ALIGN: PIXEL</span>
        </div>
      </div>
    </div>
  )
}

function CopywritingPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3]" style={{ "--glow-color": "#F59E0B" } as React.CSSProperties}>
      {/* Glass Pane Content */}
      <div className="bg-pane p-6 flex flex-col justify-between">
        {/* Header toolbar */}
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <span className="text-[8px] font-mono text-white/30">draft_campaign_copy.txt</span>
        </div>
        
        {/* Copy text mockup */}
        <div className="my-auto space-y-2 px-1 font-sans text-xs text-white/70">
          <div className="h-2.5 bg-amber-500/20 border border-amber-500/30 rounded w-[85%] animate-pulse" />
          <div className="h-1.5 bg-white/10 rounded w-[95%]" />
          <div className="h-1.5 bg-white/10 rounded w-[60%]" />
        </div>
        
        {/* Footer info */}
        <div className="flex justify-between items-center text-[9px] font-mono text-white/30 border-t border-white/5 pt-3">
          <span>READABILITY INDEX: 8.5</span>
          <span className="text-amber-500 font-bold">100% ORIGINAL</span>
        </div>
      </div>
    </div>
  )
}

function LogoPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3] w-full" style={{ "--glow-color": "#0891B2" } as React.CSSProperties}>
      <div className="bg-pane w-full h-full p-1 flex items-center justify-center overflow-hidden relative">
        <img src="/brand_logo.png" alt="Sleek 3D Corporate Logo" className="w-full h-full object-cover rounded-[inherit]" />
      </div>
    </div>
  )
}

function PosterPlaceholder() {
  return (
    <div className="blob-card aspect-[3/4] max-w-sm w-full" style={{ "--glow-color": "#4F46E5" } as React.CSSProperties}>
      <div className="bg-pane w-full h-full p-1 flex items-center justify-center overflow-hidden relative">
        <img src="/brand_poster.png" alt="High Fashion Poster Mockup" className="w-full h-full object-cover rounded-[inherit]" />
      </div>
    </div>
  )
}

function ContentPlaceholder() {
  return (
    <div className="blob-card aspect-[4/3] w-full" style={{ "--glow-color": "#F43F5E" } as React.CSSProperties}>
      <div className="bg-pane w-full h-full p-1 flex items-center justify-center overflow-hidden relative">
        <img src="/brand_content.png" alt="Creative Studio Desk" className="w-full h-full object-cover rounded-[inherit]" />
      </div>
    </div>
  )
}

export default function ServiceDetail() {
  const params = useParams()
  const id = params?.id as string
  const service = SERVICES_DETAIL_DATA[id]

  const [isScrolled, setIsScrolled] = useState(false)

  // Force scroll to top on load and handle scroll state
  useEffect(() => {
    // Align particle orb to top-right corner on subpage load
    orbTransformRef.current = { left: -15, top: 5, scale: 1.15 }

    // Instantly scroll to top when this page mounts
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!service) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-mesh-gradient p-6 text-center">
        <h1 className="text-3xl font-bold text-[#E4E9E9]">Service Capability Not Found</h1>
        <p className="mt-2 text-[#C4CCCC] font-sans">The requested service detail page could not be located.</p>
        <Link href="/" className="uiverse-btn">
          <span className="wrap">
            <p>
              <span className="flex items-center gap-1.5"><ArrowLeft className="h-3.5 w-3.5" /> Return Home</span>
            </p>
          </span>
        </Link>
      </div>
    )
  }

  const isBranding = id === "brand-strategy"
  const isMarketing = id === "digital-marketing"
  const isSoftware = id === "software-solutions"
  const isContent = id === "content-creation"
  // Branding is now a dark theme (bg-mesh-plum)
  const isLightTheme = isMarketing || isSoftware || isContent
  const Icon = service.icon

  // Dynamic light/dark theme text color schemes
  const textTitleColor = isLightTheme ? "text-slate-900" : "text-white"
  const textDescColor = isLightTheme ? "text-slate-700 font-normal" : "text-slate-100 font-light"
  const textListColor = isLightTheme ? "text-slate-800" : "text-slate-200"
  const textMutedColor = isLightTheme ? "text-slate-500 font-semibold" : "text-[#A9B2B2]"
  const textFaqQColor = isLightTheme ? "text-slate-800 font-bold" : "text-[#E4E9E9]"
  const textFaqAColor = isLightTheme ? "text-slate-700 font-sans font-normal" : "text-[#C4CCCC] font-sans font-light"
  const footerBorderColor = isLightTheme ? "border-slate-300" : "border-white/10"
  const footerBgColor = isLightTheme ? "bg-slate-800/5" : "bg-black/10"
  const footerTextColor = isLightTheme ? "text-slate-600 font-semibold" : "text-[#A9B2B2]"
  const tagColor = isBranding ? "text-pink-400" : isMarketing ? "text-teal-600" : isSoftware ? "text-blue-600" : isContent ? "text-purple-600" : "text-pink-400"
  const secTagColor = isBranding ? "text-cyan-400" : isMarketing ? "text-teal-600" : isSoftware ? "text-blue-600" : isContent ? "text-purple-600" : "text-cyan-400"
  const checkIconColor = isBranding ? "text-cyan-400" : isMarketing ? "text-teal-600" : isSoftware ? "text-blue-600" : isContent ? "text-purple-600" : "text-cyan-400"
  const linkColor = isLightTheme ? "text-slate-600 hover:text-black" : "text-[#E2E8F0] hover:text-white"

  return (
    <main 
      className={`relative min-h-screen font-sans ${isBranding ? 'bg-mesh-plum' : ''}`}
      style={!isBranding ? (isMarketing ? {
        backgroundColor: "#C2CDC5",
        backgroundImage: "radial-gradient(at 0% 0%, #c2cdc5 0px, transparent 65%), radial-gradient(at 100% 100%, #a7f3d0 0px, transparent 65%), radial-gradient(at 30% 80%, rgba(13, 148, 136, 0.4) 0px, transparent 70%), radial-gradient(at 80% 20%, rgba(16, 185, 129, 0.35) 0px, transparent 70%)"
      } : isSoftware ? {
        backgroundColor: "#E0E7FF",
        backgroundImage: "radial-gradient(at 0% 0%, #e0e7ff 0px, transparent 65%), radial-gradient(at 100% 100%, #c7d2fe 0px, transparent 65%), radial-gradient(at 30% 80%, rgba(59, 130, 246, 0.3) 0px, transparent 70%), radial-gradient(at 80% 20%, rgba(139, 92, 246, 0.25) 0px, transparent 70%)"
      } : isContent ? {
        backgroundColor: "#DDD6FE",
        backgroundImage: "radial-gradient(at 0% 0%, #ddd6fe 0px, transparent 65%), radial-gradient(at 100% 100%, #c7d2fe 0px, transparent 65%), radial-gradient(at 30% 80%, rgba(139, 92, 246, 0.35) 0px, transparent 70%), radial-gradient(at 80% 20%, rgba(232, 121, 249, 0.3) 0px, transparent 70%)"
      } : {
        backgroundColor: "#15475A",
        backgroundImage: "radial-gradient(at 0% 0%, #15475a 0px, transparent 65%), radial-gradient(at 100% 100%, #1f5e46 0px, transparent 65%), radial-gradient(at 30% 80%, rgba(31, 94, 70, 0.4) 0px, transparent 70%), radial-gradient(at 80% 20%, rgba(21, 71, 90, 0.4) 0px, transparent 70%)"
      }) : {}}
    >
      {/* Background 3D Orb */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <ParticleSphere key={id} darkenOrb={id === "brand-strategy"} />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className={`flex items-center justify-between w-full px-6 md:px-8 pointer-events-auto transition-all duration-300 border-b ${
          isScrolled 
            ? "py-3 bg-white/5 border-white/10 shadow-sm backdrop-blur-md" 
            : "py-5 bg-transparent border-transparent backdrop-blur-none"
        }`}>
          <Link href="/">
            <Logo className={!isLightTheme ? "text-white" : "text-slate-900"} />
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition cursor-pointer ${linkColor}`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition cursor-pointer ${linkColor}`}
            >
              About
            </Link>
            <Link
              href={`/services#${id}`}
              className={`text-xs font-semibold uppercase tracking-[0.15em] transition cursor-pointer ${linkColor}`}
            >
              Services
            </Link>
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

      {/* Body Content Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-36 pb-24 space-y-20">
        
        {/* Editorial Header Block */}
        <div className="space-y-6">
          <Link href={`/services#${id}`} className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest ${linkColor} uppercase transition`}>
            <ArrowLeft className="h-3 w-3" /> Services
          </Link>
          <div className="space-y-3">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-normal italic ${textTitleColor} leading-tight`}>
              <TextReveal text={service.title} />
            </h1>
          </div>
        </div>

        {id === "brand-strategy" ? (
          /* Custom Layout for Brand Strategy: Staggered, Alternating Showcase Grid */
          <div className="space-y-24">
            
            {/* Section 1: Logo & Visual Identity */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Identity Development</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Logo Design & Brandmark Systems</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  A premium logo is the cornerstone of your entire visual identity. We craft scalable, memorable brandmarks tailored to express your company core values, aligning them with precise typography systems and custom geometric guidelines to ensure consistent presence across all media.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Fully scalable vector logomarks</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Color psychology and typographic systems</li>
                </ul>
              </div>
              <div className="lg:col-span-5 flex justify-center w-full">
                <LogoPlaceholder />
              </div>
            </div>
            </FadeUp>

            {/* Section 2: Poster & Marketing Collateral (Alternating Layout) */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center w-full">
                <PosterPlaceholder />
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Graphic Layouts</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Poster Mockups & Marketing Assets</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  From large-scale print posters to digital marketing collateral, visual layout dictates consumer attention. We design striking, high-impact poster grids, marketing banners, and editorial systems that present key messaging clearly, ensuring your campaigns stand out in any physical or digital environment.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Custom print-ready grids (A1-A4 formats)</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Optimized aspect ratios for digital billboards</li>
                </ul>
              </div>
            </div>
            </FadeUp>

            {/* Section 3: Content Production & Art Direction */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Art Direction</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Content Production & Media Assets</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Storytelling is driven by high-fidelity content. We coordinate visual production scripts, produce art-directed video guidelines, and optimize digital assets for multiple dimensions, enabling your marketing channels to run premium campaigns with seamless visual continuity.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Multi-channel campaign asset kits</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Commercial quality control & format guidelines</li>
                </ul>
              </div>
              <div className="lg:col-span-5 flex justify-center w-full">
                <ContentPlaceholder />
              </div>
            </div>
            </FadeUp>

            {/* Bottom CTA Block */}
            <FadeUp delay={0.2}>
              <div className="pt-12 flex justify-center">
              <Link href="/#contact" className="uiverse-btn w-full max-w-md" style={{ "--bg": "linear-gradient(to right, #000000, #3f3f46)" } as React.CSSProperties}>
                <span className="wrap text-white">
                  <p>
                    <span className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> Discuss Your Project</span>
                    <span className="flex items-center gap-1">Get In Touch <ArrowRight className="h-4 w-4" /></span>
                  </p>
                </span>
              </Link>
            </div>
            </FadeUp>

          </div>
        ) : id === "digital-marketing" ? (
          /* Custom Layout for Digital Marketing: Staggered, Alternating Showcase Grid */
          <div className="space-y-24">
            
            {/* Section 1: Social Media Handling */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Audience Engagement</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Social Media Page Handling</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Engage your target audience directly on social networks. We design and curate original graphic feeds, write engaging copy templates, and track audience interaction rates daily to grow your profile organically across Instagram, Twitter, LinkedIn, and Meta.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Interactive feed styling & copywriting</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Multi-platform scheduling & profile optimization</li>
                </ul>
              </div>
              <div className="lg:col-span-5 flex justify-center w-full">
                <SocialMediaPlaceholder />
              </div>
            </div>
            </FadeUp>

            {/* Section 2: SEO Management (Alternating Layout) */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center w-full">
                <SeoPlaceholder />
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Search Optimization</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Search Engine Optimization (SEO)</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Own search page visibility. We audit web pages for speed, run deep keyword index planning, and engineer off-page link structures to index your brand on search results, shifting organic traffic into qualified leads.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Deep keyword mapping & competitive auditing</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> High-authority backlink outreach profiles</li>
                </ul>
              </div>
            </div>
            </FadeUp>

            {/* Section 3: Meta & Google Ads Campaigning */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>High-ROAS Ads</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Meta & Google Paid Campaigns</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Generate immediate conversions with targeted paid campaigns. We write copy, set up conversion funnels, and optimize target audience budgets dynamically to scale ad spend efficiently.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Multi-channel campaign structures</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Live dashboard ROI tracking & optimizations</li>
                </ul>
              </div>
              <div className="lg:col-span-5 flex justify-center w-full">
                <AdsCampaignPlaceholder />
              </div>
            </div>
            </FadeUp>

            {/* Bottom CTA Block */}
            <FadeUp delay={0.2}>
              <div className="pt-12 flex justify-center">
              <Link href="/#contact" className="uiverse-btn w-full max-w-md" style={{ "--bg": "linear-gradient(to right, #000000, #3f3f46)" } as React.CSSProperties}>
                <span className="wrap text-white">
                  <p>
                    <span className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> Discuss Your Project</span>
                    <span className="flex items-center gap-1">Get In Touch <ArrowRight className="h-4 w-4" /></span>
                  </p>
                </span>
              </Link>
            </div>
            </FadeUp>

          </div>
        ) : id === "software-solutions" ? (
          /* Custom Layout for Software Solutions: Staggered, Alternating Showcase Grid */
          <div className="space-y-24">
            
            {/* Section 1: App Development */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Web Applications</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Web Application Development</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Build premium, fast web platforms using modern technology. We construct fully responsive React/Next.js client portals, design premium skeuomorphic interface flows, and configure server-side page hydration systems for flawless SEO and immediate page load times.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Next.js 15 & React interactive modules</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Fully responsive custom CSS & responsive styling</li>
                </ul>
              </div>
              <div className="lg:col-span-5 flex justify-center w-full">
                <WebDevPlaceholder />
              </div>
            </div>
            </FadeUp>

            {/* Section 2: Website & Platform Eng (Alternating) */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center w-full">
                <SoftwareDevPlaceholder />
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Cloud Systems</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Custom Software & Backend Systems</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Power your applications with high-concurrency server APIs. We architect containerized microservices, program database pools (PostgreSQL/MongoDB), and deploy cloud pipelines designed to serve thousands of operations per second safely.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Secure RESTful / GraphQL API architectures</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Scalable Docker container environments</li>
                </ul>
              </div>
            </div>
            </FadeUp>

            {/* Section 3: Mobile Apps */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Multiplatform Apps</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Mobile Application Engineering</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Deploy beautiful mobile user experiences to the App Store and Google Play. We code highly optimized, cross-platform apps using React Native or Flutter, integrating device features (GPS, camera, pings) with native fluidity.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Native iOS & Android publishing pipeline</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Offline data caching & background services</li>
                </ul>
              </div>
              <div className="lg:col-span-5 flex justify-center w-full">
                <MobileDevPlaceholder />
              </div>
            </div>
            </FadeUp>

            {/* Bottom CTA Block */}
            <FadeUp delay={0.2}>
              <div className="pt-12 flex justify-center">
              <Link href="/#contact" className="uiverse-btn w-full max-w-md" style={{ "--bg": "linear-gradient(to right, #000000, #3f3f46)" } as React.CSSProperties}>
                <span className="wrap text-white">
                  <p>
                    <span className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> Discuss Your Project</span>
                    <span className="flex items-center gap-1">Get In Touch <ArrowRight className="h-4 w-4" /></span>
                  </p>
                </span>
              </Link>
            </div>
            </FadeUp>

          </div>
        ) : id === "content-creation" ? (
          /* Custom Layout for Content Creation: Staggered, Alternating Showcase Grid */
          <div className="space-y-24">
            
            {/* Section 1: Video Production */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Motion Design</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Video Production & Editing</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Bring stories to life with cinematic pacing. We construct visual video storyboards, edit content with precise sound design profiles, and color grade campaign videos sized for commercial delivery.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Full sound design & audio mastering</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Multi-platform screen format exports</li>
                </ul>
              </div>
              <div className="lg:col-span-5 flex justify-center w-full">
                <VideoProdPlaceholder />
              </div>
            </div>
            </FadeUp>

            {/* Section 2: Graphic Design (Alternating Layout) */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-5 order-2 lg:order-1 flex justify-center w-full">
                <GraphicDesignPlaceholder />
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Creative Visuals</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Graphic Design & Poster Art</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Capture consumer eyes instantly. We compose geometric layout structures, design high-impact posters, and build vector branding templates designed to express core values clearly.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Custom layout vector compositions</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Multi-size print collateral sets</li>
                </ul>
              </div>
            </div>
            </FadeUp>

            {/* Section 3: Custom Software Solutions */}
            <FadeUp>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className={`text-xs font-mono font-bold uppercase tracking-[0.2em] ${secTagColor}`}>Brand Voice</span>
                <h2 className={`text-3xl md:text-4xl font-bold ${textTitleColor} tracking-tight`}>Copywriting & Brand Voice Strategy</h2>
                <p className={`${textDescColor} text-base md:text-lg leading-relaxed font-sans`}>
                  Turn impressions into buyers with copy that clicks. We write product headlines, establish tone guidelines, and author high-conversion ad copies optimized for multiple channels.
                </p>
                <ul className={`space-y-3 text-sm ${textListColor} font-sans`}>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Conversion-driven headline formulas</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className={`h-4 w-4 ${checkIconColor}`} /> Comprehensive tone & guidelines books</li>
                </ul>
              </div>
              <div className="lg:col-span-5 flex justify-center w-full">
                <CopywritingPlaceholder />
              </div>
            </div>
            </FadeUp>

            {/* Bottom CTA Block */}
            <FadeUp delay={0.2}>
            <div className="pt-12 flex justify-center">
              <Link href="/#contact" className="uiverse-btn w-full max-w-md" style={{ "--bg": "linear-gradient(to right, #000000, #3f3f46)" } as React.CSSProperties}>
                <span className="wrap text-white">
                  <p>
                    <span className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> Discuss Your Project</span>
                    <span className="flex items-center gap-1">Get In Touch <ArrowRight className="h-4 w-4" /></span>
                  </p>
                </span>
              </Link>
            </div>
            </FadeUp>

          </div>
        ) : (
          /* Standard Layout for other services */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Description & Capabilities */}
            <div className="lg:col-span-7 space-y-8">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-md space-y-6">
                <div className="p-3 w-fit rounded-xl bg-white/10 text-[#E4E9E9]">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="text-[#C4CCCC] text-lg leading-relaxed font-sans">
                  {service.description}
                </p>
              </div>

              {/* Core Capabilities Checklist */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#A9B2B2] uppercase">Core Capabilities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {service.capabilities.map((cap) => (
                    <div key={cap} className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                      <CheckCircle2 className="h-4.5 w-4.5 text-cyan-400 flex-shrink-0" />
                      <span className="text-sm font-semibold text-[#E4E9E9]">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Execution Process */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 shadow-sm backdrop-blur-md space-y-6">
                <h3 className="text-xs font-mono font-bold tracking-widest text-[#A9B2B2] uppercase">Our Process</h3>
                <div className="space-y-6">
                  {service.process.map((step) => (
                    <div key={step.step} className="flex gap-4 items-start">
                      <span className="text-xl font-display font-extrabold text-cyan-400 bg-white/5 h-8 w-8 rounded-lg flex items-center justify-center shrink-0">{step.step}</span>
                      <div>
                        <h4 className="text-sm font-bold text-[#E4E9E9] uppercase font-display">{step.title}</h4>
                        <p className="text-xs text-[#C4CCCC] mt-1 font-sans leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subpage CTA */}
              <Link href="/#contact" className="uiverse-btn w-full" style={{ "--bg": "linear-gradient(to right, #000000, #3f3f46)" } as React.CSSProperties}>
                <span className="wrap text-white">
                  <p>
                    <span className="flex items-center gap-2"><PhoneCall className="h-4 w-4" /> Discuss Your Project</span>
                    <span className="flex items-center gap-1">Get In Touch <ArrowRight className="h-4 w-4" /></span>
                  </p>
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* FAQ Section */}
        <div className={`pt-8 border-t ${footerBorderColor} space-y-6`}>
          <h3 className={`text-xs font-mono font-bold tracking-widest ${textMutedColor} uppercase`}>Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {service.faqs.map((faq) => (
              <div key={faq.q} className="space-y-2">
                <h4 className={`text-sm ${textFaqQColor}`}>{faq.q}</h4>
                <p className={`text-sm ${textFaqAColor}`}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className={`relative ${footerBgColor} border-t ${footerBorderColor} pt-16 pb-8 px-6 md:px-12 lg:px-16 z-10`}>
        <div className={`w-full max-w-5xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono ${footerTextColor} uppercase tracking-wider`}>
          <span>© {new Date().getFullYear()} Kreatify. All rights reserved.</span>
          <span>Designed & Built with Precision</span>
        </div>
      </footer>
    </main>
  )
}
