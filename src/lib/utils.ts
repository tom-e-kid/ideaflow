import { JSONContent } from '@tiptap/react'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function sanitizeUrl(url: string) {
  if (!url) return ''
  if (!isValidUrl(url)) return ''
  return url
}

export function getMarkdownFromHtml(html: string) {
  // This is a simple example. You might want to use a proper HTML to Markdown converter
  return html
    .replace(/<h1>/g, '# ')
    .replace(/<\/h1>/g, '\n\n')
    .replace(/<h2>/g, '## ')
    .replace(/<\/h2>/g, '\n\n')
    .replace(/<h3>/g, '### ')
    .replace(/<\/h3>/g, '\n\n')
    .replace(/<p>/g, '')
    .replace(/<\/p>/g, '\n\n')
    .replace(/<strong>/g, '**')
    .replace(/<\/strong>/g, '**')
    .replace(/<em>/g, '_')
    .replace(/<\/em>/g, '_')
    .replace(/<ul>/g, '')
    .replace(/<\/ul>/g, '\n')
    .replace(/<li>/g, '- ')
    .replace(/<\/li>/g, '\n')
    .replace(/<ol>/g, '')
    .replace(/<\/ol>/g, '\n')
    .replace(/<code>/g, '`')
    .replace(/<\/code>/g, '`')
    .replace(/<pre><code>/g, '```\n')
    .replace(/<\/code><\/pre>/g, '\n```\n')
    .replace(/<blockquote>/g, '> ')
    .replace(/<\/blockquote>/g, '\n\n')
    .replace(/<a href="([^"]+)">/g, '[$1](')
    .replace(/<\/a>/g, ')')
    .replace(/<img src="([^"]+)"[^>]*>/g, '![]($1)')
    .replace(/\n\n+/g, '\n\n')
    .trim()
}

/**
 * Extracts a title from the document content
 * Returns the first line of text or a default title if none is found
 */
export function extractDocumentTitle(content: JSONContent | null): string {
  if (!content || !content.content || !Array.isArray(content.content)) {
    return 'Untitled Document'
  }

  // Look for the first paragraph or heading with text content
  for (const node of content.content) {
    // Check for headings first
    if (node.type && node.type.startsWith('heading') && node.content) {
      const text = extractTextFromNode(node)
      if (text) return text
    }

    // Then check for paragraphs
    if (node.type === 'paragraph' && node.content) {
      const text = extractTextFromNode(node)
      if (text) return text
    }
  }

  return 'Untitled Document'
}

/**
 * Helper function to extract text from a node
 */
function extractTextFromNode(node: JSONContent): string {
  if (!node.content || !Array.isArray(node.content)) {
    return ''
  }

  // Collect all text content from the node's children
  const textParts: string[] = []

  for (const child of node.content) {
    if (child.type === 'text' && typeof child.text === 'string') {
      textParts.push(child.text)
    }
  }

  const text = textParts.join('')

  // Limit to a reasonable length for a title
  return text.length > 50 ? `${text.substring(0, 47)}...` : text
}
