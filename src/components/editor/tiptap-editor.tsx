'use client'

import { cn } from '@/lib/utils'
import Code from '@tiptap/extension-code'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { EditorContent, useEditor, type Editor as EditorType } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export interface EditorProps {
  editor?: EditorType | null
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
}

export default function Editor({
  editor: externalEditor,
  content = '',
  onChange,
  placeholder = 'Write something...',
  className,
  editable = true,
}: EditorProps) {
  const internalEditor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside leading-3 -mt-2',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside leading-3 -mt-2',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'leading-normal -mb-2',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'rounded-md bg-gray-200 p-5 font-mono font-medium text-gray-900',
          },
        },
        code: {
          HTMLAttributes: {
            class: 'rounded-md bg-gray-200 px-1.5 py-1 font-mono font-medium text-gray-900',
          },
        },
        horizontalRule: false,
        dropcursor: {
          color: '#DBEAFE',
          width: 4,
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass:
          'before:content-[attr(data-placeholder)] before:text-gray-500 before:float-left before:h-0 before:pointer-events-none',
      }),
      Link.configure({
        HTMLAttributes: {
          class: 'text-blue-500 underline underline-offset-2 hover:text-blue-600',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'not-prose pl-2',
        },
      }),
      TaskItem.configure({
        HTMLAttributes: {
          class: 'flex items-start my-4',
        },
        nested: true,
      }),
      Highlight,
      Code,
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg border border-gray-200',
        },
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-gray dark:prose-invert max-w-none',
          'prose-headings:font-title prose-headings:font-medium prose-headings:text-gray-900',
          'prose-p:my-4 prose-p:leading-7',
          'prose-li:my-2',
          'prose-code:px-1 prose-code:py-0.5 prose-code:rounded-md prose-code:bg-gray-200 prose-code:font-mono prose-code:text-gray-900',
          'prose-img:rounded-lg prose-img:border prose-img:border-gray-200',
          className
        ),
      },
    },
  })

  const editor = externalEditor || internalEditor

  return (
    <EditorContent
      editor={editor}
      className={cn(
        'h-full w-full cursor-text',
        '[&_.ProseMirror]:h-full',
        '[&_.ProseMirror]:outline-none',
        '[&_.ProseMirror]:px-6 [&_.ProseMirror]:py-4'
      )}
    />
  )
}

export type Editor = EditorType
