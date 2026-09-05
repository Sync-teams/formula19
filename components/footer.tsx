import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import type { SocialLink } from "@/lib/data"
import { socialIcon, socialLabel } from "@/lib/social-icons"

interface FooterProps {
  content: Record<string, string>
  socials?: SocialLink[]
}

export function Footer({ content, socials = [] }: FooterProps) {
  const phone = content.contact_phone || "778-999-8473"
  const email = content.contact_email || "formula19tires@gmail.com"
  const addressLine1 = content.contact_address_line1 || "Unit 1, 715 Evans CT"
  const addressLine2 = content.contact_address_line2 || "Kelowna, BC V1X 6G4"

  return (
    <footer className="bg-background text-foreground border-t-2 border-primary">
      {/* Massive wordmark */}
      <div className="border-b border-border py-16 lg:py-24 overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6">
          <Link href="/" className="block group">
            <div className="font-display text-[clamp(4rem,18vw,18rem)] leading-[0.8] tracking-[-0.02em] uppercase">
              FORMULA <span className="text-primary">19</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground">
              <span>Tires & Wheels</span>
              <span className="w-1 h-1 bg-primary" />
              <span>Kelowna, BC</span>
              <span className="w-1 h-1 bg-primary" />
              <span>Est. 2026</span>
              <span className="w-1 h-1 bg-primary" />
              <span>N 0719</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 grid grid-cols-2 lg:grid-cols-4 gap-10">
        <div className="col-span-2">
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
            / The Garage
          </div>
          <address className="not-italic font-display text-xl uppercase tracking-[0.05em] text-foreground space-y-2">
            <div>{addressLine1}</div>
            <div>{addressLine2}</div>
          </address>
          <div className="mt-6 space-y-3 text-sm">
            <a
              href={`tel:${phone.replace(/\D/g, "")}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary"
            >
              <Phone className="w-3.5 h-3.5" /> {phone}
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary break-all"
            >
              <Mail className="w-3.5 h-3.5" /> {email}
            </a>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" /> Kelowna, BC
            </div>
          </div>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
            / Catalog
          </div>
          <ul className="space-y-3 text-sm">
            <li><a href="/#products" className="text-muted-foreground hover:text-primary">Performance Tires</a></li>
            <li><a href="/#products" className="text-muted-foreground hover:text-primary">Alloy Wheels</a></li>
            <li><a href="/#products" className="text-muted-foreground hover:text-primary">Winter Range</a></li>
            <li><a href="/#products" className="text-muted-foreground hover:text-primary">Off-Road</a></li>
          </ul>
        </div>

        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-primary mb-4">
            / Shop
          </div>
          <ul className="space-y-3 text-sm">
            <li><a href="/#about" className="text-muted-foreground hover:text-primary">About</a></li>
            <li><a href="/#services" className="text-muted-foreground hover:text-primary">Services</a></li>
            <li>
              <Link href="/financing" className="text-muted-foreground hover:text-primary">
                Financing
              </Link>
            </li>
            <li><a href="/#showroom" className="text-muted-foreground hover:text-primary">The Shop</a></li>
            <li><a href="/#contact" className="text-muted-foreground hover:text-primary">Contact</a></li>
            <li>
              <Link href="/admin/login" className="text-muted-foreground/60 hover:text-primary">
                Staff Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Colophon */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-[1400px] px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            © {new Date().getFullYear()} Formula 19 Tires. Built for the road.
          </p>
          {socials.length > 0 ? (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Follow
              </span>
              {socials.map((s) => {
                const Icon = socialIcon(s.platform)
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLabel(s.platform, s.label)}
                    title={socialLabel(s.platform, s.label)}
                    className="text-foreground hover:text-primary"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>

      {/* Bottom checkered band */}
      <div className="h-2 checkered" />
    </footer>
  )
}
