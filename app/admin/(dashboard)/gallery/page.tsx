import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import Link from "next/link"
import { Plus, Edit } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteGalleryImage } from "@/app/actions/admin"

export const dynamic = "force-dynamic"

export default async function AdminGalleryPage() {
  const supabase = await createClient()
  const { data: images } = await supabase
    .from("gallery_images")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gallery</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage photos shown in the gallery section.
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Add image
        </Link>
      </div>

      {!images || images.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-card p-12 text-center text-zinc-400">
          No gallery images yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div
              key={img.id}
              className="overflow-hidden rounded-xl border border-white/10 bg-card"
            >
              <div className="relative aspect-square bg-gradient-to-br from-zinc-800 via-black to-zinc-900 p-4">
                <Image
                  src={img.image_url || "/placeholder.svg"}
                  alt={img.alt_text || img.title}
                  fill
                  className="object-contain p-4 mix-blend-screen brightness-110"
                />
                {!img.is_active && (
                  <span className="absolute left-2 top-2 rounded-full bg-zinc-500/30 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-300">
                    Hidden
                  </span>
                )}
              </div>
              <div className="border-t border-white/10 p-4">
                <p className="truncate text-sm font-medium text-white">
                  {img.title}
                </p>
                <p className="mb-3 text-xs text-zinc-400">{img.category}</p>
                <div className="flex items-center justify-end gap-2">
                  <Link
                    href={`/admin/gallery/${img.id}`}
                    className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                    aria-label="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <DeleteButton
                    action={async () => {
                      "use server"
                      return deleteGalleryImage(img.id)
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
