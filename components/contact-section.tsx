"use client"

import { useActionState } from "react"
import Image from "next/image"
import { ArrowUpRight, Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react"
import { submitInquiry, type ContactFormState } from "@/app/actions/contact"

interface ContactSectionProps {
  content: Record<string, string>
}

const initialState: ContactFormState = { status: "idle", message: "" }

export function ContactSection({ content }: ContactSectionProps) {
  const [state, formAction, isPending] = useActionState(submitInquiry, initialState)

  const phone = content.contact_phone || "778-999-8473"
  const email = content.contact_email || "formula19tires@gmail.com"
  const addressLine1 = content.contact_address_line1 || "Unit 1, 715 Evans CT"
  const addressLine2 = content.contact_address_line2 || "Kelowna, BC V1X 6G4"
  const hours = content.business_hours || "Mon–Sat · 9AM – 6PM"
  const whatsapp = content.whatsapp_number || "17789998473"
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${addressLine1}, ${addressLine2}`,
  )}`

  return (
    <section id="contact" className="relative bg-background py-24 lg:py-32 border-b border-border">
      <div className="mx-auto max-w-[1400px] px-6">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-primary">
              / Contact
            </span>
            <span className="w-12 h-px bg-primary" />
          </div>
          <h2 className="font-display text-foreground uppercase text-[clamp(2.5rem,7vw,6rem)] leading-[0.9]">
            Get in
            <br />
            <span className="text-primary">touch.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left - Contact details */}
          <div className="lg:col-span-5 space-y-8">
            {/* Info cards */}
            <div className="space-y-px bg-border">
              {[
                { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\D/g, "")}` },
                { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
                { icon: MapPin, label: "Location", value: `${addressLine1}, ${addressLine2}`, href: mapsUrl },
                { icon: Clock, label: "Hours", value: hours, href: "#" },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex items-start gap-4 bg-background p-5 hover:bg-card transition-colors border border-border"
                  >
                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-primary text-primary-foreground">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                        {item.label}
                      </div>
                      <div className="font-display text-lg uppercase tracking-tight text-foreground group-hover:text-primary transition-colors break-words">
                        {item.value}
                      </div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary mt-1 flex-shrink-0" />
                  </a>
                )
              })}
            </div>

            {/* WhatsApp card */}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between bg-primary text-primary-foreground p-5 hover:bg-foreground hover:text-background transition-colors"
            >
              <div className="flex items-center gap-4">
                <MessageCircle className="w-6 h-6" />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest opacity-70">
                    Fastest reply
                  </div>
                  <div className="font-display text-lg uppercase tracking-tight">
                    Message on WhatsApp
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            {/* What to look for when you pull up */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block h-64 overflow-hidden border border-border bg-card"
            >
              <Image
                src="/images/shop/storefront-wide.jpg"
                alt={`Formula 19 storefront at ${addressLine1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-4">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-white/70 mb-1">
                    Look for the red sign
                  </div>
                  <div className="font-display text-xl uppercase tracking-tight text-white">
                    {addressLine1}
                  </div>
                </div>
                <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white">
                  Directions
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </a>
          </div>

          {/* Right - Form */}
          <div className="lg:col-span-7">
            <form action={formAction} className="bg-card p-8 lg:p-10 border-2 border-foreground space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="font-display text-2xl uppercase tracking-tight text-foreground">
                  Send a message
                </h3>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Form / 001
                </span>
              </div>

              {state.status === "success" && (
                <div className="bg-primary text-primary-foreground p-4 font-mono text-xs uppercase tracking-widest">
                  ✓ {state.message}
                </div>
              )}
              {state.status === "error" && (
                <div className="border border-destructive text-destructive p-4 font-mono text-xs uppercase tracking-widest">
                  ✕ {state.message}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-6">
                <Field name="name" label="Full Name" required placeholder="Jane Driver" />
                <Field name="email" type="email" label="Email" required placeholder="you@example.com" />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <Field name="phone" type="tel" label="Phone" placeholder="778 555 1234" />
                <Field name="subject" label="Subject" placeholder="Wheel & tire quote" />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2"
                >
                  Message <span className="text-primary">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full bg-background border border-border focus:border-primary focus:outline-none p-3 text-foreground text-sm resize-none"
                  placeholder="Tell us what you're after — size, vehicle, timeline..."
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="group w-full flex items-center justify-between bg-primary text-primary-foreground px-7 py-4 font-display text-lg uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors disabled:opacity-60"
              >
                <span>{isPending ? "Sending..." : "Send Message"}</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
}: {
  name: string
  label: string
  type?: string
  required?: boolean
  placeholder?: string
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2"
      >
        {label} {required && <span className="text-primary">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-background border border-border focus:border-primary focus:outline-none p-3 text-foreground text-sm"
      />
    </div>
  )
}
