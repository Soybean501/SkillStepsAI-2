import React, { useState, useEffect } from 'react'
import { mockLearningPath, type LearningPath } from '@/lib/mockData'

interface Props {
  onPathGenerated: (path: LearningPath) => void
}

export default function LearningPathSearch({ onPathGenerated }: Props) {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Reset state when component mounts
  useEffect(() => {
    setQuery('')
    setError(null)
    // Clear any stored path to ensure fresh start
    localStorage.removeItem('currentLearningPath')
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      // Use mock data in testing mode
      if (process.env.NEXT_PUBLIC_TESTING_MODE === 'true') {        
        const mockPath = mockLearningPath(query, 'Beginner')
        console.log('mockLearningPath:', mockLearningPath)
        console.log('Using mock learning path:', mockPath)
        onPathGenerated(mockPath)
        setQuery('')
        return
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: query,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate learning path')
      }

      const data = await response.json()
      console.log('API Response:', data)

      if (!data.steps || !Array.isArray(data.steps)) {
        throw new Error('Invalid response format')
      }

      const learningPath: LearningPath = {
        topic: data.topic || query,
        steps: data.steps.map((step: any) => ({
          id: step.id || 0,
          title: step.title || 'Untitled Step',
          description: step.description || 'No description available',
          difficulty: step.difficulty || 'Beginner',
          estimatedTime: step.estimatedTime || '30 minutes',
        })),
      }

      console.log('Processed learning path:', learningPath)
      localStorage.setItem('currentLearningPath', JSON.stringify(learningPath))
      onPathGenerated(learningPath)
      setQuery('')
    } catch (err) {
      setError('Error generating learning path')
      console.error('Error generating learning path:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What would you like to learn? (e.g., &quot;Learn Python programming&quot;, &quot;Master digital marketing&quot;)"
            className="w-full px-6 py-4 bg-purple-900/70 backdrop-blur-sm border-2 border-purple-400 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-300 transition-colors"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Generating...' : 'Generate Path'}
          </button>
        </div>
        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}
        <div className="text-center text-purple-200 text-sm">
          <p>Examples:</p>
          <ul className="mt-2 space-y-1">
            <li>Learn Python programming from scratch</li>
            <li>Master digital marketing strategies</li>
            <li>Become a web developer</li>
            <li>Learn photography basics</li>
          </ul>
        </div>
      </form>
    </div>
  )
}