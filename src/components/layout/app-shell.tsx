'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="h-screen flex">
      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-10 p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(isSidebarOpen && 'rotate-90')}
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {/* Left Panel - User Menu */}
      <aside
        className={cn(
          'w-64 border-r border-border bg-muted/40 h-full p-4 flex flex-col transition-all duration-300',
          !isSidebarOpen && '-translate-x-full'
        )}
      >
        <div className="flex items-center gap-2 mb-6 pl-8">
          <h1 className="font-semibold">Ideaflow</h1>
        </div>

        {/* Note List Container */}
        <div className="flex-1 overflow-auto">
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
  )
}
