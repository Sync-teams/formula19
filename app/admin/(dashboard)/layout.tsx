import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

export const metadata = {
  title: "Admin | Formula 19 Tyres",
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/admin/login")

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar userEmail={user.email || ""} />
      <main className="flex-1 lg:pl-64">
        <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  )
}
