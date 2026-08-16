"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  LayoutDashboard,
  Package,
  Images,
  FileText,
  Mail,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Share2,
} from "lucide-react"
import { signOut } from "@/app/actions/admin"

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/content", label: "Site Content", icon: FileText },
  { href: "/admin/socials", label: "Socials", icon: Share2 },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
  { href: "/admin/faqs", label: "FAQs", icon: HelpCircle },
]

interface AdminSidebarProps {
  userEmail: string
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed left-0 right-0 top-0 z-30 flex items-center justify-between border-b border-white/10 bg-sidebar px-4 py-3 lg:hidden">
        <Link href="/admin" className="font-heading text-xl">
          <span className="text-white">FORMULA</span>
          <span className="text-red-500">19</span>
        </Link>
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="rounded-lg p-2 text-white hover:bg-white/10"
          aria-label="Toggle menu"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-white/10 bg-sidebar transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-white/10 p-6">
            <Link
              href="/admin"
              className="block"
              onClick={() => setIsMobileOpen(false)}
            >
              <span className="font-heading text-2xl tracking-wide">
                <span className="text-white">FORMULA</span>
                <span className="text-red-500">19</span>
              </span>
              <p className="mt-1 text-[10px] uppercase tracking-widest text-zinc-400">
                Admin Panel
              </p>
            </Link>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            {nav.map((item) => {
              const active = isActive(item.href, item.exact)
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-red-600/15 text-red-400"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <Link
              href="/"
              target="_blank"
              className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ExternalLink className="h-4 w-4" />
              View Website
            </Link>
            <div className="mb-3 px-3 py-2 text-xs text-zinc-400">
              {userEmail}
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile spacer */}
      <div className="h-14 lg:hidden" />
    </>
  )
}
