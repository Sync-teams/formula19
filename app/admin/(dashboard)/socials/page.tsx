import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Plus, Edit, ExternalLink } from "lucide-react"
import { DeleteButton } from "@/components/admin/delete-button"
import { deleteSocialLink } from "@/app/actions/admin"
import type { SocialLink } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function AdminSocialsPage() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order", { ascending: true })

  const socials: SocialLink[] = (data as SocialLink[]) || []

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Socials</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage the social media links shown in the site footer.
          </p>
        </div>
        <Link
          href="/admin/socials/new"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
        >
          <Plus className="h-4 w-4" />
          Add social link
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-600/30 bg-red-600/10 p-6 text-sm text-red-300">
          Could not load social links: {error.message}. Make sure migration{" "}
          <code className="font-mono">scripts/002_social_links.sql</code> has
          been applied to this database.
        </div>
      ) : socials.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-card p-12 text-center">
          <p className="text-zinc-400">No social links yet.</p>
          <Link
            href="/admin/socials/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Add your first link
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/10 bg-white/[0.02] text-left">
                <tr>
                  <th className="px-4 py-3 font-medium text-zinc-400">Platform</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">URL</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Order</th>
                  <th className="px-4 py-3 font-medium text-zinc-400">Status</th>
                  <th className="px-4 py-3 text-right font-medium text-zinc-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {socials.map((s) => (
                  <tr key={s.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white capitalize">
                        {s.platform}
                      </p>
                      {s.label ? (
                        <p className="text-xs text-zinc-400">{s.label}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-zinc-300 hover:text-red-400 break-all"
                      >
                        <span className="truncate max-w-[28ch]">{s.url}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0" />
                      </a>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">
                      {s.display_order}
                    </td>
                    <td className="px-4 py-3">
                      {s.is_active ? (
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
                          href={`/admin/socials/${s.id}`}
                          className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
                          aria-label="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <DeleteButton
                          action={async () => {
                            "use server"
                            return deleteSocialLink(s.id)
                          }}
                          label={`Delete ${s.platform}?`}
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
