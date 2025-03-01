'use client'

import { DocumentEditor } from '@/components/document/DocumentEditor'
import { useDocumentEditor } from '@/hooks/useDocumentEditor'

export default function Home() {
  const { content, handleChange, handleSave, isSaving, hasChanges } = useDocumentEditor()

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
