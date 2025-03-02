'use client'

import { useToast } from '@/components/ui/use-toast'
import { useDocStore } from '@/stores/doc-store'
import { JSONContent } from '@tiptap/react'
import { useState } from 'react'

type UseDocEditorProps = {
  initialDoc?: {
    docId?: string
    content: JSONContent | null
  }
  onSaveSuccess?: (docId: string) => void
}

export function useDocEditor({ initialDoc, onSaveSuccess }: UseDocEditorProps = {}) {
  const { toast } = useToast()
  const { createDoc, updateDoc } = useDocStore()

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

      let docId: string
      if (isEditMode) {
        docId = await updateDoc(initialDoc.docId!, content)
      } else {
        docId = await createDoc(content)
      }

      if (!isEditMode && docId) {
        // 新規作成時
        if (onSaveSuccess) {
          onSaveSuccess(docId)
        }
      } else {
        // 編集時
        // オリジナルのコンテンツを更新し、変更フラグをリセット
        setOriginalContent(content)
        setHasChanges(false)
        if (onSaveSuccess) {
          onSaveSuccess(docId)
        }
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
