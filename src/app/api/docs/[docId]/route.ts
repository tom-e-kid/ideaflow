import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/docs/[docId] - Get a document by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const session = await auth()

    // セッションがない場合は401エラーを返す
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { docId } = await params
    const doc = await prisma.doc.findUnique({
      where: { docId },
    })

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // If the document has a userId, ensure the current user owns it
    if (doc.userId && doc.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(doc, { status: 200 })
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 })
  }
}

// PUT /api/docs/[docId] - Update a document by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const session = await auth()

    // セッションがない場合は401エラーを返す
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { docId } = await params
    const { content } = await request.json()

    if (!docId || !content) {
      return NextResponse.json({ error: 'DocId and content are required' }, { status: 400 })
    }

    // Find the document
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
      data: { content, modifiedAt: new Date() },
    })

    return NextResponse.json(updatedDoc, { status: 200 })
  } catch (error) {
    console.error('Error updating document:', error)
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
  }
}

// DELETE /api/docs/[docId] - Delete a document by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ docId: string }> }
) {
  try {
    const session = await auth()

    // セッションがない場合は401エラーを返す
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { docId } = await params

    // Find the document
    const doc = await prisma.doc.findUnique({
      where: { docId },
    })

    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // If the document has a userId, ensure the current user owns it
    if (doc.userId && doc.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete the document
    await prisma.doc.delete({
      where: { docId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
