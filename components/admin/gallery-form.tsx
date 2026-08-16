"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import type { GalleryImage } from "@/lib/data"

interface GalleryFormProps {
  image?: GalleryImage
  action: (formData: FormData) => Promise<{ error?: string } | void>
}

export function GalleryForm({ image, action }: GalleryFormProps) {
  const [imagePreview, setImagePreview] = useState(image?.image_url || "")
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-white/10 bg-card p-6 space-y-4">
            <Field label="Title" required>
              <input
                name="title"
                required
                defaultValue={image?.title}
                className="form-input"
                placeholder="Premium Alloy Wheel"
              />
            </Field>
            <Field label="Category" required>
              <input
                name="category"
                required
                defaultValue={image?.category}
                className="form-input"
                placeholder="Wheels"
              />
            </Field>
            <Field label="Alt text">
              <input
                name="alt_text"
                defaultValue={image?.alt_text || ""}
                className="form-input"
                placeholder="Description for accessibility"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Display order">
                <input
                  name="display_order"
                  type="number"
                  defaultValue={image?.display_order ?? 0}
                  className="form-input"
                />
              </Field>
              <div className="flex items-end">
                <label className="flex items-center gap-3 pb-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={image?.is_active ?? true}
                    className="h-4 w-4 rounded border-white/20 bg-white/5 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-sm text-white">Active</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Image</h2>
          <div className="relative mb-3 aspect-square overflow-hidden rounded-lg bg-gradient-to-br from-zinc-800 via-black to-zinc-900">
            {imagePreview ? (
              <Image
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                fill
                className="object-contain p-4 mix-blend-screen brightness-110"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                No image
              </div>
            )}
          </div>
          <Field label="Image URL" required>
            <input
              name="image_url"
              required
              defaultValue={image?.image_url || ""}
              onChange={(e) => setImagePreview(e.target.value)}
              className="form-input"
              placeholder="/images/wheel-1.png"
            />
          </Field>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-red-600/50"
        >
          {isSubmitting ? "Saving..." : image ? "Update image" : "Add image"}
        </button>
        <Link
          href="/admin/gallery"
          className="rounded-lg border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Cancel
        </Link>
      </div>

      <style jsx global>{`
        .form-input {
          width: 100%;
          border-radius: 0.5rem;
          border: 1px solid rgb(255 255 255 / 0.1);
          background: rgb(255 255 255 / 0.05);
          padding: 0.625rem 0.875rem;
          color: white;
          outline: none;
        }
        .form-input::placeholder {
          color: rgb(113 113 122);
        }
        .form-input:focus {
          border-color: rgb(239 68 68);
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
