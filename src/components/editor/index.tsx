'use client'

import { cn } from '@/lib/utils'
import Code from '@tiptap/extension-code'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Editor from './tiptap-editor'
import { Toolbar } from './toolbar'

interface RichEditorProps {
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
  editable?: boolean
}

export default function RichEditor({
  content = '',
  onChange,
  placeholder = 'Write something...',
  className,
  editable = true,
}: RichEditorProps) {
  const editor = useEditor({
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
  })

  return (
    <div className={cn('flex flex-col rounded-md border', className)}>
      <Toolbar editor={editor} />
      <div className="p-4">
        <Editor
          editor={editor}
          content={content}
          onChange={onChange}
          placeholder={placeholder}
          editable={editable}
        />
      </div>
    </div>
  )
}
