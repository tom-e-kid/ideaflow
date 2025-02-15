import { AppShell } from '@/components/layout/app-shell'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ideaflow',
  description:
    'A note-taking app for quickly capturing business ideas with AI-powered organization and expansion',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
