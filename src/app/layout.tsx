import { AppShell } from '@/components/layout/app-shell'
import { Toaster } from '@/components/ui/toaster'
import { auth } from '@/lib/auth'
import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import './globals.css'

const PUBLIC_PATHS = ['/auth/signin', '/auth/verify']

export const metadata: Metadata = {
  title: 'Ideaflow',
  description:
    'A note-taking app for quickly capturing business ideas with AI-powered organization and expansion',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = await headers()
  const pathname = h.get('x-pathname')
  const isPublicPath = PUBLIC_PATHS.some((p) => pathname?.startsWith(p))
  const session = await auth()
  if (!session && !isPublicPath) {
    redirect('/auth/signin')
  }
  if (session && isPublicPath) {
    redirect('/')
  }
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden">
        <SessionProvider>
          <AppShell>{children}</AppShell>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  )
}
