'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Copy, MoreHorizontal, Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface ListItemProps {
  docId: string
  title: string
  isSelected: boolean
  onSelect: (docId: string) => void
  onDuplicate: (docId: string) => Promise<string>
  onDelete: (docId: string) => Promise<string>
}

export function ListItem({
  docId,
  title,
  isSelected,
  onSelect,
  onDuplicate,
  onDelete,
}: ListItemProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSelect = () => {
    onSelect(docId)
    router.push(`/docs/${docId}`)
  }

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation() // リストアイテムのクリックをトリガーしないようにする
    setIsLoading(true)
    try {
      await onDuplicate(docId)
      setIsMenuOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation() // リストアイテムのクリックをトリガーしないようにする
    setIsLoading(true)
    try {
      await onDelete(docId)
      setIsMenuOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn(
        'group flex items-center justify-between px-2 py-2 rounded-md cursor-pointer hover:bg-muted/80 transition-colors',
        isSelected && 'bg-muted'
      )}
      onClick={handleSelect}
    >
      <div className="flex-1 truncate mr-2">{title || 'Untitled Document'}</div>

      <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100"
            onClick={(e) => e.stopPropagation()} // リストアイテムのクリックをトリガーしないようにする
            disabled={isLoading}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleDuplicate} disabled={isLoading}>
            <Copy className="h-4 w-4 mr-2" />
            <span>複製</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-destructive focus:text-destructive"
            disabled={isLoading}
          >
            <Trash className="h-4 w-4 mr-2" />
            <span>削除</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
