import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/docs/[docId] - Get a document by ID
export async function GET(request: NextRequest, { params }: { params: { docId: string } }) {
  try {
    const session = await auth()

    // セッションがない場合は401エラーを返す
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id
    const { docId } = params

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

    return NextResponse.json(doc)
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 })
  }
}
