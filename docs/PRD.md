# Ideaflow PRD

## Overview

- **Project Description**: Ideaflow is a note-taking app for quickly capturing business ideas without worrying about categorization. Each idea is stored as a new note, and AI automatically extracts keywords, summarizes content, and suggests related ideas.
- **Goals and Objectives**: Provide an efficient, AI-powered note-taking experience with automatic organization and idea expansion.
- **Success Criteria**: Smooth AI-assisted workflow, intuitive UI, and seamless multi-device support.

## User Requirements

- **User Personas**: Entrepreneurs, product managers, and creatives who need a structured yet flexible way to document and expand ideas.
- **User Stories**:
  - As a user, I want to quickly jot down ideas without selecting categories.
  - As a user, I want AI to suggest related ideas from past notes.
  - As a user, I want to view my notes by date, keywords, and AI-generated themes.
- **Use Cases**:
  - Capturing spontaneous business ideas.
  - Automatically linking related ideas through AI.
  - Searching and organizing notes based on AI-extracted tags.

## Technical Requirements

- **Architecture**: Built with Next.js 15 and React 19, utilizing a serverless backend with Prisma and MongoDB.
- **Frontend - Layout**: Shadcn/UI, TailwindCSS, Lucide Icons.
- **Frontend - Editor**: use tiptap for the editor. support markdown, todo list, code block, etc.
- **APIs**: LangGraph API for AI-based summarization and categorization.
- **Data Models**: T.B.D.
- **Security**: use magic link for authentication with Auth.js, next-auth, prisma, mongodb.
- **Package Manager**: use pnpm

## Design Requirements

- **UI/UX Guidelines**: Minimalistic interface with Markdown support, real-time previews, and a split-panel layout (left-side list, right-side editor).
- **Wireframes**: Designed for rapid entry and AI-powered organization.
- **Prototypes**: Iterative UI testing for usability and AI feedback integration.

## Timeline

- **Phases**:
  - Phase 1: Core note-taking functionality with Markdown and AI-powered tagging.
  - Phase 2: Enhanced AI recommendations and multi-device support.
  - Phase 3: Collaboration and real-time editing.
- **Milestones**: MVP release, AI enhancement, public beta.
- **Dependencies**: AI service integration, database scalability, and front-end refinement.

## Success Metrics

- **KPIs**: User engagement rate, AI suggestion accuracy, and note retrieval efficiency.
- **Measurement Plan**: Track AI performance, user retention, and feedback-driven improvements.
