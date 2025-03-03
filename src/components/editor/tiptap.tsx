import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Toggle } from '@/components/ui/toggle'
import { cn } from '@/lib/utils'
import { Editor, EditorContent, JSONContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Check,
  Code,
  Copy,
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
import { useEffect, useState } from 'react'
import { Markdown } from 'tiptap-markdown'
import './tiptap.css'

/**
 * @description Toolbar component for the editor
 * @param editor - The editor instance
 * @param disabled - Whether the toolbar is disabled
 * @param onSave - Callback for saving the editor content
 * @param isSaving - Whether the content is being saved
 * @param hasChanges - Whether there are changes to be saved
 */
type ToolbarProps = {
  editor: Editor | null
  disabled?: boolean
  onSave: () => void
  isSaving: boolean
  hasChanges: boolean
}

function Toolbar({ editor, disabled = false, onSave, isSaving, hasChanges }: ToolbarProps) {
  const [isCopied, setIsCopied] = useState(false)

  if (!editor) {
    return null
  }

  const handleCopyToClipboard = async () => {
    try {
      const markdown = editor.storage.markdown.getMarkdown()
      await navigator.clipboard.writeText(markdown)

      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  return (
    <div className={cn('border-b border-input bg-background', disabled && 'opacity-70')}>
      <div className="flex items-center justify-between px-1.5 py-1">
        <div className="flex flex-wrap items-center gap-0.5">
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
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyToClipboard}
            disabled={disabled}
            className="h-7 w-7 p-0"
          >
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button
            variant={hasChanges && !isSaving && !disabled ? 'default' : 'outline'}
            size="sm"
            onClick={onSave}
            disabled={!hasChanges || isSaving || disabled}
            className={`transition-all duration-200 ${
              !hasChanges || isSaving || disabled
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-primary hover:text-primary-foreground'
            }`}
          >
            {isSaving ? 'Saving...' : hasChanges ? 'Save' : 'No Changes'}
          </Button>
        </div>
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
 * @param onSave - Callback for saving the editor content
 * @param isSaving - Whether the content is being saved
 * @param hasChanges - Whether there are changes to be saved
 */
type TiptapProps = {
  className?: string
  handleChange?: (content: JSONContent) => void
  initialContent?: JSONContent | null
  editorRef?: React.MutableRefObject<{ focus: () => void } | null>
  disabled?: boolean
  onSave: () => void
  isSaving: boolean
  hasChanges: boolean
}

export default function Tiptap({
  className,
  handleChange,
  initialContent,
  editorRef,
  disabled = false,
  onSave,
  isSaving,
  hasChanges,
}: TiptapProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown.configure({
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: initialContent || undefined,
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      handleChange?.(json)
    },
    immediatelyRender: false,
    editable: !disabled,
  })

  useEffect(() => {
    if (editor && editorRef) {
      editorRef.current = {
        focus: () => {
          editor.commands.focus('end')
        },
      }
    }
  }, [editor, editorRef])

  useEffect(() => {
    if (editor && initialContent) {
      const currentContent = editor.getJSON()
      if (JSON.stringify(currentContent) !== JSON.stringify(initialContent)) {
        editor.commands.setContent(initialContent)
      }
    }
  }, [editor, initialContent])

  useEffect(() => {
    if (editor) {
      editor.setEditable(!disabled)
    }
  }, [editor, disabled])

  return (
    <div className={cn(className, 'flex flex-col h-full')}>
      <Toolbar
        editor={editor}
        disabled={disabled}
        onSave={onSave}
        isSaving={isSaving}
        hasChanges={hasChanges}
      />
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
