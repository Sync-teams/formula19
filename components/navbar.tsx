"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Menu, X, Phone, Search } from "lucide-react"
import { SearchOverlay } from "@/components/search-overlay"

interface NavbarProps {
  content: Record<string, string>
}

const nav = [
  { label: "Tires", href: "#products", num: "01" },
  { label: "Services", href: "#services", num: "02" },
  { label: "Financing", href: "/financing", num: "03" },
  { label: "Garage", href: "#about", num: "04" },
  { label: "The Shop", href: "#showroom", num: "05" },
  { label: "FAQ", href: "#faq", num: "06" },
  { label: "Contact", href: "#contact", num: "07" },
]

export function Navbar({ content }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === "/"

  // The homepage sections are anchors. From any other route (e.g. /financing)
  // they have to be rewritten as root-relative links or they resolve against
  // the current path and go nowhere.
  const resolve = (href: string) =>
    href.startsWith("#") && !isHome ? `/${href}` : href

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      {/* Top utility bar */}
      <div className="hidden md:block bg-primary text-primary-foreground">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between px-6 py-2 text-xs font-mono uppercase tracking-widest">
          <div className="flex items-center gap-6">
            <span>Kelowna · BC</span>
            <span className="opacity-60">|</span>
            <span>{content.business_hours || "MON–SAT 9AM–6PM"}</span>
          </div>
          <a
            href={`tel:${content.contact_phone || "778-999-8473"}`}
            className="flex items-center gap-2 hover:opacity-70"
          >
            <Phone className="w-3 h-3" />
            {content.contact_phone || "778-999-8473"}
          </a>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all border-b ${
          scrolled
            ? "bg-background/95 backdrop-blur border-border"
            : "bg-background border-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1400px] flex items-center justify-between px-6 h-20">
          <Link
            href={isHome ? "#top" : "/"}
            className="flex items-center group"
            aria-label="Formula 19 — All About Tires"
          >
            <Image
              src="/images/logo.png"
              alt="Formula 19 — All About Tires"
              width={280}
              height={80}
              priority
              className="h-16 w-auto md:h-20 object-contain"
            />
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {nav.map((item) => (
              <a
                key={item.label}
                href={resolve(item.href)}
                className="group flex items-center gap-1.5 px-3 py-2 text-sm font-medium uppercase tracking-wider text-foreground hover:text-primary transition-colors"
              >
                <span className="font-mono text-[10px] text-muted-foreground group-hover:text-primary">
                  {item.num}
                </span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-foreground hover:text-primary transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>
            <a
              href={resolve("#contact")}
              className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 font-display text-base tracking-wider uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              Book Service
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="xl:hidden w-10 h-10 flex items-center justify-center text-foreground"
              aria-label="Toggle menu"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Checkered accent line */}
        <div className="h-[3px] checkered" />

        {/* Mobile menu */}
        {open && (
          <div className="xl:hidden border-t border-border bg-background">
            <div className="px-6 py-6 space-y-1">
              {nav.map((item) => (
                <a
                  key={item.label}
                  href={resolve(item.href)}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 py-3 text-foreground hover:text-primary border-b border-border"
                >
                  <span className="font-mono text-xs text-muted-foreground w-6">{item.num}</span>
                  <span className="font-display text-2xl tracking-tight uppercase">{item.label}</span>
                </a>
              ))}
              <a
                href={`tel:${content.contact_phone || "778-999-8473"}`}
                className="flex items-center justify-center gap-2 mt-6 bg-primary text-primary-foreground py-4 font-display text-lg uppercase tracking-wider"
              >
                <Phone className="w-4 h-4" /> {content.contact_phone || "778-999-8473"}
              </a>
            </div>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
