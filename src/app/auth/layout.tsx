'use client'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 w-full min-h-screen">
      <main className="flex h-full items-center justify-center bg-background">{children}</main>
    </div>
  )
}
