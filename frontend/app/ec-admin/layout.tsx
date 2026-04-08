import AdminSidebar from '@/components/admin/AdminSidebar'

// Auth is handled entirely by proxy.ts — no redirect here to avoid
// an infinite loop (this layout wraps the login page too).
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-neutral-950 flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}