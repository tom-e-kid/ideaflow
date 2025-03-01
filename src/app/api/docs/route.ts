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

    return NextResponse.json({ docId: doc.docId }, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

// PUT /api/docs - Update an existing document
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    // セッションがない場合は401エラーを返す
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    const { docId, content } = await request.json()

    if (!docId || !content) {
      return NextResponse.json({ error: 'DocId and content are required' }, { status: 400 })
    }

    // Find the document and check ownership if user is logged in
    const existingDoc = await prisma.doc.findUnique({
      where: { docId },
    })

    if (!existingDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // If the document has a userId, ensure the current user owns it
    if (existingDoc.userId && existingDoc.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const updatedDoc = await prisma.doc.update({
      where: { docId },
      data: {
        content,
        modifiedAt: new Date(),
      },
    })

    return NextResponse.json({ docId: updatedDoc.docId }, { status: 200 })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}
