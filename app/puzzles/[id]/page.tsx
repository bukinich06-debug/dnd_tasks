import Link from 'next/link';
import { getPuzzleById } from '@/lib/puzzles';
import ColorSequencePuzzle from '@/components/puzzles/ColorSequencePuzzle';
import NumberPairsPuzzle from '@/components/puzzles/NumberPairsPuzzle';
import LightsOutPuzzle from '@/components/puzzles/LightsOutPuzzle';
import { notFound } from 'next/navigation';

const puzzleComponents = {
  'color-sequence': ColorSequencePuzzle,
  'number-pairs': NumberPairsPuzzle,
  'lights-out': LightsOutPuzzle,
};

export function generateStaticParams() {
  return [
    { id: 'color-sequence' },
    { id: 'number-pairs' },
    { id: 'lights-out' },
  ];
}

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const puzzle = getPuzzleById(id);

  if (!puzzle) {
    notFound();
  }

  const PuzzleComponent = puzzleComponents[id as keyof typeof puzzleComponents];

  if (!PuzzleComponent) {
    notFound();
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            ← Back to Puzzles
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {puzzle.title}
              </h1>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold uppercase ${
                  difficultyColors[puzzle.difficulty]
                }`}
              >
                {puzzle.difficulty}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {puzzle.description}
            </p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <PuzzleComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
