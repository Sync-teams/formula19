"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { ArrowUpRight, MapPin, X, ChevronLeft, ChevronRight } from "lucide-react"

interface ShowroomSectionProps {
  content?: Record<string, string>
}

type Shot = {
  /** basename in /images/shop — `-sm` is the grid thumb, plain is the full frame */
  file: string
  title: string
  tag: string
  /** true dimensions of the thumb, so the masonry reserves the right box */
  portrait?: boolean
}

/** The two frames that carry the section. */
const FEATURE: Shot[] = [
  { file: "wheel-wall", title: "The wheel wall", tag: "Showroom" },
  { file: "storefront", title: "715 Evans Court", tag: "Outside" },
]

/** Everything else, in masonry reading order. */
const SHOTS: Shot[] = [
  { file: "wheel-wall-grid", title: "Fitments on display", tag: "Showroom", portrait: true },
  { file: "showroom", title: "Front showroom", tag: "Showroom" },
  { file: "wheel-wall-black", title: "Truck & off-road rims", tag: "Wheels", portrait: true },
  { file: "lounge", title: "Waiting lounge", tag: "Showroom" },
  { file: "bay-door", title: "The service bay", tag: "Workshop" },
  { file: "showroom-desk", title: "The counter", tag: "Showroom", portrait: true },
  { file: "service-bay", title: "Tires in stock", tag: "Workshop", portrait: true },
  { file: "entrance", title: "Front door", tag: "Outside", portrait: true },
  { file: "tire-changer", title: "Tire changer", tag: "Equipment", portrait: true },
  { file: "balancer", title: "Wheel balancer", tag: "Equipment", portrait: true },
  { file: "storefront-wide", title: "Easy parking out front", tag: "Outside", portrait: true },
]

const ALL = [...FEATURE, ...SHOTS]

export function ShowroomSection({ content = {} }: ShowroomSectionProps) {
  const [active, setActive] = useState<number | null>(null)

  const addressLine1 = content.contact_address_line1 || "Unit 1, 715 Evans CT"
  const addressLine2 = content.contact_address_line2 || "Kelowna, BC V1X 6G4"
  const hours = content.business_hours || "Mon–Sat · 9AM – 6PM"
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${addressLine1}, ${addressLine2}`,
  )}`

  const close = useCallback(() => setActive(null), [])
  const step = useCallback(
    (dir: 1 | -1) => setActive((i) => (i === null ? i : (i + dir + ALL.length) % ALL.length)),
    [],
  )

  // Arrow keys and Esc drive the lightbox; the body lock stops the page
  // scrolling behind it.
  useEffect(() => {
    if (active === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [active, close, step])

  return (
    <section
      id="showroom"
      className="section-light relative py-24 lg:py-32 border-b border-border overflow-hidden"
    >
      {/* Texture so the large white areas don't read flat */}
      <div className="paper-grid pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-12 gap-10 items-end mb-14">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                / Inside F19
              </span>
              <span className="w-12 h-px bg-primary" />
            </div>
            <h2 className="font-display uppercase text-foreground text-[clamp(2.5rem,7vw,6rem)] leading-[0.9]">
              Come see
              <br />
              <span className="text-primary">the shop.</span>
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="text-base text-muted-foreground leading-relaxed mb-6">
              No stock photos — this is the actual shop on Evans Court. Forty-plus
              rims on the wall to hold against your ride, calibrated changers and
              balancers in the bay, and somewhere comfortable to sit while we work.
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="flex items-center gap-2 text-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {addressLine1}
              </span>
              <span>{hours}</span>
            </div>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-6 inline-flex items-center gap-3 bg-foreground text-background px-6 py-4 font-mono text-[11px] uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Get directions
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        {/* Feature pair */}
        <div className="grid lg:grid-cols-12 gap-4 mb-4">
          {FEATURE.map((shot, i) => (
            <button
              key={shot.file}
              type="button"
              onClick={() => setActive(i)}
              className={`group relative block overflow-hidden bg-card border border-border h-[340px] sm:h-[460px] lg:h-[560px] w-full ${
                i === 0 ? "lg:col-span-7" : "lg:col-span-5"
              }`}
            >
              <Image
                src={`/images/shop/${shot.file}.jpg`}
                alt={shot.title}
                fill
                priority={i === 0}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] bg-primary text-primary-foreground px-2 py-1">
                  {shot.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-left">
                <div className="font-display text-2xl lg:text-3xl uppercase tracking-tight text-white">
                  {shot.title}
                </div>
                <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-white/75">
                  <span className="w-6 h-px bg-primary" />
                  Tap to enlarge
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Masonry — the photos are a mix of portrait and landscape, so columns
            beat a fixed grid: nothing gets cropped to a square. */}
        <div className="columns-2 lg:columns-3 gap-4 [column-fill:balance]">
          {SHOTS.map((shot, i) => (
            <button
              key={shot.file}
              type="button"
              onClick={() => setActive(FEATURE.length + i)}
              className="group relative block w-full mb-4 break-inside-avoid overflow-hidden bg-card border border-border text-left"
            >
              <Image
                src={`/images/shop/${shot.file}-sm.jpg`}
                alt={shot.title}
                width={shot.portrait ? 675 : 900}
                height={shot.portrait ? 900 : 675}
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="w-full h-auto transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-500" />
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-1">
                  {shot.tag}
                </div>
                <div className="font-display text-lg uppercase tracking-tight text-white leading-tight">
                  {shot.title}
                </div>
              </div>
              <span className="absolute top-3 right-3 font-mono text-[10px] tabular-nums bg-background/85 text-foreground px-1.5 py-0.5 group-hover:opacity-0 transition-opacity">
                {String(FEATURE.length + i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="lightbox-backdrop fixed inset-0 z-[100] bg-black/92 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={ALL[active].title}
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 flex items-center justify-center border border-white/25 text-white hover:bg-primary hover:border-primary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            type="button"
            aria-label="Previous"
            onClick={(e) => {
              e.stopPropagation()
              step(-1)
            }}
            className="absolute left-2 sm:left-6 w-11 h-11 flex items-center justify-center border border-white/25 text-white hover:bg-primary hover:border-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(e) => {
              e.stopPropagation()
              step(1)
            }}
            className="absolute right-2 sm:right-6 w-11 h-11 flex items-center justify-center border border-white/25 text-white hover:bg-primary hover:border-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <figure
            className="lightbox-figure relative max-w-[92vw] max-h-[86vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/images/shop/${ALL[active].file}.jpg`}
              alt={ALL[active].title}
              className="max-w-full max-h-[76vh] w-auto h-auto object-contain border border-white/15"
            />
            <figcaption className="mt-4 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.25em] text-white/80">
              <span className="bg-primary text-primary-foreground px-2 py-1">
                {ALL[active].tag}
              </span>
              <span className="text-white">{ALL[active].title}</span>
              <span className="tabular-nums text-white/50">
                {String(active + 1).padStart(2, "0")} / {String(ALL.length).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  )
}
