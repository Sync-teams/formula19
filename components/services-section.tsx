import { Disc3, Wrench, Snowflake, Cog, ShieldCheck } from "lucide-react"

const services = [
  {
    num: "01",
    icon: Disc3,
    title: "Tire Sales & Install",
    description:
      "Full inventory of performance, all-season, winter, and off-road tires from premium brands. Same-day installation available.",
  },
  {
    num: "02",
    icon: Wrench,
    title: "Tire Installation",
    description:
      "Professional tire installation with hand-balanced wheels and proper torque specs. Same-day service on stocked sizes.",
  },
  {
    num: "03",
    icon: Cog,
    title: "Balancing & Rotation",
    description:
      "Computer-balanced wheels with proper torque specs. Free rotation with every new set of tires we install.",
  },
  {
    num: "04",
    icon: Snowflake,
    title: "Seasonal Swaps",
    description:
      "Winter to summer changeovers with secure tire storage. Skip the garage clutter and the wait.",
  },
  {
    num: "05",
    icon: Wrench,
    title: "Custom Wheel Fitting",
    description:
      "Aftermarket wheel sales and fitting with hub-centric rings. We verify offsets and clearance before install.",
  },
  {
    num: "06",
    icon: ShieldCheck,
    title: "TPMS Service",
    description:
      "Tire pressure sensor diagnostics, programming, and replacement. We get your warning lights off — properly.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="section-light relative py-24 lg:py-32 border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
                / Services
              </span>
              <span className="w-12 h-px bg-primary" />
            </div>
            <h2 className="font-display text-foreground uppercase text-[clamp(2.5rem,7vw,6rem)] leading-[0.9]">
              Full pit-lane
              <br />
              <span className="text-primary">service.</span>
            </h2>
          </div>
          <p className="max-w-md text-muted-foreground text-base leading-relaxed">
            Six core services, one shop. Every job is performed by certified
            technicians using calibrated equipment — no shortcuts, no surprises.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {services.map((s) => {
            const Icon = s.icon
            return (
              <article
                key={s.num}
                className="group relative bg-background p-8 lg:p-10 hover:bg-card transition-colors"
              >
                <div className="flex items-start justify-between mb-8">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    {s.num} / 06
                  </span>
                  <div className="w-12 h-12 flex items-center justify-center border border-border group-hover:bg-primary group-hover:border-primary transition-colors">
                    <Icon className="w-5 h-5 text-foreground group-hover:text-primary-foreground transition-colors" />
                  </div>
                </div>
                <h3 className="font-display text-3xl text-foreground uppercase mb-3 tracking-tight">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
                <div className="mt-6 h-px w-12 bg-primary" />
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
