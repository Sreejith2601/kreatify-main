"use client"

import { Menu, ChevronUp, ChevronDown } from "lucide-react"

export function Logo({ className, style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <div className={className || "pointer-events-auto select-none text-[16px] font-bold leading-[1.05] tracking-[0.1em] text-[#E4E9E9] font-sans"} style={style}>
      <div>KREATIFY</div>
    </div>
  )
}

export function MenuButton({ onClick }: { onClick?: () => void }) {
  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={onClick}
      className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-lg bg-white/5 text-white border border-white/10 shadow-sm transition hover:bg-white/15 backdrop-blur-md cursor-pointer"
    >
      <Menu className="h-5 w-5" strokeWidth={2} />
    </button>
  )
}

export function SlideCounter({
  current,
  total,
  onPrev,
  onNext,
}: {
  current: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="pointer-events-auto flex items-end gap-3">
      <div className="flex items-baseline gap-1 text-white">
        <span className="text-4xl font-bold leading-none tracking-tight">
          {pad(current)}
        </span>
        <span className="text-sm font-medium text-[#A9B2B2]">
          / {pad(total)}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={onPrev}
          className="flex h-6 w-6 items-center justify-center rounded border border-white/20 text-[#E4E9E9] transition hover:bg-white/10"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={onNext}
          className="flex h-6 w-6 items-center justify-center rounded border border-white/20 text-[#E4E9E9] transition hover:bg-white/10"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
