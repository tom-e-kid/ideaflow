'use client'

import { List } from '@/components/doc/list'
import { cn } from '@/lib/utils'

interface LeftPanelProps {
  isOpen: boolean
}

export function LeftPanel({ isOpen }: LeftPanelProps) {
  return (
    <aside
      className={cn(
        'w-64 border-r border-border bg-muted/40 h-full p-4 flex flex-col transition-all duration-300',
        !isOpen && '-translate-x-full'
      )}
    >
      <div className="flex items-center gap-2 mb-6 pl-10">
        <h1 className="text-xl font-bold text-primary">ideaflow</h1>
      </div>

      {/* Document List Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h2 className="text-sm font-medium text-muted-foreground mb-2 px-2">Documents</h2>
        <List />
      </div>

      {/* User Menu Footer */}
      <div className="mt-auto pt-4 border-t border-border" />
    </aside>
  )
}
