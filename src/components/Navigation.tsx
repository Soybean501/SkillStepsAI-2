'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-purple-900/50 backdrop-blur-md border-b border-purple-400 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-purple-200 hover:text-purple-300 transition-colors flex items-center gap-2">
                <span className="text-3xl">✨</span>
                SkillStepsAI
                <span className="text-3xl">✨</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center">
            {status === 'loading' ? (
              <div className="text-purple-200">Loading...</div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <span className="text-purple-200">
                  Welcome, {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="inline-flex items-center px-4 py-2 border border-purple-400 text-sm font-medium rounded-md text-purple-200 bg-purple-700/50 hover:bg-purple-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 border border-purple-400 text-sm font-medium rounded-md text-purple-200 bg-purple-700/50 hover:bg-purple-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center px-4 py-2 border border-purple-400 text-sm font-medium rounded-md text-purple-200 bg-purple-700/50 hover:bg-purple-600/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 