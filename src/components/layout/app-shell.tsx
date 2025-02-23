'use client'

import { LeftPanel } from '@/components/layout/left-panel'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { LogOut, Menu, Plus, User } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const pathname = usePathname()

  // Check if current route is an auth route
  const isAuthRoute = pathname.startsWith('/auth')

  // Handle loading state
  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  // If we're on an auth route, render without the app shell
  if (isAuthRoute) {
    return <>{children}</>
  }

  return (
    <div className="relative h-screen">
      {/* Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 z-10 flex items-center justify-between pointer-events-none">
        {/* Left Button Items */}
        <div className="flex items-center pointer-events-auto">
          {/* Toggle Button Container */}
          <div className="px-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu
                className={cn(
                  'h-5 w-5 transition-transform duration-300 ease-in-out',
                  isSidebarOpen && 'rotate-90'
                )}
              />
            </Button>
          </div>

          {/* New Note Button Container */}
          <div
            className={cn(
              'transition-[margin] duration-300 ease-in-out',
              isSidebarOpen ? 'ml-[160px]' : 'ml-1'
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              aria-label="New note"
              onClick={() => {
                // TODO: Implement new note creation
                console.log('Create new note')
              }}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Right Button Items */}
        <div className="flex items-center px-2">
          {/* Account Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account menu"
                className="pointer-events-auto"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <LeftPanel isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div
        className={cn(
          'absolute top-0 right-0 h-screen pt-14 transition-[left] duration-300 ease-in-out',
          isSidebarOpen ? 'left-64' : 'left-0'
        )}
      >
        <div className="h-full overflow-hidden">{children}</div>
      </div>
    </div>
  )
}
