'use client';

import { useState, useEffect } from 'react';
import { markPuzzleSolved } from '@/lib/progress';

const PAIRS = [
  { number: 1, word: 'One' },
  { number: 2, word: 'Two' },
  { number: 3, word: 'Three' },
  { number: 4, word: 'Four' },
  { number: 5, word: 'Five' },
  { number: 6, word: 'Six' },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function NumberPairsPuzzle() {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [words, setWords] = useState<string[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [matches, setMatches] = useState<Set<number>>(new Set());
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setNumbers(shuffleArray(PAIRS.map(p => p.number)));
    setWords(shuffleArray(PAIRS.map(p => p.word)));
  }, []);

  const handleNumberClick = (num: number) => {
    if (matches.has(num)) return;
    setSelectedNumber(num);
    checkMatch(num, selectedWord);
  };

  const handleWordClick = (word: string) => {
    const num = PAIRS.find(p => p.word === word)?.number;
    if (num && matches.has(num)) return;
    setSelectedWord(word);
    checkMatch(selectedNumber, word);
  };

  const checkMatch = (num: number | null, word: string | null) => {
    if (num === null || word === null) return;

    const pair = PAIRS.find(p => p.number === num && p.word === word);
    if (pair) {
      const newMatches = new Set(matches).add(num);
      setMatches(newMatches);
      setSelectedNumber(null);
      setSelectedWord(null);

      if (newMatches.size === PAIRS.length) {
        setSolved(true);
        markPuzzleSolved('number-pairs');
      }
    } else {
      setTimeout(() => {
        setSelectedNumber(null);
        setSelectedWord(null);
      }, 500);
    }
  };

  const handleReset = () => {
    setNumbers(shuffleArray(PAIRS.map(p => p.number)));
    setWords(shuffleArray(PAIRS.map(p => p.word)));
    setMatches(new Set());
    setSelectedNumber(null);
    setSelectedWord(null);
    setSolved(false);
  };

  const isNumberMatched = (num: number) => matches.has(num);
  const isWordMatched = (word: string) => {
    const num = PAIRS.find(p => p.word === word)?.number;
    return num ? matches.has(num) : false;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Goal:</strong> Click a number and then its matching word to create pairs.
          Match all six pairs to complete the puzzle!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-center">Numbers</h3>
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              disabled={isNumberMatched(num)}
              className={`w-full p-4 rounded-lg font-bold text-xl transition-all ${
                isNumberMatched(num)
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : selectedNumber === num
                  ? 'bg-blue-500 text-white scale-105 shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-lg text-center">Words</h3>
          {words.map((word) => (
            <button
              key={word}
              onClick={() => handleWordClick(word)}
              disabled={isWordMatched(word)}
              className={`w-full p-4 rounded-lg font-bold text-xl transition-all ${
                isWordMatched(word)
                  ? 'bg-green-500 text-white cursor-not-allowed'
                  : selectedWord === word
                  ? 'bg-blue-500 text-white scale-105 shadow-lg'
                  : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {word}
            </button>
          ))}
        </div>
      </div>

      {solved && (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
            Perfect Match!
          </h3>
          <p className="text-green-800 dark:text-green-200">
            You've successfully matched all the number pairs!
          </p>
          <button
            onClick={handleReset}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}
