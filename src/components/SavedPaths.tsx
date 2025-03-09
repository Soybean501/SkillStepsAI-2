'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { mockSavedPaths } from '@/lib/mockData'

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

export default function SavedPaths() {
  const [paths, setPaths] = useState<SavedPath[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        console.log('Testing mode:', process.env.NEXT_PUBLIC_TESTING_MODE)
        if (process.env.NEXT_PUBLIC_TESTING_MODE === 'true') {
          console.log('Using mock data:', mockSavedPaths)
          setPaths(mockSavedPaths)
          setLoading(false)
          return
        }

        const response = await fetch('/api/learning-paths')
        if (!response.ok) {
          throw new Error('Failed to fetch saved paths')
        }
        const data = await response.json()
        setPaths(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchPaths()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-400 text-red-200 p-4 rounded-lg">
        {error}
      </div>
    )
  }

  if (paths.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-200 text-lg mb-4">No saved learning paths yet.</p>
        <Link 
          href="/"
          className="inline-block bg-purple-500 hover:bg-purple-400 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Create Your First Path
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {paths.map((path) => (
        <div
          key={path.id}
          className="bg-purple-900/70 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-400 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white mb-2">{path.topic}</h2>
            <p className="text-purple-300 text-sm">
              Saved {format(new Date(path.createdAt), 'PPP')}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-200">Preview:</h3>
            <div className="space-y-3">
              {path.steps.slice(0, 3).map((step, index) => (
                <div key={step.id} className="flex items-start gap-3">
                  <div className="bg-purple-700 rounded-full w-6 h-6 flex items-center justify-center text-white font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-white font-medium">{step.title}</p>
                    <p className="text-purple-200 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {path.steps.length > 3 && (
              <p className="text-purple-300 text-sm">
                +{path.steps.length - 3} more steps
              </p>
            )}
          </div>

          <div className="mt-6 flex justify-end">
            <Link
              href={`/learning-path/${path.id}`}
              className="bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <span>View Full Path</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
} 