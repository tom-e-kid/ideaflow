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
        'w-64 border-r border-border bg-muted/40 h-full py-4 flex flex-col transition-all duration-300',
        !isOpen && '-translate-x-full'
      )}
    >
      <div className="flex items-center gap-2 mb-6 pl-12 pt-[3px]">
        <h1 className="text-sm font-extralight text-muted-foreground">IDEAFLOW</h1>
      </div>

      {/* Document List Container */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h2 className="text-xs font-extralight text-muted-foreground mb-2 px-4">Docs</h2>
        <List />
      </div>
    </aside>
  )
}
