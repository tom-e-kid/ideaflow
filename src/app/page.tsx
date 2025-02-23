'use client'
import RichEditor from '@/components/editor'

export default function Home() {
  const handleChange = (content: string) => {
    console.log('Editor content:', content)
    // You can also get Markdown using:
    // const markdown = getMarkdownFromHtml(content)
  }
  return (
    <div className="h-full w-full">
      <RichEditor
        placeholder="Write your idea here..."
        onChange={handleChange}
        className="h-full"
      />
    </div>
  )
}
