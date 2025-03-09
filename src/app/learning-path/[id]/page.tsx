import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import LearningSteps from '@/components/learning/LearningSteps'
import Link from 'next/link'
import { mockSavedPaths } from '@/lib/mockData'
import { Metadata } from 'next'

interface Step {
  id: number
  title: string
  description: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  estimatedTime: string
}

type PageParams = { id: string }

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  return {
    title: `Learning Path - ${params.id}`,
  }
}

async function getLearningPath(id: string) {
  if (process.env.NEXT_PUBLIC_TESTING_MODE === 'true') {
    return mockSavedPaths.find(p => p.id === id) || null
  }

  const path = await prisma.savedLearningPath.findUnique({
    where: { id },
    include: { user: true },
  })

  return path
}

export default async function LearningPathPage({ params }: { params: PageParams }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const path = await getLearningPath(params.id)

  if (!path) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Path Not Found</h1>
          <p className="text-purple-200 mb-8">This learning path does not exist or has been deleted.</p>
          <Link
            href="/saved-paths"
            className="bg-purple-500 hover:bg-purple-400 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
          >
            <span>←</span>
            <span>Back to Saved Paths</span>
          </Link>
        </div>
      </main>
    )
  }

  // Only check user email if not in testing mode and path has user info
  if (!process.env.NEXT_PUBLIC_TESTING_MODE && 'user' in path && path.user.email !== session.user?.email) {
    redirect('/saved-paths')
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/saved-paths"
          className="text-purple-300 hover:text-purple-200 transition-colors inline-flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to Saved Paths</span>
        </Link>
      </div>
      
      <LearningSteps topic={path.topic} steps={path.steps as unknown as Step[]} />
    </main>
  )
} 