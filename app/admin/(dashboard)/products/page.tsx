import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Star } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteProduct } from "@/app/actions/admin"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("display_order", { ascending: true })

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage tires and wheels displayed on your site.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {!products || products.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-card p-12 text-center">
          <p className="text-zinc-400">No products yet.</p>
          <Link
            href="/admin/products/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add your first product
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-zinc-400">Product</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Category</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Rating</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-card">
                          {p.image_url && (
                            <Image
                              src={p.image_url || "/placeholder.svg"}
                              alt={p.name}
                              fill
                              className="object-contain p-1 mix-blend-screen brightness-110"
                            />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{p.name}</p>
                            {p.is_featured && (
                              <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-red-300">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-zinc-400">
                            {p.size} {p.width ? `· ${p.width}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{p.category}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-zinc-300">
                        <Star className="h-3.5 w-3.5 fill-red-500 text-red-500" />
                        {p.rating}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.is_active ? (
                        <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-300">
                          Active
                        </span>
                      ) : (
                        <span className="rounded-full bg-zinc-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-zinc-400">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                          aria-label="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          action={async () => {
                            "use server"
                            return deleteProduct(p.id)
                          }}
                          label={`Delete ${p.name}?`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
