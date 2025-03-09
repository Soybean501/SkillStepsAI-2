import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { mockSavedPaths } from '@/lib/mockData'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (process.env.NEXT_PUBLIC_TESTING_MODE === 'true') {
      return NextResponse.json(mockSavedPaths)
    }

    const paths = await prisma.savedLearningPath.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(paths)

  } catch (error) {
    console.error('Error fetching saved paths:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved paths' },
      { status: 500 }
    )
  }
}