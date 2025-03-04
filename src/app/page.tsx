export default function Home() {
  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to SkillSteps AI
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your personalized learning journey begins here. We&apos;re currently working on bringing you the full experience.
        </p>
        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-4">Coming Soon</h2>
            <ul className="space-y-3 text-gray-300">
              <li>• Personalized Learning Paths</li>
              <li>• AI-Powered Content Generation</li>
              <li>• Interactive Practice Exercises</li>
              <li>• Progress Tracking</li>
            </ul>
          </div>
          <div className="text-center">
            <p className="text-gray-400">
              Stay tuned for updates as we develop more features!
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
