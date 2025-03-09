'use client'

import React from 'react'
import Navigation from '@/components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import SavedPaths from '@/components/SavedPaths'

export default async function SavedPathsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20"></div>
      <Navigation />
      
      <main className="max-w-4xl mx-auto px-4 py-16 relative">
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block">
            <div className="w-32 h-32 relative">
              <span className="text-6xl">📚</span>
            </div>
            <div className="absolute -top-4 -right-4">
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mt-6 mb-4">
            Your Learning Journey
          </h1>
          <p className="text-purple-100 text-xl">
            Access your saved learning paths and continue your magical adventure!
          </p>
        </div>

        <div className="animate-fade-in-delayed">
          <SavedPaths />
        </div>
      </main>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-fade-in-delayed {
          animation: fade-in 0.6s ease-out 0.2s forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
} 