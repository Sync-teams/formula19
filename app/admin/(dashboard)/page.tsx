import { createClient } from "@/lib/supabase/server"
import { Package, Images, Mail, HelpCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

async function getStats() {
  const supabase = await createClient()
  const [products, gallery, inquiries, faqs, newInquiries] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("gallery_images").select("id", { count: "exact", head: true }),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
    supabase.from("faqs").select("id", { count: "exact", head: true }),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
  ])
  return {
    products: products.count ?? 0,
    gallery: gallery.count ?? 0,
    inquiries: inquiries.count ?? 0,
    faqs: faqs.count ?? 0,
    newInquiries: newInquiries.count ?? 0,
  }
}

async function getRecentInquiries() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("inquiries")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)
  return data || []
}

export default async function AdminDashboard() {
  const [stats, recent] = await Promise.all([getStats(), getRecentInquiries()])

  const cards = [
    {
      label: "Products",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
      color: "text-red-400",
      bg: "bg-red-600/10",
    },
    {
      label: "Gallery Images",
      value: stats.gallery,
      icon: Images,
      href: "/admin/gallery",
      color: "text-blue-400",
      bg: "bg-blue-600/10",
    },
    {
      label: "Total Inquiries",
      value: stats.inquiries,
      icon: Mail,
      href: "/admin/inquiries",
      color: "text-emerald-400",
      bg: "bg-emerald-600/10",
      badge: stats.newInquiries > 0 ? `${stats.newInquiries} new` : undefined,
    },
    {
      label: "FAQs",
      value: stats.faqs,
      icon: HelpCircle,
      href: "/admin/faqs",
      color: "text-zinc-300",
      bg: "bg-zinc-600/10",
    },
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your store, gallery, and customer inquiries.
        </p>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group rounded-xl border border-white/10 bg-card p-5 transition-all hover:border-red-500/30 hover:bg-card/80"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-lg ${card.bg} p-2.5`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                {card.badge && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {card.badge}
                  </span>
                )}
              </div>
              <div className="text-3xl font-bold text-white">{card.value}</div>
              <div className="mt-1 text-sm text-zinc-400">{card.label}</div>
            </Link>
          )
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-card">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Recent Inquiries</h2>
          <Link
            href="/admin/inquiries"
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center text-sm text-zinc-400">
            No inquiries yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {recent.map((inq) => (
              <div
                key={inq.id}
                className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-white">{inq.name}</p>
                    {inq.status === "new" && (
                      <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-red-300">
                        New
                      </span>
                    )}
                  </div>
                  <p className="truncate text-sm text-zinc-400">
                    {inq.subject || inq.message}
                  </p>
                </div>
                <div className="text-xs text-zinc-400">
                  {new Date(inq.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
