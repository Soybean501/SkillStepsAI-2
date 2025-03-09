export interface Step {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
}

export interface LearningPath {
  topic: string
  steps: Step[]
}

export function mockLearningPath(topic: string, difficulty: string = 'Beginner'): LearningPath {
  console.log('mockLearningPath function loaded')
  return {    
    topic,
    steps: [
      {
        id: 1,
        title: `Introduction to ${topic}`,
        description: 'Learn the fundamentals and basic concepts',
        difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        estimatedTime: '30 minutes'
      },
      {
        id: 2,
        title: `${topic} in Practice`,
        description: 'Apply your knowledge with hands-on exercises',
        difficulty: difficulty as 'Beginner' | 'Intermediate' | 'Advanced',
        estimatedTime: '45 minutes'
      }
    ]
  }
}

// Alias for backward compatibility
export const mockGeneratePath = mockLearningPath

export const mockSavedPaths: LearningPath[] = [
  mockLearningPath('JavaScript Basics')
]