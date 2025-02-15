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
        <div className="h-screen flex">
          {/* Left Panel - User Menu */}
          <aside className="w-64 border-r border-border bg-muted/40 h-full p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <h1 className="font-semibold">Ideaflow</h1>
            </div>

            {/* Note List Container */}
            <div className="flex-1 overflow-auto">
              {/* Placeholder for note list */}
              <div className="space-y-2">
                <div className="p-2 rounded-md hover:bg-muted cursor-pointer">Note 1</div>
                <div className="p-2 rounded-md hover:bg-muted cursor-pointer">Note 2</div>
              </div>
            </div>

            {/* User Menu Footer */}
            <div className="mt-auto pt-4 border-t border-border">
              <button className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                New Note
              </button>
            </div>
          </aside>

          {/* Right Panel - Main Content */}
          <main className="flex-1 h-full overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  )
}
