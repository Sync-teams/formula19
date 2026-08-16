"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/data"

interface ProductFormProps {
  product?: Product
  action: (formData: FormData) => Promise<{ error?: string } | void>
}

export function ProductForm({ product, action }: ProductFormProps) {
  const [imagePreview, setImagePreview] = useState(product?.image_url || "")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

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
      // redirect throws an internal error; treat as success
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
          <div className="rounded-xl border border-white/10 bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Details</h2>
            <div className="space-y-4">
              <Field label="Name" required>
                <input
                  name="name"
                  required
                  defaultValue={product?.name}
                  className="input"
                  placeholder="Apex RS Pro"
                />
              </Field>

              <Field label="Category" required>
                <input
                  name="category"
                  required
                  defaultValue={product?.category}
                  className="input"
                  placeholder="Performance"
                />
              </Field>

              <Field label="Description">
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={product?.description || ""}
                  className="input resize-none"
                  placeholder="High-performance alloy wheel..."
                />
              </Field>

              <div className="grid grid-cols-3 gap-4">
                <Field label="Size">
                  <input
                    name="size"
                    defaultValue={product?.size || ""}
                    className="input"
                    placeholder='19"'
                  />
                </Field>
                <Field label="Width">
                  <input
                    name="width"
                    defaultValue={product?.width || ""}
                    className="input"
                    placeholder="255mm"
                  />
                </Field>
                <Field label="Profile">
                  <input
                    name="profile"
                    defaultValue={product?.profile || ""}
                    className="input"
                    placeholder="35"
                  />
                </Field>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Rating</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Rating (0-5)">
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  defaultValue={product?.rating ?? 5}
                  className="input"
                />
              </Field>
              <Field label="Reviews count">
                <input
                  name="reviews_count"
                  type="number"
                  min="0"
                  defaultValue={product?.reviews_count ?? 0}
                  className="input"
                />
              </Field>
            </div>
          </div>
        </div>

        <div className="space-y-6">
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
            <Field label="Image URL">
              <input
                name="image_url"
                defaultValue={product?.image_url || ""}
                onChange={(e) => setImagePreview(e.target.value)}
                className="input"
                placeholder="/images/wheel-1.png"
              />
            </Field>
            <p className="mt-2 text-xs text-zinc-400">
              Use a path like /images/wheel-1.png or a full URL.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Visibility</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={product?.is_active ?? true}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-white">Active (visible)</span>
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="is_featured"
                  defaultChecked={product?.is_featured ?? false}
                  className="h-4 w-4 rounded border-white/20 bg-white/5 text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-white">Featured</span>
              </label>
              <Field label="Display order">
                <input
                  name="display_order"
                  type="number"
                  defaultValue={product?.display_order ?? 0}
                  className="input"
                />
              </Field>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-red-600/50"
        >
          {isSubmitting ? "Saving..." : product ? "Update product" : "Create product"}
        </button>
        <Link
          href="/admin/products"
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
