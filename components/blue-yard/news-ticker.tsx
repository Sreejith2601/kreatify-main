"use client"

import { useState } from "react"
import { X } from "lucide-react"

const HEADLINES = [
  "Markets rally as tokenized assets cross new milestone",
  "New protocol promises frictionless cross-border settlement",
  "Report: on-chain coordination reshapes venture capital",
  "Decentralized networks see record participation this quarter",
]

export function NewsTicker() {
  const [open, setOpen] = useState(true)
  if (!open) return null

  const line = HEADLINES.join("     •     ")

  return (
    <div className="pointer-events-auto mx-auto flex w-full max-w-5xl items-center gap-3 overflow-hidden rounded-md bg-white/95 py-2.5 pl-2.5 pr-3 shadow-md backdrop-blur">
      <span className="flex shrink-0 items-center gap-1.5 rounded-sm bg-red-600 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        Live
      </span>
      <div className="relative flex-1 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-sm font-medium text-neutral-800">
          <span className="mx-4">{line}</span>
          <span className="mx-4">{line}</span>
        </div>
      </div>
      <button
        type="button"
        aria-label="Close ticker"
        onClick={() => setOpen(false)}
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
