'use client'

import { useToast } from '@/components/ui/use-toast'
import { extractDocumentTitle } from '@/lib/utils'
import { JSONContent } from '@tiptap/react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export type DocumentItem = {
  id: string
  docId: string
  content: JSONContent
  title: string
  createdAt: string
  updatedAt: string
}

export function useDocumentList() {
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Fetch documents
  const fetchDocuments = useCallback(
    async (cursor: string | null = null) => {
      try {
        setIsLoading(true)
        setError(null)

        const url = new URL('/api/docs', window.location.origin)
        if (cursor) {
          url.searchParams.append('cursor', cursor)
        }
        url.searchParams.append('limit', '20')

        const response = await fetch(url.toString())

        if (!response.ok) {
          throw new Error('Failed to fetch documents')
        }

        const data = await response.json()

        // Process documents to extract titles
        const processedDocs = data.docs.map(
          (doc: {
            id: string
            docId: string
            content: JSONContent
            createdAt: string
            updatedAt: string
          }) => ({
            ...doc,
            title: extractDocumentTitle(doc.content),
          })
        )

        if (cursor) {
          // Append to existing documents
          setDocuments((prev) => [...prev, ...processedDocs])
        } else {
          // Replace documents
          setDocuments(processedDocs)
        }

        setNextCursor(data.nextCursor)
        setHasMore(data.hasMore)
      } catch (err) {
        console.error('Error fetching documents:', err)
        setError('Failed to load documents')
        toast({
          title: 'Error',
          description: 'Failed to load documents. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    },
    [toast]
  )

  // Load more documents
  const loadMore = useCallback(() => {
    if (hasMore && nextCursor && !isLoading) {
      fetchDocuments(nextCursor)
    }
  }, [fetchDocuments, hasMore, nextCursor, isLoading])

  // Select a document and navigate to it
  const selectDocument = useCallback(
    (docId: string) => {
      setSelectedDocId(docId)
      router.push(`/docs/${docId}`)
    },
    [router]
  )

  // Duplicate a document
  const duplicateDocument = useCallback(
    async (docId: string) => {
      try {
        const response = await fetch(`/api/docs/${docId}/duplicate`, {
          method: 'POST',
        })

        if (!response.ok) {
          throw new Error('Failed to duplicate document')
        }

        const data = await response.json()

        // Refresh the document list
        fetchDocuments()

        // Navigate to the new document
        router.push(`/docs/${data.docId}`)

        toast({
          title: 'Success',
          description: 'Document duplicated successfully.',
        })
      } catch (err) {
        console.error('Error duplicating document:', err)
        toast({
          title: 'Error',
          description: 'Failed to duplicate document. Please try again.',
          variant: 'destructive',
        })
      }
    },
    [fetchDocuments, router, toast]
  )

  // Delete a document
  const deleteDocument = useCallback(
    async (docId: string) => {
      try {
        const response = await fetch(`/api/docs/${docId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete document')
        }

        // Remove the document from the list
        setDocuments((prev) => prev.filter((doc) => doc.docId !== docId))

        // If the deleted document was selected, navigate to home
        if (selectedDocId === docId) {
          router.push('/')
        }

        toast({
          title: 'Success',
          description: 'Document deleted successfully.',
        })
      } catch (err) {
        console.error('Error deleting document:', err)
        toast({
          title: 'Error',
          description: 'Failed to delete document. Please try again.',
          variant: 'destructive',
        })
      }
    },
    [selectedDocId, router, toast]
  )

  // Initial fetch
  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  // Update selected document based on URL
  useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/\/docs\/([^/]+)/)
    if (match && match[1]) {
      setSelectedDocId(match[1])
    } else {
      setSelectedDocId(null)
    }
  }, [])

  return {
    documents,
    isLoading,
    error,
    hasMore,
    loadMore,
    selectedDocId,
    selectDocument,
    duplicateDocument,
    deleteDocument,
    refreshDocuments: fetchDocuments,
  }
}
