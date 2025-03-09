import { NextResponse } from 'next/server'
import { mockLearningPath } from '@/lib/mockData'

export async function POST(req: Request) {
  try {
    console.log('Generate API - Testing mode:', process.env.NEXT_PUBLIC_TESTING_MODE)
    // Use mock data in testing mode
    if (process.env.NEXT_PUBLIC_TESTING_MODE === 'true') {
      console.log('Returning mock learning path:', mockLearningPath)
      return NextResponse.json(mockLearningPath)
    }

    const body = await req.json()
    const { topic } = body

    if (!topic) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    const prompt = `Create a step-by-step learning path for: ${topic}
    
    The response should be a JSON object with:
    - topic: the main topic
    - steps: an array of learning steps, where each step has:
      - id: a number starting from 1
      - title: a clear, concise title
      - description: a brief description of what to learn
      - difficulty: one of "Beginner", "Intermediate", or "Advanced"
      - estimatedTime: estimated time to complete (e.g. "30 minutes", "1 hour")
    
    Keep it focused and practical. Include 3-5 steps.`

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'HTTP-Referer': 'https://github.com/harrytowsn/skillstepsai',
        'X-Title': 'SkillStepsAI',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3-opus',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate learning path')
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    try {
      const parsedContent = JSON.parse(content)
      return NextResponse.json(parsedContent)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json(
        { error: 'Failed to parse learning path' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error generating learning path:', error)
    return NextResponse.json(
      { error: 'Failed to generate learning path' },
      { status: 500 }
    )
  }
} 