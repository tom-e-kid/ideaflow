'use client'
import Tiptap from '@/components/editor/tiptap'
import { Button } from '@/components/ui/button'
import { JSONContent } from '@tiptap/react'

export default function Home() {
  const handleChange = (content: JSONContent) => {
    console.log('Editor content:', JSON.stringify(content, null, 2))
    // You can also get Markdown using:
    // const markdown = getMarkdownFromHtml(content)
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Save changes')
  }

  return (
    <div className="h-full w-full">
      {/* Save Button */}
      <div className="h-[44px] flex items-center justify-end p-2">
        <Button variant="outline" size="sm" onClick={handleSave}>
          Save
        </Button>
      </div>

      <Tiptap className="h-[calc(100%-44px)] w-full" handleChange={handleChange} />
    </div>
  )
}
