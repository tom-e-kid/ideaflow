'use client'

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

      {/* Note List Container */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-2">
          <div className="p-2 rounded-md hover:bg-muted cursor-pointer">Note 1</div>
          <div className="p-2 rounded-md hover:bg-muted cursor-pointer">Note 2</div>
        </div>
      </div>

      {/* User Menu Footer */}
      <div className="mt-auto pt-4 border-t border-border" />
    </aside>
  )
}
