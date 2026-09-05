"use client"

import Image from "next/image"
import { Heart, MessageCircle, Bookmark, Send } from "lucide-react"

type InstagramPost = {
  handle: string
  avatar: string
  image: string
  caption: string
  likes: string
  hours: string
  verified?: boolean
}

const POSTS: InstagramPost[] = [
  {
    handle: "alexis.drives",
    avatar: "/images/avatar-1.jpg",
    image: "/images/ig-1.jpg",
    caption:
      "New shoes from @formula19 — bronze on black hits different. Fitment was flawless, install in under an hour.",
    likes: "2,148",
    hours: "3h",
    verified: true,
  },
  {
    handle: "type_r_kara",
    avatar: "/images/avatar-2.jpg",
    image: "/images/ig-2.jpg",
    caption:
      "Picked up my new set from the Formula 19 guys today. They actually know their stuff — recommended the perfect compound for the Civic.",
    likes: "964",
    hours: "5h",
  },
  {
    handle: "overland.marcus",
    avatar: "/images/avatar-3.jpg",
    image: "/images/ig-3.jpg",
    caption:
      "Tacoma sitting right on the new MTs. Huge thanks to @formula19 for hooking it up — best price I found anywhere in BC.",
    likes: "3,402",
    hours: "8h",
    verified: true,
  },
  {
    handle: "ev.daily",
    avatar: "/images/avatar-1.jpg",
    image: "/images/ig-4.jpg",
    caption:
      "Swapped to a proper EV-rated tire and the range is back. Quiet, grippy, and zero drama. 10/10 service.",
    likes: "1,287",
    hours: "12h",
  },
  {
    handle: "rs5.alpine",
    avatar: "/images/avatar-2.jpg",
    image: "/images/ig-5.jpg",
    caption:
      "Mountain run with fresh rubber. @formula19 had them in stock when nobody else did. Same-day install. Insane.",
    likes: "5,019",
    hours: "1d",
    verified: true,
  },
  {
    handle: "okanagan.garage",
    avatar: "/images/avatar-3.jpg",
    image: "/images/ig-6.jpg",
    caption:
      "Restocked the shop with summer sets. If you need wheels in the valley, these are the people to call.",
    likes: "812",
    hours: "1d",
  },
  {
    handle: "siobhan.o",
    avatar: "/images/avatar-2.jpg",
    image: "/images/cat-ev.jpg",
    caption:
      "Couldn't be happier. They even loaded the wheels into the car for me. Highly recommend the Formula 19 crew.",
    likes: "1,540",
    hours: "2d",
  },
  {
    handle: "trackday.eric",
    avatar: "/images/avatar-1.jpg",
    image: "/images/cat-offroad.jpg",
    caption:
      "Heading to Mission Raceway with a fresh set of R-comps. Balanced, mounted, and out the door same day.",
    likes: "2,776",
    hours: "2d",
    verified: true,
  },
]

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 inline-block ml-1 align-middle">
      <path
        fill="#1d9bf0"
        d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .493.083.963.237 1.398-1.272.65-2.146 2.022-2.146 3.6 0 1.58.874 2.95 2.146 3.6-.154.435-.237.905-.237 1.4 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.336-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.493-.084-.963-.238-1.398 1.273-.65 2.148-2.02 2.148-3.6z"
      />
      <path
        fill="#fff"
        d="m12 17-3.6-3.6 1.4-1.4L12 14.2l5.2-5.2 1.4 1.4z"
      />
    </svg>
  )
}

function InstagramCard({ post }: { post: InstagramPost }) {
  return (
    <article className="w-[300px] sm:w-[340px] shrink-0 bg-card border border-border overflow-hidden flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 py-3 border-b border-border">
        <div className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/40">
          <Image src={post.avatar || "/placeholder.svg"} alt={post.handle} fill className="object-cover" sizes="32px" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate flex items-center">
            {post.handle}
            {post.verified && <VerifiedBadge />}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Kelowna, BC
          </div>
        </div>
        <div className="text-foreground/60 text-xs">•••</div>
      </header>

      {/* Image */}
      <div className="relative aspect-square bg-background">
        <Image
          src={post.image || "/placeholder.svg"}
          alt={`${post.handle} post`}
          fill
          sizes="340px"
          className="object-cover"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 px-3 pt-3">
        <Heart className="w-6 h-6 text-foreground fill-primary stroke-primary" aria-label="like" />
        <MessageCircle className="w-6 h-6 text-foreground" aria-label="comment" />
        <Send className="w-6 h-6 text-foreground" aria-label="share" />
        <Bookmark className="w-6 h-6 text-foreground ml-auto" aria-label="save" />
      </div>

      {/* Likes + caption */}
      <div className="px-3 pt-2 pb-4 flex-1">
        <div className="text-sm font-semibold text-foreground">
          <span className="num-badge">{post.likes}</span> likes
        </div>
        <p className="mt-1 text-sm text-foreground/85 leading-snug line-clamp-3">
          <span className="font-semibold text-foreground">{post.handle}</span>{" "}
          {post.caption}
        </p>
        <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {post.hours} ago
        </div>
      </div>
    </article>
  )
}

function InstagramLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function TestimonialsSection() {
  const loopA = [...POSTS, ...POSTS]
  const loopB = [...POSTS.slice().reverse(), ...POSTS.slice().reverse()]

  return (
    <section id="reviews" className="section-light relative py-20 lg:py-28 overflow-hidden border-y border-border">
      <div className="mx-auto max-w-[1400px] px-6 mb-12">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-primary">
              <InstagramLogo className="w-4 h-4" />
              / @formula19
            </span>
            <h2 className="mt-3 font-display uppercase text-foreground text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] tracking-wide">
              <span className="block">Tagged by</span>
              <span className="block">the community</span>
            </h2>
            <p className="mt-4 max-w-xl text-foreground/70 leading-relaxed">
              Real builds from real customers. Tag <span className="text-primary">@formula19</span> on Instagram to be featured.
            </p>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 border border-border bg-background/60 backdrop-blur text-foreground font-mono text-[10px] uppercase tracking-[0.25em] px-5 py-3 hover:border-primary hover:text-primary transition-colors"
          >
            <InstagramLogo className="w-4 h-4" />
            Follow on Instagram
          </a>
        </div>
      </div>

      {/* Row 1 — left to right */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 lg:w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex gap-4 lg:gap-5 w-max animate-marquee py-2">
          {loopA.map((post, i) => (
            <InstagramCard key={`a-${post.handle}-${i}`} post={post} />
          ))}
        </div>
      </div>

      {/* Row 2 — right to left (reversed loop using fast variant for variation) */}
      <div className="relative mt-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 lg:w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 lg:w-32 bg-gradient-to-l from-background to-transparent z-10" />
        <div className="flex gap-4 lg:gap-5 w-max animate-marquee-reverse py-2">
          {loopB.map((post, i) => (
            <InstagramCard key={`b-${post.handle}-${i}`} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
