import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/docs/[docId]/duplicate - Duplicate a document
export async function POST(request: NextRequest, { params }: { params: { docId: string } }) {
  try {
    const session = await auth()

    // セッションがない場合は401エラーを返す
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { docId } = params

    // Find the original document
    const originalDoc = await prisma.doc.findUnique({
      where: { docId },
    })

    if (!originalDoc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // If the document has a userId, ensure the current user owns it
    if (originalDoc.userId && originalDoc.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Create a duplicate document
    const duplicatedDoc = await prisma.doc.create({
      data: {
        content: originalDoc.content as Prisma.InputJsonValue,
        modifiedAt: new Date(),
        userId,
      },
    })

    return NextResponse.json(duplicatedDoc, { status: 201 })
  } catch (error) {
    console.error('Error duplicating document:', error)
    return NextResponse.json({ error: 'Failed to duplicate document' }, { status: 500 })
  }
}
