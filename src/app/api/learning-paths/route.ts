import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

interface Step {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
}

interface SavedPathResponse {
  id: string
  topic: string
  steps: Step[]
  createdAt: Date
  updatedAt: Date
}

export async function POST(req: Request) {
  try {
    console.log('POST /api/learning-paths - Start')
    const session = await getServerSession(authOptions)
    console.log('Session:', JSON.stringify(session, null, 2))
    
    if (!session?.user?.email) {
      console.log('No session or email')
      return NextResponse.json({ error: 'Unauthorized - No valid session' }, { status: 401 })
    }

    let body;
    try {
      body = await req.json()
      console.log('Request body:', JSON.stringify(body, null, 2))
    } catch (parseError) {
      console.error('Error parsing request body:', parseError)
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { topic, steps } = body

    if (!topic || !steps || !Array.isArray(steps)) {
      console.log('Invalid request body - Missing or invalid fields:', { topic, steps })
      return NextResponse.json({ 
        error: 'Invalid request body - Missing required fields or invalid format',
        details: {
          topic: !topic ? 'Missing topic' : 'OK',
          steps: !steps ? 'Missing steps' : (!Array.isArray(steps) ? 'Steps must be an array' : 'OK')
        }
      }, { status: 400 })
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      })
      console.log('Found user:', user ? { id: user.id, email: user.email } : 'null')

      if (!user) {
        console.log('User not found for email:', session.user.email)
        return NextResponse.json({ error: 'User not found in database' }, { status: 404 })
      }

      console.log('Creating saved path...')
      const savedPath = await prisma.savedLearningPath.create({
        data: {
          topic,
          steps: steps,
          userId: user.id,
        },
      })
      console.log('Saved path created:', { id: savedPath.id, topic: savedPath.topic })

      const response: SavedPathResponse = {
        id: savedPath.id,
        topic: savedPath.topic,
        steps: savedPath.steps as unknown as Step[],
        createdAt: savedPath.createdAt,
        updatedAt: savedPath.updatedAt
      }

      return NextResponse.json(response)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json({ 
        error: 'Database operation failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Unhandled error in POST handler:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const savedPaths = await prisma.savedLearningPath.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    })

    const response: SavedPathResponse[] = savedPaths.map(path => ({
      id: path.id,
      topic: path.topic,
      steps: path.steps as unknown as Step[],
      createdAt: path.createdAt,
      updatedAt: path.updatedAt
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching learning paths:', error)
    return NextResponse.json(
      { error: 'Failed to fetch learning paths' },
      { status: 500 }
    )
  }
} 