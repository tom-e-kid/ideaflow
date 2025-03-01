'use client'

import { DocumentEditor } from '@/components/document/DocumentEditor'
import { useToast } from '@/components/ui/use-toast'
import { useDocumentEditor } from '@/hooks/useDocumentEditor'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'

export default function DocPage({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = use(params)
  const router = useRouter()
  const { toast } = useToast()

  const {
    content,
    setContent,
    setOriginalContent,
    isLoading,
    setIsLoading,
    handleChange,
    handleSave,
    isSaving,
    hasChanges,
  } = useDocumentEditor({
    initialDoc: { docId, content: null },
  })

  // ドキュメントの取得
  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/docs/${docId}`)

        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: 'Document not found',
              description: 'The requested document could not be found.',
              variant: 'destructive',
            })
            router.push('/')
            return
          }
          throw new Error('Failed to fetch document')
        }

        const data = await response.json()
        setContent(data.content)
        setOriginalContent(data.content)
      } catch (error) {
        console.error('Error fetching document:', error)
        toast({
          title: 'Error',
          description: 'Failed to load document. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoc()
  }, [docId, router, toast, setContent, setOriginalContent, setIsLoading])

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>Loading document...</p>
      </div>
    )
  }

  return (
    <DocumentEditor
      content={content}
      handleChange={handleChange}
      handleSave={handleSave}
      isSaving={isSaving}
      hasChanges={hasChanges}
    />
  )
}
