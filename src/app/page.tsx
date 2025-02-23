'use client'
import RichEditor from '@/components/editor'
import { Button } from '@/components/ui/button'

export default function Home() {
  const handleChange = (content: string) => {
    console.log('Editor content:', content)
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

      <RichEditor
        placeholder="Write your idea here..."
        onChange={handleChange}
        className="h-[calc(100%-44px)] w-full"
      />
    </div>
  )
}
