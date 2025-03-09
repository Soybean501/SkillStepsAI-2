import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface SavedPath {
  id: string
  topic: string
  steps: Array<{
    id: number
    title: string
    description: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    estimatedTime: string
  }>
  createdAt: string
}

export default function SavedPaths() {
  const { data: session } = useSession()
  const [savedPaths, setSavedPaths] = React.useState<SavedPath[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchSavedPaths = async () => {
      if (!session) {
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/learning-paths')
        if (!response.ok) {
          throw new Error('Failed to fetch saved paths')
        }

        const data = await response.json()
        setSavedPaths(data)
      } catch (error) {
        console.error('Error fetching saved paths:', error)
        setError('Failed to load saved learning paths')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedPaths()
  }, [session])

  if (!session) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-200 text-lg">
          Please{' '}
          <Link href="/auth/signin" className="text-purple-400 hover:text-purple-300">
            sign in
          </Link>{' '}
          to view your saved learning paths.
        </p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin text-4xl mb-4">⏳</div>
        <p className="text-purple-200">Loading your learning paths...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-900/50 border border-red-400 text-red-200 px-4 py-2 rounded-lg inline-block">
          {error}
        </div>
      </div>
    )
  }

  if (savedPaths.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-purple-200 text-lg">You haven&apos;t saved any learning paths yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white">Your Saved Learning Paths</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {savedPaths.map((path) => (
          <div
            key={path.id}
            className="bg-purple-900/70 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-400 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            <h3 className="text-xl font-semibold text-white mb-4">{path.topic}</h3>
            <div className="space-y-2">
              <p className="text-purple-200">
                {path.steps.length} steps • Created on{' '}
                {new Date(path.createdAt).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2">
                {path.steps.slice(0, 3).map((step) => (
                  <span
                    key={step.id}
                    className="px-3 py-1 bg-purple-800/50 rounded-full text-purple-200 text-sm"
                  >
                    {step.title}
                  </span>
                ))}
                {path.steps.length > 3 && (
                  <span className="px-3 py-1 bg-purple-800/50 rounded-full text-purple-200 text-sm">
                    +{path.steps.length - 3} more
                  </span>
                )}
              </div>
            </div>
            <div className="mt-4">
              <Link
                href={`/saved-paths/${path.id}`}
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300"
              >
                View Path <span>→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 