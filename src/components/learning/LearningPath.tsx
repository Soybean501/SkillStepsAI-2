import React from 'react'
import Link from 'next/link'

export interface Step {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
}

interface LearningPathProps {
  steps: Step[]
  topic: string
}

export default function LearningPath({ steps, topic }: LearningPathProps) {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4 animate-fade-in">
          ✨ {topic} Learning Path ✨
        </h2>
        <p className="text-purple-100 text-lg animate-fade-in-delayed">
          Follow this magical journey to master {topic.toLowerCase()}
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, index) => (
          <Link 
            href={`/learn/${step.id}`} 
            key={step.id}
            className="block group"
          >
            <div className="relative bg-purple-900/70 backdrop-blur-sm rounded-xl p-8 border-2 border-purple-400 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-purple-500/50 focus:ring-offset-2 focus:ring-offset-purple-900">
              <div className="absolutex -left-6 -top-6 w-12 h-12 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-purple-400 shadow-lg group-hover:scale-110 transition-transform">
                {step.id}
              </div>
              
              <div className="ml-6">
                <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-200 transition-colors">
                  {step.title}
                </h3>
                <p className="text-purple-100 text-lg mb-6 leading-relaxed">
                  {step.description}
                </p>
                <div className="flex items-center gap-4 text-base">
                  <span className={`px-4 py-2 rounded-full border-2 font-medium ${
                    step.difficulty === 'Beginner' ? 'bg-green-900/50 text-green-200 border-green-400' :
                    step.difficulty === 'Intermediate' ? 'bg-yellow-900/50 text-yellow-200 border-yellow-400' :
                    'bg-red-900/50 text-red-200 border-red-400'
                  }`}>
                    {step.difficulty}
                  </span>
                  <span className="text-purple-200 flex items-center gap-2">
                    <span className="text-xl">⏱️</span> {step.estimatedTime}
                  </span>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute left-0 top-full w-0.5 h-8 bg-purple-400 animate-pulse"></div>
              )}
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 1; }
          100% { opacity: 0.5; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
} 