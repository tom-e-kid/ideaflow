# Ideaflow

An AI-powered note-taking application designed for capturing and organizing business ideas effortlessly.

## Overview

Ideaflow is a modern note-taking application that leverages artificial intelligence to help users capture, organize, and expand their ideas without manual categorization. The app automatically extracts keywords, generates summaries, and suggests related ideas, making it perfect for entrepreneurs, product managers, and creative professionals.

## Features

- 🚀 **Quick Capture** - Instantly jot down ideas without manual categorization
- 🤖 **AI-Powered Organization** - Automatic keyword extraction and theme generation
- 🔍 **Smart Search** - Find notes by date, keywords, or AI-generated themes
- 🔄 **Idea Connections** - AI-suggested connections between related notes
- 📝 **Rich Text Editor** - Full Markdown support with to-do lists and code blocks
- 📱 **Multi-Device Sync** - Seamless access across all your devices
- 🎨 **Modern UI** - Clean, intuitive interface built with Shadcn/UI

## Tech Stack

### Frontend

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [Shadcn/UI](https://ui.shadcn.com/) - UI component library
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Tiptap](https://tiptap.dev/) - Rich text editor
- [Lucide Icons](https://lucide.dev/) - Icon set

### Backend

- Serverless architecture
- [Prisma](https://www.prisma.io/) - Database ORM
- [MongoDB](https://www.mongodb.com/) - Database
- [LangGraph API](https://github.com/langchain-ai/langgraph) - AI processing

### Authentication

- [Auth.js](https://authjs.dev/) - Authentication
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js

## Getting Started

### Prerequisites

- Node.js 20.x or later
- pnpm 8.x or later
- MongoDB instance
- LangGraph API credentials

### Installation

1. Clone the repository:

```bash
git clone https://github.com/tom-e-kid/ideaflow.git
cd ideaflow
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration.

4. Run the development server:

```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Project Structure

```
ideaflow/
├── public/           # Static files (images, fonts)
├── prisma/          # Database schema and migrations
│   └── schema.prisma
├── src/
│   ├── app/         # Next.js app directory (App Router)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   ├── global.css
│   │   └── api/     # API routes
│   ├── components/  # Reusable UI components
│   │   ├── ui/     # Shadcn/UI components
│   │   └── layouts/# Layout components
│   ├── hooks/      # Custom React hooks
│   ├── stores/     # State management
│   ├── lib/        # Utility functions
│   ├── types/      # TypeScript types
│   └── middleware.ts
├── .env            # Environment variables
├── .gitignore
├── .prettierrc
├── eslint.config.mjs
├── tailwind.config.ts
├── next.config.ts
└── tsconfig.json
```

### File Naming Conventions

- Use kebab-case for directories and component files
- Use kebab-case for component and hook file names. Examples: `button.tsx`, `use-custom-hook.ts`.
- Other files (config files, stylesheets, etc.) follow standard naming conventions, but if no clear convention exists, use kebab-case.

### Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components by [Shadcn/UI](https://ui.shadcn.com/)
- AI powered by [LangGraph](https://github.com/langchain-ai/langgraph)
