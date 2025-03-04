import { NextResponse } from 'next/server'
import { AIService } from '@/services/ai'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, topic, stepId, difficulty } = body

    const aiService = AIService.getInstance()
    let response: string

    switch (action) {
      case 'generateLearningPath':
        if (!topic) {
          return NextResponse.json(
            { error: 'Topic is required' },
            { status: 400 }
          )
        }
        response = await aiService.generateLearningPath(topic)
        break

      case 'generateStepContent':
        if (!topic || !stepId) {
          return NextResponse.json(
            { error: 'Topic and stepId are required' },
            { status: 400 }
          )
        }
        response = await aiService.generateStepContent(stepId, topic)
        break

      case 'getPracticeExercises':
        if (!topic || !difficulty) {
          return NextResponse.json(
            { error: 'Topic and difficulty are required' },
            { status: 400 }
          )
        }
        response = await aiService.getPracticeExercises(topic, difficulty)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({ content: response })
  } catch (error) {
    console.error('AI API error:', error)
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    )
  }
} 