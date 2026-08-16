"use client"

import { useState, useTransition } from "react"
import { Mail, Phone, Trash2, ChevronDown } from "lucide-react"
import { updateInquiryStatus, deleteInquiry } from "@/app/actions/admin"
import type { Inquiry } from "@/lib/data"

interface InquiriesListProps {
  inquiries: Inquiry[]
}

const STATUS_OPTIONS = [
  { value: "new", label: "New", color: "bg-red-500/20 text-red-300" },
  { value: "read", label: "Read", color: "bg-blue-500/20 text-blue-300" },
  {
    value: "replied",
    label: "Replied",
    color: "bg-emerald-500/20 text-emerald-300",
  },
  {
    value: "archived",
    label: "Archived",
    color: "bg-zinc-500/20 text-zinc-300",
  },
]

export function InquiriesList({ inquiries }: InquiriesListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [, startTransition] = useTransition()

  const filtered =
    filter === "all"
      ? inquiries
      : inquiries.filter((i) => i.status === filter)

  const handleStatusChange = (id: string, status: string) => {
    startTransition(async () => {
      await updateInquiryStatus(id, status)
    })
  }

  const handleDelete = (id: string) => {
    if (confirm("Delete this inquiry permanently?")) {
      startTransition(async () => {
        await deleteInquiry(id)
      })
    }
  }

  const counts = {
    all: inquiries.length,
    new: inquiries.filter((i) => i.status === "new").length,
    read: inquiries.filter((i) => i.status === "read").length,
    replied: inquiries.filter((i) => i.status === "replied").length,
    archived: inquiries.filter((i) => i.status === "archived").length,
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { v: "all", l: "All" },
          { v: "new", l: "New" },
          { v: "read", l: "Read" },
          { v: "replied", l: "Replied" },
          { v: "archived", l: "Archived" },
        ].map((f) => (
          <button
            key={f.v}
            onClick={() => setFilter(f.v)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.v
                ? "bg-red-600 text-white"
                : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f.l} ({counts[f.v as keyof typeof counts]})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-card p-12 text-center text-zinc-400">
          No inquiries in this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => {
            const isExpanded = expandedId === inq.id
            const statusInfo =
              STATUS_OPTIONS.find((s) => s.value === inq.status) ||
              STATUS_OPTIONS[0]
            return (
              <div
                key={inq.id}
                className="overflow-hidden rounded-xl border border-white/10 bg-card"
              >
                <button
                  onClick={() => setExpandedId(isExpanded ? null : inq.id)}
                  className="flex w-full items-start gap-4 p-4 text-left transition-colors hover:bg-white/[0.02]"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-600/20 font-semibold text-red-300">
                    {inq.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-white">{inq.name}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${statusInfo.color}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-zinc-400">
                      {inq.subject || inq.message}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-zinc-400">
                      {new Date(inq.created_at).toLocaleDateString()}
                    </div>
                    <ChevronDown
                      className={`ml-auto mt-1 h-4 w-4 text-zinc-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-white/10 bg-black/30 p-4">
                    <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <a
                        href={`mailto:${inq.email}`}
                        className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
                      >
                        <Mail className="h-4 w-4 text-red-400" />
                        {inq.email}
                      </a>
                      {inq.phone && (
                        <a
                          href={`tel:${inq.phone}`}
                          className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
                        >
                          <Phone className="h-4 w-4 text-red-400" />
                          {inq.phone}
                        </a>
                      )}
                    </div>

                    {inq.subject && (
                      <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
                        Subject
                      </p>
                    )}
                    {inq.subject && (
                      <p className="mb-4 font-medium text-white">
                        {inq.subject}
                      </p>
                    )}

                    <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
                      Message
                    </p>
                    <p className="mb-4 whitespace-pre-wrap text-sm text-zinc-300">
                      {inq.message}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs text-zinc-400">Status:</span>
                        {STATUS_OPTIONS.map((s) => (
                          <button
                            key={s.value}
                            onClick={() => handleStatusChange(inq.id, s.value)}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase transition-all ${
                              inq.status === s.value
                                ? s.color
                                : "bg-white/5 text-zinc-400 hover:bg-white/10"
                            }`}
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
