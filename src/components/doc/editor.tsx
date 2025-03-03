'use client'

import Tiptap from '@/components/editor/tiptap'
import { JSONContent } from '@tiptap/react'
import { Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type EditorProps = {
  content: JSONContent | null
  handleChange: (content: JSONContent) => void
  handleSave: () => void
  isSaving: boolean
  hasChanges: boolean
  isLoading?: boolean
  className?: string
}

export function Editor({
  content,
  handleChange,
  handleSave,
  isSaving,
  hasChanges,
  isLoading = false,
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
    if (editorRef.current && isEditorFocused && !isLoading) {
      setTimeout(() => {
        editorRef.current?.focus()
        setEditorFocused(false)
      }, 100)
    }
  }, [isEditorFocused, setEditorFocused, isLoading])

  // Add keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd+S (Mac) or Ctrl+S (Windows)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault() // Prevent browser's save dialog
        // Only save if there are changes and not currently saving
        if (hasChanges && !isSaving && !isLoading) {
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
  }, [handleSave, hasChanges, isSaving, isLoading])

  return (
    <div className={className}>
      <div className="relative h-full w-full">
        <Tiptap
          className="h-full w-full"
          handleChange={handleChange}
          initialContent={content}
          editorRef={editorRef}
          disabled={isLoading}
          onSave={handleSave}
          isSaving={isSaving}
          hasChanges={hasChanges}
        />

        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
            <div className="bg-background/70 backdrop-blur-sm p-4 rounded-lg shadow-md pointer-events-auto flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading document...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
