import React, { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface Step {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
}

interface LearningStepsProps {
  steps: Step[]
  topic: string
}

export default function LearningSteps({ steps, topic }: LearningStepsProps) {
  const { data: session, status } = useSession()
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  console.log('Session status:', status)
  console.log('Session data:', JSON.stringify(session, null, 2))
  console.log('User data:', session?.user)

  const handleSave = async () => {
    if (!session) {
      setSaveError('Please sign in to save learning paths')
      return
    }

    console.log('Starting save...', { topic, steps })
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)

    try {
      console.log('Making API request...')
      const response = await fetch(`${window.location.origin}/api/learning-paths`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          steps,
        }),
      })

      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));
      
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      if (!response.ok) {
        let errorMessage = 'Failed to save learning path';
        try {
          const errorData = responseText ? JSON.parse(responseText) : {};
          console.error('Parsed API error:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
        }
        throw new Error(errorMessage);
      }

      const data = responseText ? JSON.parse(responseText) : {};
      console.log('Save successful:', data)
      setSaveSuccess(true)
    } catch (error) {
      console.error('Error saving learning path:', error)
      setSaveError('Failed to save learning path')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-white">Your Learning Path</h2>
        {session && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-purple-500 hover:bg-purple-400 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <span className="animate-spin">⏳</span>
                Saving...
              </>
            ) : (
              <>
                <span>💾</span>
                Save Path
              </>
            )}
          </button>
        )}
      </div>

      {saveError && (
        <div className="bg-red-900/50 border border-red-400 text-red-200 px-4 py-2 rounded-lg">
          {saveError}
        </div>
      )}

      {saveSuccess && (
        <div className="bg-green-900/50 border border-green-400 text-green-200 px-4 py-2 rounded-lg">
          Learning path saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {steps.map((step, index) => (
          <Link key={step.id} href={`/learn/${step.id}`}>
            <div className="bg-purple-900/70 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-400 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="bg-purple-700 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold shrink-0 group-hover:scale-110 transition-transform">
                  {index + 1}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-purple-200">{step.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-3 py-1 rounded-full border ${
                      step.difficulty === 'Beginner' ? 'bg-green-900/50 text-green-200 border-green-400' :
                      step.difficulty === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-200 border-yellow-400' :
                      'bg-red-900/50 text-red-200 border-red-400'
                    }`}>
                      {step.difficulty}
                    </span>
                    <span className="text-purple-300 flex items-center gap-1">
                      <span>⏱️</span> {step.estimatedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
} 