import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { Editor, EditorContent, JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Strikethrough,
  Undo,
} from 'lucide-react'
import { useEffect } from 'react'
import './tiptap.css'

/**
 * @description Toolbar component for the editor
 * @param editor - The editor instance
 * @param disabled - Whether the toolbar is disabled
 */
type ToolbarProps = {
  editor: Editor | null
  disabled?: boolean
}

function Toolbar({ editor, disabled = false }: ToolbarProps) {
  if (!editor) {
    return null
  }
  return (
    <div className={cn('border-b border-input bg-background', disabled && 'opacity-70')}>
      <div className="flex flex-wrap items-center gap-0.5 px-1.5 py-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled || !editor.can().chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled || !editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled || !editor.can().chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={disabled || !editor.can().chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('blockquote')}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
        >
          <Quote className="h-4 w-4" />
        </Toggle>
      </div>
    </div>
  )
}

/**
 * @description Props for the Tiptap component
 * @param className - The class name for the component
 * @param handleChange - Callback for when the editor content changes
 * @param initialContent - Initial content for the editor
 * @param editorRef - Ref object to expose the editor instance to the parent component
 * @param disabled - Whether the editor is disabled
 */
type TiptapProps = {
  className?: string
  handleChange?: (content: JSONContent) => void
  initialContent?: JSONContent | null
  editorRef?: React.MutableRefObject<{ focus: () => void } | null>
  disabled?: boolean
}

export default function Tiptap({
  className,
  handleChange,
  initialContent,
  editorRef,
  disabled = false,
}: TiptapProps) {
  const editor = useEditor({
    extensions: [StarterKit.configure({})],
    content: initialContent || undefined,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      handleChange?.(json)
    },
    immediatelyRender: false,
    editable: !disabled,
  })

  // エディタのインスタンスを親コンポーネントに公開
  useEffect(() => {
    if (editor && editorRef) {
      editorRef.current = {
        focus: () => {
          editor.commands.focus('end')
        },
      }
    }
  }, [editor, editorRef])

  // Update content when initialContent changes
  useEffect(() => {
    if (editor && initialContent) {
      // Only set content if it's different from current content
      const currentContent = editor.getJSON()
      if (JSON.stringify(currentContent) !== JSON.stringify(initialContent)) {
        editor.commands.setContent(initialContent)
      }
    }
  }, [editor, initialContent])

  // Update editor editable state when disabled prop changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [editor, disabled])

  return (
    <div className={cn(className, 'flex flex-col h-full')}>
      <Toolbar editor={editor} disabled={disabled} />
      <div className="flex-1 overflow-hidden">
        <EditorContent
          editor={editor}
          className={cn(
            'h-full w-full',
            !disabled ? 'cursor-text' : 'cursor-not-allowed opacity-70'
          )}
        />
      </div>
    </div>
  )
}
