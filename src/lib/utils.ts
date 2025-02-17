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
