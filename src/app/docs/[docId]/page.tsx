'use client'

import Tiptap from '@/components/editor/tiptap'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { JSONContent } from '@tiptap/react'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'

export default function DocPage({ params }: { params: Promise<{ docId: string }> }) {
  const { docId } = use(params)

  const router = useRouter()
  const { toast } = useToast()
  const [content, setContent] = useState<JSONContent | null>(null)
  const [originalContent, setOriginalContent] = useState<JSONContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Fetch document content on load
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
  }, [docId, router, toast])

  // Handle editor content changes
  const handleChange = (newContent: JSONContent) => {
    setContent(newContent)
    // Check if content has changed from original
    setHasChanges(JSON.stringify(newContent) !== JSON.stringify(originalContent))
  }

  // Handle save button click
  const handleSave = async () => {
    if (!content) return

    try {
      setIsSaving(true)
      const response = await fetch('/api/docs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          docId,
          content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save document')
      }

      // Update original content to match current content
      setOriginalContent(content)
      setHasChanges(false)

      toast({
        title: 'Success',
        description: 'Document saved successfully.',
      })
    } catch (error) {
      console.error('Error saving document:', error)
      toast({
        title: 'Error',
        description: 'Failed to save document. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <p>Loading document...</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      {/* Save Button */}
      <div className="h-[44px] flex items-center justify-end p-2">
        <Button
          variant={hasChanges && !isSaving ? 'default' : 'outline'}
          size="sm"
          onClick={handleSave}
          disabled={!hasChanges || isSaving}
          className={`transition-all duration-200 ${!hasChanges || isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary hover:text-primary-foreground'}`}
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
