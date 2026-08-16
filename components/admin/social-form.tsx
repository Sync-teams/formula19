"use client"

import { useState } from "react"
import Link from "next/link"
import type { SocialLink } from "@/lib/data"

interface SocialFormProps {
  socialLink?: SocialLink
  action: (formData: FormData) => Promise<{ error?: string } | void>
}

const PLATFORMS = [
  "facebook",
  "instagram",
  "tiktok",
  "youtube",
  "x",
  "twitter",
  "linkedin",
  "whatsapp",
  "twitch",
  "other",
]

export function SocialForm({ socialLink, action }: SocialFormProps) {
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

      <div className="rounded-xl border border-white/10 bg-card p-6 space-y-4">
        <Field label="Platform" required>
          <select
            name="platform"
            required
            defaultValue={socialLink?.platform ?? "facebook"}
            className="input"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p} className="bg-card">
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Display label">
          <input
            name="label"
            defaultValue={socialLink?.label ?? ""}
            className="input"
            placeholder="Optional - shown to screen readers"
          />
        </Field>

        <Field label="URL" required>
          <input
            name="url"
            type="url"
            required
            defaultValue={socialLink?.url ?? ""}
            className="input"
            placeholder="https://instagram.com/yourhandle"
          />
        </Field>

        <Field label="Display order">
          <input
            name="display_order"
            type="number"
            defaultValue={socialLink?.display_order ?? 0}
            className="input"
          />
        </Field>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={socialLink?.is_active ?? true}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-white">Active (visible on site)</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-red-600/50"
        >
          {isSubmitting
            ? "Saving..."
            : socialLink
              ? "Update social link"
              : "Add social link"}
        </button>
        <Link
          href="/admin/socials"
          className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Cancel
        </Link>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(255 255 255 / 0.1);
          background: rgb(255 255 255 / 0.05);
          padding: 0.625rem 0.875rem;
          color: white;
          outline: none;
        }
        .input::placeholder {
          color: rgb(113 113 122);
        }
        .input:focus {
          border-color: rgb(239 68 68);
          box-shadow: 0 0 0 2px rgb(239 68 68 / 0.2);
        }
      `}</style>
    </form>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}
