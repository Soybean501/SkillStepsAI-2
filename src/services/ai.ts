import { AI_CONFIG } from '@/config/ai'

interface AIResponse {
  choices: Array<{
    message: {
      content: string
      role: string
    }
    finish_reason: string
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

interface AIRequestOptions {
  model?: string
  maxTokens?: number
  temperature?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

interface LearningStep {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
}

interface LearningPathResponse {
  steps: LearningStep[]
}

export class AIService {
  private static instance: AIService
  private apiKey: string
  private baseUrl: string

  private constructor() {
    this.apiKey = AI_CONFIG.OPENROUTER_API_KEY
    this.baseUrl = AI_CONFIG.OPENROUTER_BASE_URL
    
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured. Please set the OPENROUTER_API_KEY environment variable.')
    }
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  private async makeRequest(prompt: string, options: AIRequestOptions = {}): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('OpenRouter API key is not configured')
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
        'HTTP-Referer': 'https://skillstepsai.com',
        'X-Title': 'SkillSteps AI'
      },
      body: JSON.stringify({
        model: options.model || AI_CONFIG.DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI tutor specializing in creating personalized learning paths and providing educational content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: options.maxTokens || AI_CONFIG.MAX_TOKENS,
        temperature: options.temperature || AI_CONFIG.TEMPERATURE,
        top_p: options.topP || AI_CONFIG.TOP_P,
        frequency_penalty: options.frequencyPenalty || AI_CONFIG.FREQUENCY_PENALTY,
        presence_penalty: options.presencePenalty || AI_CONFIG.PRESENCE_PENALTY
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`AI API request failed: ${response.statusText}. Details: ${errorText}`)
    }

    return response.json()
  }

  public async generateLearningPath(topic: string): Promise<LearningPathResponse> {
    const prompt = `Create a detailed learning path for ${topic}. Return the response as a JSON object with the following structure:
    {
      "steps": [
        {
          "id": number,
          "title": string,
          "description": string,
          "difficulty": "Beginner" | "Intermediate" | "Advanced",
          "estimatedTime": string
        }
      ]
    }
    
    Include 5-7 steps with clear progression, appropriate difficulty levels, and realistic time estimates.`

    try {
      const response = await this.makeRequest(prompt)
      const content = response.choices[0].message.content
      // Try to parse the JSON response
      try {
        return JSON.parse(content)
      } catch (error) {
        console.error('Error parsing AI response:', error);
        // If parsing fails, create a structured response from the text
        const steps = content.split('\n').filter(line => line.trim()).map((line, index) => ({
          id: index + 1,
          title: line.split(':')[0] || `Step ${index + 1}`,
          description: line.split(':')[1] || 'No description available',
          difficulty: 'Beginner' as const,
          estimatedTime: '30 minutes'
        }))
        return { steps }
      }
    } catch (error) {
      console.error('Error generating learning path:', error)
      throw error
    }
  }

  public async generateStepContent(stepId: number, topic: string): Promise<string> {
    const prompt = `Generate detailed content for step ${stepId} of learning ${topic}. Include:
    1. Clear explanations of concepts
    2. Examples and use cases
    3. Practice exercises
    4. Common pitfalls to avoid
    5. Additional resources
    
    Make the content engaging and easy to understand.`

    try {
      const response = await this.makeRequest(prompt)
      return response.choices[0].message.content
    } catch (error) {
      console.error('Error generating step content:', error)
      throw error
    }
  }

  public async getPracticeExercises(topic: string, difficulty: string): Promise<string> {
    const prompt = `Create practice exercises for ${topic} at ${difficulty} level. Include:
    1. Multiple exercises with varying complexity
    2. Step-by-step solutions
    3. Hints and tips
    4. Expected outcomes
    5. Additional challenges for practice`

    try {
      const response = await this.makeRequest(prompt)
      return response.choices[0].message.content
    } catch (error) {
      console.error('Error generating practice exercises:', error)
      throw error
    }
  }
} 