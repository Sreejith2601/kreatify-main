"use client"

import { Menu, ChevronUp, ChevronDown } from "lucide-react"

export function Logo() {
  return (
    <div className="pointer-events-auto select-none text-[16px] font-bold leading-[1.05] tracking-[0.1em] text-[#0D0D0D] font-sans">
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
      className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-lg bg-[#F5F0EB]/60 text-[#0D0D0D] border border-[#C9B99A]/40 shadow-sm transition hover:bg-[#F5F0EB]/80 backdrop-blur-md cursor-pointer"
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
      <div className="flex items-baseline gap-1 text-neutral-900">
        <span className="text-4xl font-bold leading-none tracking-tight">
          {pad(current)}
        </span>
        <span className="text-sm font-medium text-neutral-500">
          / {pad(total)}
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <button
          type="button"
          aria-label="Previous slide"
          onClick={onPrev}
          className="flex h-6 w-6 items-center justify-center rounded border border-neutral-400/60 text-neutral-800 transition hover:bg-white/50"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={onNext}
          className="flex h-6 w-6 items-center justify-center rounded border border-neutral-400/60 text-neutral-800 transition hover:bg-white/50"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
