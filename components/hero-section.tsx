"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface HeroSectionProps {
  content: Record<string, string>
}

const SLIDES = [
  { src: "/images/wheel-1.png", label: "Performance Alloys", tag: "Wheels" },
  { src: "/images/tire-detail.jpg", label: "All-Season Grip", tag: "Tires" },
  { src: "/images/wheel-2.png", label: "Forged Multi-Spoke", tag: "Wheels" },
  { src: "/images/cat-accessories.jpg", label: "Lugs & TPMS", tag: "Accessories" },
  { src: "/images/wheel-3.png", label: "Off-Road Beadlock", tag: "Wheels" },
  { src: "/images/tire-stack.jpg", label: "Track Compound", tag: "Tires" },
  { src: "/images/wheel-4.png", label: "Concave Sport", tag: "Wheels" },
  { src: "/images/cat-truck.jpg", label: "Mud-Terrain", tag: "Tires" },
  { src: "/images/wheel-5.png", label: "Luxury Finish", tag: "Wheels" },
  { src: "/images/wheel-6.png", label: "Track-Ready", tag: "Wheels" },
]

function Slide({ src, label, tag }: { src: string; label: string; tag: string }) {
  return (
    <article className="relative w-[260px] sm:w-[300px] lg:w-[340px] shrink-0 aspect-[4/5] bg-card border border-border overflow-hidden group">
      <Image
        src={src || "/placeholder.svg"}
        alt={label}
        fill
        sizes="340px"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
      <div className="absolute top-4 left-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] bg-primary text-primary-foreground px-2 py-1">
          {tag}
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-display uppercase text-foreground text-lg lg:text-xl leading-tight">
          {label}
        </h3>
        <div className="mt-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70">
          <span className="w-6 h-px bg-primary" />
          Shop now
        </div>
      </div>
    </article>
  )
}

export function HeroSection({ content }: HeroSectionProps) {
  const loop = [...SLIDES, ...SLIDES]

  return (
    <section id="top" className="relative bg-background overflow-hidden border-b border-border">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-car.jpg"
          alt="Performance vehicle at our showroom"
          fill
          priority
          className="object-cover object-right opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/35" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 pt-20 pb-10 lg:pt-28 lg:pb-14">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          {/* Headline column */}
          <div className="lg:col-span-7 xl:col-span-6">
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-foreground/80">
                Spring Wheel & Tire Event
              </span>
            </div>
            <h1 className="font-display uppercase text-foreground leading-[1.05] tracking-wide text-[clamp(2.25rem,5.5vw,4.5rem)]">
              <span className="block">Wheels &amp; Tires</span>
              <span className="block mt-2">
                Sale{" "}
                <span className="inline-block bg-primary text-primary-foreground px-3 py-0.5 tracking-wider">
                  Up to 10% Off
                </span>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base lg:text-lg text-foreground/70 leading-relaxed">
              {content.hero_description ||
                "Find the perfect set for your ride. Free shipping across BC on orders over $1,000. Certified install at our Kelowna shop."}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#products"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 hover:bg-foreground hover:text-background transition-colors"
              >
                Shop Featured <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 border border-border bg-background/40 backdrop-blur text-foreground font-mono text-xs uppercase tracking-[0.2em] px-6 py-4 hover:border-primary hover:text-primary transition-colors"
              >
                Book Install
              </Link>
            </div>

            {/* Stats removed per content update */}
          </div>

          {/* Right column kept empty so the background car shines through */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6" aria-hidden />
        </div>
      </div>

      {/* Auto-scrolling product slider */}
      <div className="relative pb-12 lg:pb-16">
        <div className="mx-auto max-w-[1400px] px-6 mb-5 flex items-end justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              / Featured
            </span>
            <h2 className="mt-1 font-display uppercase text-foreground text-2xl lg:text-3xl leading-none">
              Just In
            </h2>
          </div>
          <Link
            href="#products"
            className="hidden sm:inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/70 hover:text-primary transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 lg:w-32 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-32 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex gap-4 lg:gap-5 w-max animate-marquee py-2">
            {loop.map((s, i) => (
              <Slide key={`${s.label}-${i}`} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
