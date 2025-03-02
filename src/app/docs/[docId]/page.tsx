'use client'

import { Editor } from '@/components/doc/editor'
import { useDocEditor } from '@/hooks/use-doc-editor'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { use, useEffect } from 'react'

export default function DocPage({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = use(params)
  const router = useRouter()
  const { toast } = useToast()

  const {
    content,
    isLoading,
    setIsLoading,
    handleChange,
    handleSave,
    isSaving,
    hasChanges,
    setDocContent,
  } = useDocEditor({
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
        setDocContent(data.content)
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
  }, [docId, router, toast, setDocContent, setIsLoading])

  return (
    <Editor
      content={content}
      handleChange={handleChange}
      handleSave={handleSave}
      isSaving={isSaving}
      hasChanges={hasChanges}
      isLoading={isLoading}
    />
  )
}
