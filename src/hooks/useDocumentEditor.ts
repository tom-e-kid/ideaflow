'use client'

import { useToast } from '@/components/ui/use-toast'
import { JSONContent } from '@tiptap/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type UseDocumentEditorProps = {
  initialDoc?: {
    docId?: string
    content: JSONContent | null
  }
  onSaveSuccess?: (docId: string) => void
}

export function useDocumentEditor({ initialDoc, onSaveSuccess }: UseDocumentEditorProps = {}) {
  const router = useRouter()
  const { toast } = useToast()

  // デフォルトの空のドキュメント
  const emptyDoc = { type: 'doc', content: [{ type: 'paragraph' }] }

  const [content, setContent] = useState<JSONContent>(initialDoc?.content || emptyDoc)
  const [originalContent, setOriginalContent] = useState<JSONContent>(
    initialDoc?.content || emptyDoc
  )
  const [isLoading, setIsLoading] = useState(!!initialDoc?.docId)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // 新規作成モードか編集モードかを判定
  const isEditMode = !!initialDoc?.docId

  // コンテンツの変更を処理
  const handleChange = (newContent: JSONContent) => {
    setContent(newContent)
    // 変更があるかチェック
    setHasChanges(JSON.stringify(newContent) !== JSON.stringify(originalContent))
  }

  // ドキュメントの保存処理
  const handleSave = async () => {
    if (!content) return

    try {
      setIsSaving(true)

      // 新規作成か更新かによってAPIエンドポイントとメソッドを変更
      const method = isEditMode ? 'PUT' : 'POST'
      const body = isEditMode
        ? JSON.stringify({ docId: initialDoc.docId, content })
        : JSON.stringify({ content })

      const response = await fetch('/api/docs', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isEditMode ? 'update' : 'create'} document`)
      }

      const data = await response.json()

      // 新規作成の場合はリダイレクト、編集の場合は元のコンテンツを更新
      if (!isEditMode && data.docId) {
        if (onSaveSuccess) {
          onSaveSuccess(data.docId)
        } else {
          router.push(`/docs/${data.docId}`)
        }
      } else {
        setOriginalContent(content)
        setHasChanges(false)
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
  }

  return {
    content,
    setContent,
    originalContent,
    setOriginalContent,
    isLoading,
    setIsLoading,
    isSaving,
    hasChanges,
    handleChange,
    handleSave,
  }
}
