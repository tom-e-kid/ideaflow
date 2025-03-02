import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/docs - Create a new document
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    // セッションがない場合は401エラーを返す
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const { content } = await request.json()

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 })
    }

    const doc = await prisma.doc.create({
      data: {
        content,
        modifiedAt: new Date(),
        userId, // ここでundefinedの可能性がなくなる
      },
    })

    return NextResponse.json(doc, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

// GET /api/docs - Get all documents with pagination
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    // セッションがない場合は401エラーを返す
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const cursor = searchParams.get('cursor')
    const limit = parseInt(searchParams.get('limit') || '50', 10)

    // Find documents owned by the user
    const docs = await prisma.doc.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
      take: limit + 1, // Take one more to check if there are more docs
      ...(cursor
        ? {
            skip: 1, // Skip the cursor
            cursor: {
              id: cursor,
            },
          }
        : {}),
      select: {
        id: true,
        docId: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Check if there are more docs
    const hasMore = docs.length > limit
    const nextDocs = hasMore ? docs.slice(0, limit) : docs
    const nextCursor = hasMore ? docs[limit - 1].id : null

    return NextResponse.json({
      docs: nextDocs,
      nextCursor,
      hasMore,
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
  }
}
