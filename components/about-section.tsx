import Image from "next/image"
import { ArrowUpRight, Award, Clock } from "lucide-react"

interface AboutSectionProps {
  content: Record<string, string>
}

const values = [
  { icon: Award, label: "Certified Techs", detail: "Factory-trained installers" },
  { icon: Clock, label: "Same-Day Service", detail: "On stocked sizes" },
]

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section id="about" className="relative bg-background py-24 lg:py-32 border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left - Image */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] bg-card overflow-hidden">
              <Image
                src="/images/shop/wheel-wall-grid.jpg"
                alt="The wheel wall inside the Formula 19 showroom"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary" />
            </div>

            {/* Plate label */}
            <div className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>Plate 02 / The Wheel Wall</span>
              <span>F19 Workshop, Kelowna BC</span>
            </div>
          </div>

          {/* Right - Content */}
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                / The Garage
              </span>
              <span className="w-12 h-px bg-primary" />
            </div>

            <h2 className="font-display text-foreground uppercase text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] mb-8">
              {content.about_title || "Engineering Excellence"}
              <br />
              <span className="text-primary">for drivers.</span>
            </h2>

            <div className="space-y-4 text-base text-muted-foreground leading-relaxed max-w-xl mb-10">
              <p>
                {content.about_description ||
                  "Formula 19 delivers premium tire and wheel services with precision, expertise, and honest craftsmanship."}
              </p>
              <p>
                Tagged by the community as Kelowna's trusted automotive specialists.
                We balance speed with quality — every job done right, first time.
              </p>
            </div>

            {/* Values grid */}
            <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
              {values.map((v) => {
                const Icon = v.icon
                return (
                  <div
                    key={v.label}
                    className="group bg-background p-5 flex items-start gap-4 hover:bg-card transition-colors"
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-border group-hover:bg-primary group-hover:border-primary transition-colors">
                      <Icon className="w-4 h-4 text-foreground group-hover:text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-display text-base uppercase tracking-tight text-foreground">
                        {v.label}
                      </div>
                      <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                        {v.detail}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <a
              href="#showroom"
              className="mt-10 inline-flex items-center gap-3 font-display text-lg uppercase tracking-wider text-foreground underline-grow"
            >
              Look inside the shop <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
