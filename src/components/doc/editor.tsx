'use client'

import Tiptap from '@/components/editor/tiptap'
import { Button } from '@/components/ui/button'
import { JSONContent } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'

type EditorProps = {
  content: JSONContent | null
  handleChange: (content: JSONContent) => void
  handleSave: () => void
  isSaving: boolean
  hasChanges: boolean
  className?: string
}

export function Editor({
  content,
  handleChange,
  handleSave,
  isSaving,
  hasChanges,
  className = 'h-full w-full',
}: EditorProps) {
  // for auto focusing
  const editorRef = useRef<{ focus: () => void } | null>(null)
  const [isEditorFocused, setEditorFocused] = useState(false)

  // set editor focused when component is mounted
  useEffect(() => {
    setEditorFocused(true)
  }, [setEditorFocused])

  // focus editor when isEditorFocused is true
  useEffect(() => {
    if (editorRef.current && isEditorFocused) {
      setTimeout(() => {
        editorRef.current?.focus()
        setEditorFocused(false)
      }, 100)
    }
  }, [isEditorFocused, setEditorFocused])

  // Add keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+S (Mac) or Ctrl+S (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault() // Prevent browser's save dialog
        // Only save if there are changes and not currently saving
        if (hasChanges && !isSaving) {
          handleSave()
        }
      }
    }
    // Add event listener
    window.addEventListener('keydown', handleKeyDown)
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleSave, hasChanges, isSaving])

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
        editorRef={editorRef}
      />
    </div>
  )
}
