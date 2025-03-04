import React from 'react'
import Link from 'next/link'

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

export default function LearningSteps({ steps = [], topic }: LearningStepsProps) {
  if (!steps.length) {
    return null
  }

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">
        Learning Path: {topic}
      </h2>
      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-purple-400/30 transform -translate-y-1/2"></div>
        
        {/* Steps */}
        <div className="relative flex flex-wrap justify-center gap-6">
          {steps.map((step) => (
            <Link
              key={step.id}
              href={`/learn/${step.id}`}
              className="group relative flex-1 min-w-[250px] max-w-[300px]"
            >
              <div className="relative bg-purple-900/70 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-400 
                shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all transform hover:scale-[1.02]
                focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-purple-900">
                
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {step.id}
                  </div>
                </div>

                {/* Content */}
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-purple-200 text-sm mb-4">{step.description}</p>
                  
                  {/* Difficulty badge */}
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                    step.difficulty === 'Beginner' ? 'bg-green-900/50 text-green-200' :
                    step.difficulty === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-200' :
                    'bg-red-900/50 text-red-200'
                  }`}>
                    {step.difficulty}
                  </div>

                  {/* Time estimate */}
                  <div className="text-purple-300 text-sm flex items-center gap-2">
                    <span className="text-lg">⏱️</span> {step.estimatedTime}
                  </div>
                </div>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-purple-500/0 
                  group-hover:from-purple-500/10 group-hover:via-purple-500/5 group-hover:to-purple-500/10 
                  transition-all duration-300"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 