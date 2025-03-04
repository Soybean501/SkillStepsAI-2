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

export class AIService {
  private static instance: AIService
  private apiKey: string
  private baseUrl: string

  private constructor() {
    this.apiKey = AI_CONFIG.OPENROUTER_API_KEY
    this.baseUrl = AI_CONFIG.OPENROUTER_BASE_URL
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  private async makeRequest(prompt: string, options: AIRequestOptions = {}): Promise<AIResponse> {
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
      throw new Error(`AI API request failed: ${response.statusText}`)
    }

    return response.json()
  }

  public async generateLearningPath(topic: string): Promise<string> {
    const prompt = `Create a detailed learning path for ${topic}. Include:
    1. A clear progression of topics
    2. Estimated time for each step
    3. Difficulty levels
    4. Key concepts to master
    5. Practice exercises
    6. Resources and references
    
    Format the response in a clear, structured way.`

    try {
      const response = await this.makeRequest(prompt)
      return response.choices[0].message.content
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