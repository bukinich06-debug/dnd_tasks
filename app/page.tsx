'use client';

import Link from 'next/link';
import { puzzles } from '@/lib/puzzles';
import { useEffect, useState } from 'react';
import { getProgress, getSolvedCount } from '@/lib/progress';

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const typeIcons = {
  sequence: '🔢',
  pattern: '🧩',
  logic: '💡',
};

export default function Home() {
  const [solvedCount, setSolvedCount] = useState(0);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const count = getSolvedCount();
    setSolvedCount(count);
    
    const progressData = getProgress();
    const solvedMap: Record<string, boolean> = {};
    Object.keys(progressData).forEach(id => {
      solvedMap[id] = progressData[id].solved;
    });
    setProgress(solvedMap);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Puzzle Arena
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Challenge your mind with interactive puzzles
          </p>
          {solvedCount > 0 && (
            <div className="mt-4 inline-block bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-md">
              <p className="text-lg">
                <span className="font-bold text-blue-600 dark:text-blue-400">{solvedCount}</span>
                {' / '}
                <span className="text-gray-600 dark:text-gray-400">{puzzles.length}</span>
                {' '}
                <span className="text-gray-700 dark:text-gray-300">puzzles solved</span>
              </p>
            </div>
          )}
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {puzzles.map((puzzle) => (
            <Link
              key={puzzle.id}
              href={`/puzzles/${puzzle.id}`}
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{typeIcons[puzzle.type]}</span>
                  {progress[puzzle.id] && (
                    <span className="text-2xl" title="Solved!">
                      ✓
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {puzzle.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {puzzle.description}
                </p>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      difficultyColors[puzzle.difficulty]
                    }`}
                  >
                    {puzzle.difficulty}
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                    Play →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-600 dark:text-gray-400">
          <p>More puzzles coming soon! Check back for new challenges.</p>
        </footer>
      </div>
    </div>
  );
}
