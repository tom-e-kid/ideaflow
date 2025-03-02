'use client'

import { ListItem } from '@/components/doc/list-item'
import { useDocStore } from '@/stores/doc-store'
import { useEffect, useRef } from 'react'

export function List() {
  const {
    docs,
    isLoading,
    error,
    hasMore,
    pageDocs,
    selectedDocId,
    selectDoc,
    duplicateDoc,
    deleteDoc,
  } = useDocStore()

  const listRef = useRef<HTMLDivElement>(null)

  // 初回ロード時にドキュメントを取得
  useEffect(() => {
    useDocStore.getState().fetchDocs()
  }, [])

  // URL変更時に選択状態を更新
  useEffect(() => {
    const path = window.location.pathname
    const match = path.match(/\/docs\/([^/]+)/)
    if (match && match[1]) {
      selectDoc(match[1])
    } else {
      // ルートパスの場合は選択をクリア
      selectDoc(null)
    }
  }, [selectDoc])

  // 無限スクロールの実装
  useEffect(() => {
    const listElement = listRef.current
    if (!listElement) return

    const handleScroll = () => {
      // スクロールが下部に達したかチェック
      if (
        listElement.scrollHeight - listElement.scrollTop <= listElement.clientHeight + 100 &&
        hasMore &&
        !isLoading
      ) {
        pageDocs()
      }
    }

    listElement.addEventListener('scroll', handleScroll)
    return () => {
      listElement.removeEventListener('scroll', handleScroll)
    }
  }, [hasMore, isLoading, pageDocs])

  if (error) {
    return <div className="p-4 text-destructive">Error loading documents</div>
  }

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto">
      <div className="space-y-1 pl-4 pr-2">
        {isLoading && docs.length === 0 ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
          </div>
        ) : docs.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">No documents found</div>
        ) : (
          docs.map((doc) => (
            <ListItem
              key={doc.docId}
              docId={doc.docId}
              title={doc.title}
              isSelected={doc.docId === selectedDocId}
              onSelect={selectDoc}
              onDuplicate={duplicateDoc}
              onDelete={deleteDoc}
            />
          ))
        )}
        {isLoading && docs.length > 0 && (
          <div className="flex justify-center p-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>
    </div>
  )
}
