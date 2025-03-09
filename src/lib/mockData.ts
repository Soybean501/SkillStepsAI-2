interface Step {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
}

interface SavedPath {
  id: string
  topic: string
  steps: Step[]
  createdAt: string
  updatedAt: string
}

export const mockLearningPath: { topic: string, steps: Step[] } = {
  topic: "Introduction to JavaScript",
  steps: [
    {
      id: 1,
      title: "Understanding Variables and Data Types",
      description: "Learn about variables, let/const, and basic data types in JavaScript.",
      difficulty: "Beginner",
      estimatedTime: "30 minutes"
    },
    {
      id: 2,
      title: "Control Flow and Functions",
      description: "Master if statements, loops, and function declarations.",
      difficulty: "Beginner",
      estimatedTime: "45 minutes"
    },
    {
      id: 3,
      title: "Working with Arrays and Objects",
      description: "Explore array methods and object manipulation in JavaScript.",
      difficulty: "Intermediate",
      estimatedTime: "1 hour"
    }
  ] as Step[]
}

export const mockSavedPaths: SavedPath[] = [
  {
    id: "mock-1",
    topic: "Introduction to JavaScript",
    steps: mockLearningPath.steps,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "mock-2",
    topic: "Python for Beginners",
    steps: [
      {
        id: 1,
        title: "Python Basics",
        description: "Learn about variables, data types, and basic syntax in Python.",
        difficulty: "Beginner",
        estimatedTime: "45 minutes"
      },
      {
        id: 2,
        title: "Control Structures",
        description: "Master if statements, loops, and function definitions in Python.",
        difficulty: "Beginner",
        estimatedTime: "1 hour"
      }
    ] as Step[],
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 172800000).toISOString()
  }
] 