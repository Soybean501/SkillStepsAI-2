'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import styles from '@/styles/animations.module.css';

interface StepData {
  id: number;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  content?: string;
  keyPoints?: string[];
  practiceExercises?: string;
  resources?: Array<{
    title: string;
    description: string;
    url: string;
  }>;
}

interface LearningPath {
  topic: string;
  content: string;
}

export default function LearnStep() {
  const params = useParams();
  const [step, setStep] = useState<StepData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);

  useEffect(() => {
    const storedPath = localStorage.getItem('currentLearningPath');
    if (storedPath) {
      try {
        const parsedPath = JSON.parse(storedPath);
        setLearningPath(parsedPath);
      } catch {
        setError('Invalid learning path data');
      }
    } else {
      setError('No learning path found. Please start from the home page.');
    }
  }, []);

  useEffect(() => {
    const fetchStepData = async () => {
      if (!learningPath) return;

      try {
        setLoading(true);
        const response = await fetch('/api/ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'generateStepContent',
            topic: learningPath.topic,
            stepId: parseInt(params.id as string),
          }),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch step data: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const newStep = {
          id: parseInt(params.id as string),
          title: `Step ${params.id}`,
          description: 'Loading content...',
          difficulty: 'Beginner' as const,
          estimatedTime: '1 hour',
          content: data.content,
          keyPoints: data.keyPoints || [],
          practiceExercises: data.practiceExercises,
          resources: data.resources || [],
        };

        setStep(newStep);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (learningPath) {
      fetchStepData();
    }
  }, [params.id, learningPath]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-purple-100 text-lg">Loading magical content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Oops! Something went wrong</h1>
          <p className="text-purple-100">{error}</p>
          <Link 
            href="/" 
            className="mt-6 inline-block px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!step) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Step Not Found</h1>
          <p className="text-purple-100">This magical step seems to have vanished!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-purple-900">
      <div className="absolute inset-0 bg-[url('/stars.svg')] opacity-20"></div>
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-16 relative">
        <div className="text-center mb-12 ${styles.animateFadeIn}">
          <div className="relative inline-block">
            <Image 
              src="/wizard.svg" 
              alt="Wizard" 
              width={96} 
              height={96} 
              className={styles.animateFloat} 
            />
            <div className="absolute -top-4 -right-4">
              <span className="text-4xl">✨</span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mt-6 mb-4">
            {learningPath?.topic}
          </h1>
          <h2 className="text-2xl font-semibold text-purple-200 mb-4">
            {step.title}
          </h2>
          <div className="flex items-center justify-center gap-4 text-lg">
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
        <div className="space-y-8">
          <section className="relative bg-purple-900/40 backdrop-blur-lg rounded-xl p-8 border-2 border-purple-400/30 shadow-lg ${styles.animateFadeInDelayed} group hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 rounded-xl -z-10"></div>
            <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400">Content</h3>
            <div className="prose prose-invert max-w-none">
              <div className="text-purple-100 text-lg leading-relaxed whitespace-pre-wrap">
                {step.content}
              </div>
            </div>
          </section>
          {step.keyPoints && step.keyPoints.length > 0 && (
            <section className="relative bg-purple-900/40 backdrop-blur-lg rounded-xl p-8 border-2 border-purple-400/30 shadow-lg ${styles.animateFadeInDelayed} group hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-transparent to-purple-600/20 rounded-xl -z-10"></div>
              <h3 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400">Key Points</h3>
              <ul className="space-y-4">
                {step.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-4 text-purple-100 text-lg group-hover:text-purple-200 transition-colors">
                    <span className="text-purple-400 mt-1 text-2xl">•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {step.practiceExercises && (
            <section className="bg-purple-900/70 backdrop-blur-sm rounded-xl p-8 border-2 border-purple-400 shadow-lg ${styles.animateFadeInDelayed}">
              <h3 className="text-2xl font-bold text-white mb-4">Practice Exercises</h3>
              <div className="prose prose-invert max-w-none">
                <div className="text-purple-100 text-lg leading-relaxed whitespace-pre-wrap">
                  {step.practiceExercises}
                </div>
              </div>
            </section>
          )}
          {step.resources && step.resources.length > 0 && (
            <section className="bg-purple-900/70 backdrop-blur-sm rounded-xl p-8 border-2 border-purple-400 shadow-lg ${styles.animateFadeInDelayed}">
              <h3 className="text-2xl font-bold text-white mb-4">Additional Resources</h3>
              <div className="space-y-4">
                {step.resources.map((resource, index) => (
                  <div key={index} className="bg-purple-800/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">{resource.title}</h4>
                    <p className="text-purple-200 mb-3">{resource.description}</p>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 inline-flex items-center gap-2"
                    >
                      Visit Resource <span>→</span>
                    </a>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}