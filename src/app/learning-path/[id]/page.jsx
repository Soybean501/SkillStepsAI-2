import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import LearningSteps from '@/components/learning/LearningSteps'
import { mockSavedPaths } from '@/lib/mockData'
import PropTypes from 'prop-types'

async function getLearningPath(id) {
  if (process.env.NEXT_PUBLIC_TESTING_MODE === 'true') {
    return mockSavedPaths.find(p => p.id === id) || null
  }

  const path = await prisma.savedLearningPath.findUnique({
    where: { id },
    include: { user: true },
  })

  if (!path) return null

  const steps = Array.isArray(path.steps) ? path.steps : []

  return {
    id: path.id,
    topic: path.topic,
    steps,
    user: path.user ? { email: path.user.email } : undefined
  }
}

export async function generateMetadata({ params }) {
  return {
    title: `Learning Path - ${params.id}`,
  }
}

export default async function Page({ params }) {
  const { id } = params

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  const path = await getLearningPath(id)

  if (!path) {
    redirect('/saved-paths')
  }

  if (!process.env.NEXT_PUBLIC_TESTING_MODE && path.user?.email !== session.user?.email) {
    redirect('/saved-paths')
  }

  return (
    <div>
      <h1>Learning Path ID: {id}</h1>
      <LearningSteps steps={path.steps} topic={path.topic} />
    </div>
  )
}

Page.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired
}