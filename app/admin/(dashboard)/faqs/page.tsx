import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteFaq } from "@/app/actions/admin"

export const dynamic = "force-dynamic"

export default async function AdminFaqsPage() {
  const supabase = await createClient()
  const { data: faqs } = await supabase
    .from("faqs")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">FAQs</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage frequently asked questions.
          </p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Add FAQ
        </Link>
      </div>

      {!faqs || faqs.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-card p-12 text-center text-zinc-400">
          No FAQs yet.
        </div>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="rounded-xl border border-white/10 bg-card p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="font-semibold text-white">{faq.question}</h3>
                    {!faq.is_active && (
                      <span className="rounded-full bg-zinc-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-400">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zinc-400">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/faqs/${faq.id}`}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                    aria-label="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <DeleteButton
                    action={async () => {
                      "use server"
                      return deleteFaq(faq.id)
                    }}
                    label="Delete?"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
