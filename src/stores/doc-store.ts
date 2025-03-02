import { extractDocumentTitle } from '@/lib/utils'
import { JSONContent } from '@tiptap/react'
import { create } from 'zustand'

export type DocItem = {
  id: string
  docId: string
  content: JSONContent
  title: string
  createdAt: string
  updatedAt: string
}

interface DocState {
  // 状態
  docs: DocItem[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  nextCursor: string | null
  selectedDocId: string | null

  // アクション
  fetchDocs: (cursor?: string | null) => Promise<void>
  pageDocs: () => Promise<void>
  selectDoc: (docId: string | null) => void
  refreshDocs: () => Promise<void>
  createDoc: (content: JSONContent) => Promise<string>
  updateDoc: (docId: string, content: JSONContent) => Promise<string>
  duplicateDoc: (docId: string) => Promise<string>
  deleteDoc: (docId: string) => Promise<string>
}

export const useDocStore = create<DocState>((set, get) => ({
  docs: [],
  isLoading: false,
  error: null,
  hasMore: false,
  nextCursor: null,
  selectedDocId: null,

  // ドキュメント一覧取得
  fetchDocs: async (cursor = null) => {
    try {
      set({ isLoading: true, error: null })

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

      // タイトルを抽出して処理
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
        // 既存のドキュメントに追加
        set((state) => ({
          docs: [...state.docs, ...processedDocs],
          nextCursor: data.nextCursor,
          hasMore: data.hasMore,
          isLoading: false,
        }))
      } else {
        // ドキュメントを置き換え
        set({
          docs: processedDocs,
          nextCursor: data.nextCursor,
          hasMore: data.hasMore,
          isLoading: false,
        })
      }
    } catch (err) {
      console.error('Error fetching documents:', err)
      set({ error: 'Failed to load documents', isLoading: false })
    }
  },

  // ドキュメント一覧続きを取得
  pageDocs: async () => {
    const { hasMore, nextCursor, isLoading } = get()
    if (hasMore && nextCursor && !isLoading) {
      await get().fetchDocs(nextCursor)
    }
  },

  // ドキュメント選択
  selectDoc: (docId) => {
    set({ selectedDocId: docId })
  },

  // ドキュメント一覧更新
  refreshDocs: async () => {
    await get().fetchDocs(null)
  },

  // ドキュメント作成
  createDoc: async (content) => {
    try {
      set({ isLoading: true })

      const response = await fetch('/api/docs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to create document')
      }

      const data = await response.json()

      // 新しいドキュメントをキャッシュの先頭に追加
      const newDoc: DocItem = {
        id: data.id,
        docId: data.docId,
        content: data.content,
        title: extractDocumentTitle(data.content),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }

      set((state) => ({
        docs: [newDoc, ...state.docs],
        isLoading: false,
        selectedDocId: data.docId,
      }))

      return data.docId
    } catch (err) {
      console.error('Error creating document:', err)
      set({ error: 'Failed to create document', isLoading: false })
      throw err
    }
  },

  // ドキュメント更新
  updateDoc: async (docId, content) => {
    try {
      set({ isLoading: true })

      const response = await fetch(`/api/docs/${docId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to update document')
      }

      const data = await response.json()

      // キャッシュ内のドキュメントを更新し、先頭に移動
      set((state) => {
        const updatedDoc = {
          ...state.docs.find((doc) => doc.docId === docId)!,
          content: data.content,
          title: extractDocumentTitle(data.content),
          updatedAt: data.updatedAt,
        }

        const otherDocs = state.docs.filter((doc) => doc.docId !== docId)

        return {
          docs: [updatedDoc, ...otherDocs],
          isLoading: false,
        }
      })

      return data.docId
    } catch (err) {
      console.error('Error updating document:', err)
      set({ error: 'Failed to update document', isLoading: false })
      throw err
    }
  },

  // ドキュメント複製
  duplicateDoc: async (docId) => {
    try {
      set({ isLoading: true })

      const response = await fetch(`/api/docs/${docId}/duplicate`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to duplicate document')
      }

      const data = await response.json()

      // 複製された新しいドキュメントをキャッシュの先頭に追加
      const newDoc: DocItem = {
        id: data.id,
        docId: data.docId,
        content: data.content,
        title: extractDocumentTitle(data.content),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      }

      set((state) => ({
        docs: [newDoc, ...state.docs],
        isLoading: false,
        selectedDocId: data.docId,
      }))

      return data.docId
    } catch (err) {
      console.error('Error duplicating document:', err)
      set({ error: 'Failed to duplicate document', isLoading: false })
      throw err
    }
  },

  // ドキュメント削除
  deleteDoc: async (docId) => {
    try {
      const response = await fetch(`/api/docs/${docId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete document')
      }

      // リストからドキュメントを削除
      set((state) => ({
        docs: state.docs.filter((doc) => doc.docId !== docId),
      }))

      // 削除したドキュメントが選択されていた場合、選択を解除
      const { selectedDocId } = get()
      if (selectedDocId === docId) {
        set({ selectedDocId: null })
      }

      return docId
    } catch (err) {
      console.error('Error deleting document:', err)
      set({ error: 'Failed to delete document' })
      throw err
    }
  },
}))
