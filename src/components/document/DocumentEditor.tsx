'use client'

import Tiptap from '@/components/editor/tiptap'
import { Button } from '@/components/ui/button'
import { JSONContent } from '@tiptap/react'

type DocumentEditorProps = {
  content: JSONContent | null
  handleChange: (content: JSONContent) => void
  handleSave: () => void
  isSaving: boolean
  hasChanges: boolean
  className?: string
}

export function DocumentEditor({
  content,
  handleChange,
  handleSave,
  isSaving,
  hasChanges,
  className = 'h-full w-full',
}: DocumentEditorProps) {
  return (
    <div className={className}>
      {/* Save Button */}
      <div className="h-[44px] flex items-center justify-end p-2">
        <Button
          variant={hasChanges && !isSaving ? 'default' : 'outline'}
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`transition-all duration-200 ${
            !hasChanges || isSaving
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          {isSaving ? 'Saving...' : hasChanges ? 'Save' : 'No Changes'}
        </Button>
      </div>

      <Tiptap
        className="h-[calc(100%-44px)] w-full"
        handleChange={handleChange}
        initialContent={content}
      />
    </div>
  )
}
