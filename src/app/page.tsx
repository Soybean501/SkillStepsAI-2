'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Navigation from '@/components/Navigation'
import LearningPathSearch from '@/components/learning/LearningPathSearch'
import LearningSteps from '@/components/learning/LearningSteps'

interface LearningPath {
  topic: string
  steps: Array<{
    id: number
    title: string
    description: string
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
    estimatedTime: string
  }>
}

export default function Home() {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null)

  useEffect(() => {
    const storedPath = localStorage.getItem('currentLearningPath')
    if (storedPath) {
      try {
        const parsedPath = JSON.parse(storedPath)
        console.log('Loaded stored path:', parsedPath)
        
        if (parsedPath.topic && Array.isArray(parsedPath.steps) && parsedPath.steps.length > 0) {
          setLearningPath(parsedPath)
        } else {
          console.log('Invalid stored path structure, removing from storage')
          localStorage.removeItem('currentLearningPath')
        }
      } catch (err) {
        console.error('Error parsing learning path:', err)
        localStorage.removeItem('currentLearningPath')
      }
    }
  }, [])

  const handlePathGenerated = (path: LearningPath) => {
    console.log('Received new path:', path)
    setLearningPath(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20"></div>
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-16 relative">
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-32 h-32 relative">
              <Image
                src="/wizard.svg"
                alt="Wizard"
                fill
                className="animate-float"
                priority
              />
            </div>
            <div className="absolute -top-4 -right-4">
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mt-6 mb-4">
            Welcome to SkillSteps AI
          </h1>
          <p className="text-purple-100 text-xl">
            Your magical journey to learning starts here!
          </p>
        </div>

        <div className="animate-fade-in-delayed">
          <LearningPathSearch onPathGenerated={handlePathGenerated} />
        </div>

        {learningPath && learningPath.steps && learningPath.steps.length > 0 && (
          <div className="mt-12 animate-fade-in-delayed">
            <LearningSteps steps={learningPath.steps} topic={learningPath.topic} />
          </div>
        )}

        {!learningPath && (
          <div className="mt-16 space-y-12 animate-fade-in-delayed">
            <section className="text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 rounded-3xl -z-10"></div>
              <h2 className="text-4xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400">Popular Learning Paths</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
                {[
                  { 
                    title: 'Web Development', 
                    description: 'Master HTML, CSS, and JavaScript',
                    icon: '🌐'
                  },
                  { 
                    title: 'Data Science', 
                    description: 'Learn Python, statistics, and machine learning',
                    icon: '📊'
                  },
                  { 
                    title: 'Digital Marketing', 
                    description: 'SEO, social media, and content strategy',
                    icon: '📱'
                  },
                  { 
                    title: 'Photography', 
                    description: 'Camera basics, composition, and editing',
                    icon: '📸'
                  },
                ].map((path, index) => (
                  <div 
                    key={index} 
                    className="group bg-purple-900/40 backdrop-blur-lg rounded-xl p-8 border-2 border-purple-400/30 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer"
                  >
                    <span className="text-4xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">{path.icon}</span>
                    <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">{path.title}</h3>
                    <p className="text-purple-200 text-lg">{path.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="text-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 rounded-3xl -z-10"></div>
              <h2 className="text-4xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400">Why Choose SkillSteps AI?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
                {[
                  { icon: '🎯', title: 'Personalized Learning', description: 'AI-powered paths tailored to your goals' },
                  { icon: '⚡', title: 'Interactive Content', description: 'Engaging exercises and real-world projects' },
                  { icon: '📈', title: 'Progress Tracking', description: 'Monitor your learning journey' },
                  { icon: '🤖', title: 'AI Guidance', description: 'Get instant feedback and support' },
                  { icon: '🎓', title: 'Expert Knowledge', description: 'Learn from industry best practices' },
                  { icon: '🌟', title: 'Flexible Learning', description: 'Learn at your own pace' },
                ].map((feature, index) => (
                  <div 
                    key={index} 
                    className="group bg-purple-900/40 backdrop-blur-lg rounded-xl p-8 border-2 border-purple-400/30 hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1 cursor-pointer"
                  >
                    <span className="text-4xl mb-4 block transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</span>
                    <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">{feature.title}</h3>
                    <p className="text-purple-200 text-lg">{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
