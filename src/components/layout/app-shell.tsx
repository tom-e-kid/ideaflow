'use client'

import { LeftPanel } from '@/components/layout/left-panel'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Menu, Plus, User } from 'lucide-react'
import { useState } from 'react'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="h-screen flex">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 z-10 flex items-center justify-between pointer-events-none">
        {/* Left Button Items */}
        <div
          className={cn(
            'flex items-center gap-2 px-2 transition-all duration-300',
            isSidebarOpen ? 'w-64 justify-between' : 'w-auto'
          )}
        >
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Toggle sidebar"
            className="pointer-events-auto"
          >
            <Menu
              className={cn(
                'h-5 w-5 transition-transform duration-300',
                isSidebarOpen && 'rotate-90'
              )}
            />
          </Button>

          {/* New Note Button */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="New note"
            className="pointer-events-auto"
            onClick={() => {
              // TODO: Implement new note creation
              console.log('Create new note')
            }}
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {/* Right Button Items */}
        <div className="flex items-center px-2">
          {/* Account Menu */}
          <Button variant="ghost" size="icon" aria-label="Account menu">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <LeftPanel isOpen={isSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 h-full overflow-auto">{children}</main>
    </div>
  )
}
