'use client'

import Tiptap from '@/components/editor/tiptap'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { JSONContent } from '@tiptap/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()
  const [content, setContent] = useState<JSONContent>({
    type: 'doc',
    content: [{ type: 'paragraph' }],
  })
  const [originalContent, setOriginalContent] = useState<JSONContent>({
    type: 'doc',
    content: [{ type: 'paragraph' }],
  })
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Set initial content when component mounts
  useEffect(() => {
    const initialContent = { type: 'doc', content: [{ type: 'paragraph' }] }
    setContent(initialContent)
    setOriginalContent(initialContent)
  }, [])

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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save document')
      }

      const data = await response.json()

      // Redirect to the document page
      router.push(`/docs/${data.docId}`)

      toast({
        title: 'Success',
        description: 'Document created successfully.',
      })
    } catch (error) {
      console.error('Error saving document:', error)
      toast({
        title: 'Error',
        description: 'Failed to create document. Please try again.',
        variant: 'destructive',
      })
      setIsSaving(false)
    }
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
