"use client"

import { useState, useTransition } from "react"
import { updateSiteContent } from "@/app/actions/admin"
import { CheckCircle, AlertCircle } from "lucide-react"

type FieldGroup = {
  title: string
  description?: string
  fields: { key: string; label: string; multiline?: boolean }[]
}

interface ContentFormProps {
  content: Record<string, string>
  fieldGroups: FieldGroup[]
}

export function ContentForm({ content, fieldGroups }: ContentFormProps) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateSiteContent(formData)
      if (result?.error) {
        setStatus("error")
        setMessage(result.error)
      } else {
        setStatus("success")
        setMessage("Site content updated successfully.")
        setTimeout(() => setStatus("idle"), 3000)
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-lg border border-green-600/30 bg-green-600/10 p-3 text-sm text-green-400">
          <CheckCircle className="h-4 w-4" />
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-lg border border-red-600/30 bg-red-600/10 p-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4" />
          {message}
        </div>
      )}

      {fieldGroups.map((group) => (
        <div
          key={group.title}
          className="rounded-xl border border-white/10 bg-card p-6"
        >
          <h2 className="mb-1 text-lg font-semibold text-white">
            {group.title}
          </h2>
          {group.description && (
            <p className="mb-4 text-sm text-zinc-400">{group.description}</p>
          )}
          <div className="space-y-4">
            {group.fields.map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-400">
                  {field.label}
                </label>
                {field.multiline ? (
                  <textarea
                    name={field.key}
                    rows={3}
                    defaultValue={content[field.key] || ""}
                    className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                ) : (
                  <input
                    name={field.key}
                    defaultValue={content[field.key] || ""}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:bg-red-600/50"
      >
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  )
}
