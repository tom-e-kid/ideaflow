'use client'

import { Editor } from '@/components/doc/editor'
import { useDocEditor } from '@/hooks/use-doc-editor'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  const { content, handleChange, handleSave, isSaving, hasChanges } = useDocEditor({
    onSaveSuccess: (docId) => {
      router.push(`/docs/${docId}`)
    },
  })

  return (
    <Editor
      content={content}
      handleChange={handleChange}
      handleSave={handleSave}
      isSaving={isSaving}
      hasChanges={hasChanges}
    />
  )
}
