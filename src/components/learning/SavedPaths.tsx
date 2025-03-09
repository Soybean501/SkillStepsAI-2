'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface SavedPath {
  id: string
  topic: string
  steps: Array<{
    id: number
    title: string
    description: string
    difficulty: string
    estimatedTime: string
  }>
  createdAt: string
}

export default function SavedPaths() {
  const { data: session, status } = useSession()
  const [savedPaths, setSavedPaths] = React.useState<SavedPath[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  React.useEffect(() => {
    const fetchSavedPaths = async () => {
      try {
        if (!session) {
          setIsLoading(false)
          return
        }

        const response = await fetch('/api/saved-paths')
        if (!response.ok) {
          throw new Error('Failed to fetch saved paths')
        }

        const data = await response.json()
        setSavedPaths(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSavedPaths()
  }, [session])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div>
        <p>Please sign in to view your saved learning paths.</p>
      </div>
    )
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (isLoading) {
    return <div>Loading saved paths...</div>
  }

  return (
    <div>
      <h2>Your Saved Learning Paths</h2>
      {savedPaths.length === 0 ? (
        <p>No saved learning paths yet.</p>
      ) : (
        <ul>
          {savedPaths.map((path) => (
            <li key={path.id} onClick={() => router.push(`/learning-path/${path.id}`)}>
              <h3>{path.topic}</h3>
              <p>Steps: {path.steps.length}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}