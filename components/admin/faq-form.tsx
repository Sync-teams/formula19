"use client"

import { useState } from "react"
import Link from "next/link"
import type { Faq } from "@/lib/data"

interface FaqFormProps {
  faq?: Faq
  action: (formData: FormData) => Promise<{ error?: string } | void>
}

export function FaqForm({ faq, action }: FaqFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    setError(null)
    try {
      const result = await action(formData)
      if (result && "error" in result && result.error) {
        setError(result.error)
        setIsSubmitting(false)
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes("NEXT_REDIRECT")) return
      setError(e instanceof Error ? e.message : "Something went wrong")
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-600/30 bg-red-600/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-white/10 bg-card p-6">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
            Question <span className="text-red-500">*</span>
          </label>
          <input
            name="question"
            required
            defaultValue={faq?.question}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="What tire sizes do you offer?"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
            Answer <span className="text-red-500">*</span>
          </label>
          <textarea
            name="answer"
            required
            rows={5}
            defaultValue={faq?.answer}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            placeholder="We offer a complete range..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
              Display order
            </label>
            <input
              name="display_order"
              type="number"
              defaultValue={faq?.display_order ?? 0}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 pb-2">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={faq?.is_active ?? true}
                className="h-4 w-4 rounded border-white/20 bg-white/5 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-white">Active</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-red-600/50"
        >
          {isSubmitting ? "Saving..." : faq ? "Update FAQ" : "Add FAQ"}
        </button>
        <Link
          href="/admin/faqs"
          className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Cancel
        </Link>
      </div>
    </form>
  )
}
