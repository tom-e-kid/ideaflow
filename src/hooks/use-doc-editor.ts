'use client'

import { useToast } from '@/hooks/use-toast'
import { useDocStore } from '@/stores/doc-store'
import { JSONContent } from '@tiptap/react'
import { useCallback, useMemo, useState } from 'react'

// Default empty document structure
const EMPTY_DOC: JSONContent = { type: 'doc', content: [{ type: 'paragraph' }] }

/**
 * Props for the useDocEditor hook
 * @property initialDoc - Optional initial document data
 * @property onSaveSuccess - Optional callback function called after successful save
 */
type UseDocEditorProps = {
  initialDoc?: {
    docId?: string
    content: JSONContent | null
  }
  onSaveSuccess?: (docId: string) => void
}

/**
 * Hook for managing document editor state and operations
 *
 * Provides functionality for:
 * - Tracking document content and changes
 * - Handling content updates
 * - Saving documents (create/update)
 * - Managing loading and saving states
 */
export function useDocEditor({ initialDoc, onSaveSuccess }: UseDocEditorProps = {}) {
  const { toast } = useToast()
  const { createDoc, updateDoc } = useDocStore()

  // Determine if we're in edit mode (existing document) or create mode
  const isEditMode = !!initialDoc?.docId

  // Core state management
  const [content, setContent] = useState<JSONContent>(initialDoc?.content || EMPTY_DOC)
  const [originalContent, setOriginalContent] = useState<JSONContent>(
    initialDoc?.content || EMPTY_DOC
  )
  const [isLoading, setIsLoading] = useState(!!initialDoc?.docId)
  const [isSaving, setIsSaving] = useState(false)

  /**
   * Determines if the current content has unsaved changes
   * by comparing with the original content
   */
  const hasChanges = useMemo(() => {
    return JSON.stringify(content) !== JSON.stringify(originalContent)
  }, [content, originalContent])

  /**
   * Updates the editor content when changes are made
   * @param newContent - The updated document content
   */
  const handleChange = useCallback((newContent: JSONContent) => {
    setContent(newContent)
  }, [])

  /**
   * Sets both current and original document content
   * Used when loading a document from external source
   * @param docContent - The document content to set
   */
  const setDocContent = useCallback((docContent: JSONContent) => {
    setContent(docContent)
    setOriginalContent(docContent)
  }, [])

  /**
   * Saves the current document
   * Creates a new document or updates an existing one based on mode
   */
  const handleSave = useCallback(async () => {
    if (!content) return

    try {
      setIsSaving(true)

      let docId: string
      if (isEditMode && initialDoc?.docId) {
        docId = await updateDoc(initialDoc.docId, content)
      } else {
        docId = await createDoc(content)
      }

      // Update original content to match current content after successful save
      setOriginalContent(content)

      if (onSaveSuccess) {
        onSaveSuccess(docId)
      }

      toast({
        title: 'Success',
        description: `Document ${isEditMode ? 'saved' : 'created'} successfully.`,
      })
    } catch (error) {
      console.error(`Error ${isEditMode ? 'saving' : 'creating'} document:`, error)
      toast({
        title: 'Error',
        description: `Failed to ${isEditMode ? 'save' : 'create'} document. Please try again.`,
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }, [content, isEditMode, initialDoc?.docId, createDoc, updateDoc, onSaveSuccess, toast])

  // Public interface
  return {
    content, // Current document content
    isLoading, // Whether document is loading
    setIsLoading, // Function to update loading state
    isSaving, // Whether document is being saved
    hasChanges, // Whether document has unsaved changes
    handleChange, // Handler for content changes
    handleSave, // Handler for saving document
    setDocContent, // Function to set document content (both current and original)
  }
}
