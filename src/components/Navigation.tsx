'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

export default function Navigation() {
  const { data: session } = useSession();

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

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/saved-paths"
                  className="text-purple-200 hover:text-purple-300 transition-colors flex items-center gap-2"
                >
                  <span>📚</span>
                  Saved Paths
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-purple-200 hover:text-purple-300 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-purple-200 hover:text-purple-300 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 