import { AdminSidebar } from "@/components/admin/AdminSidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[60vh] flex-col gap-6 sm:flex-row">
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  )
}
