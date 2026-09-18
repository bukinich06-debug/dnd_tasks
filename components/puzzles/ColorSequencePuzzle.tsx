'use client';

import { useState, useEffect } from 'react';
import { markPuzzleSolved } from '@/lib/progress';

const COLORS = [
  { id: 'red', name: 'Red', color: 'bg-red-500' },
  { id: 'orange', name: 'Orange', color: 'bg-orange-500' },
  { id: 'yellow', name: 'Yellow', color: 'bg-yellow-400' },
  { id: 'green', name: 'Green', color: 'bg-green-500' },
  { id: 'blue', name: 'Blue', color: 'bg-blue-500' },
  { id: 'indigo', name: 'Indigo', color: 'bg-indigo-600' },
  { id: 'violet', name: 'Violet', color: 'bg-violet-500' },
];

const CORRECT_ORDER = COLORS.map(c => c.id);

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function ColorSequencePuzzle() {
  const [items, setItems] = useState(COLORS);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setItems(shuffleArray(COLORS));
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null) return;

    const newItems = [...items];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(dropIndex, 0, draggedItem);

    setItems(newItems);
    setDraggedIndex(null);

    const currentOrder = newItems.map(item => item.id);
    if (JSON.stringify(currentOrder) === JSON.stringify(CORRECT_ORDER)) {
      setSolved(true);
      markPuzzleSolved('color-sequence');
    }
  };

  const handleReset = () => {
    setItems(shuffleArray(COLORS));
    setSolved(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Goal:</strong> Drag and drop the color blocks to arrange them in rainbow order
          (Red → Orange → Yellow → Green → Blue → Indigo → Violet).
        </p>
      </div>

      <div className="space-y-3">
        {items.map((color, index) => (
          <div
            key={color.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
            className={`${color.color} p-6 rounded-lg text-white font-semibold text-center cursor-move transition-all hover:scale-105 hover:shadow-lg ${
              draggedIndex === index ? 'opacity-50' : ''
            }`}
          >
            {color.name}
          </div>
        ))}
      </div>

      {solved && (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
            Congratulations!
          </h3>
          <p className="text-green-800 dark:text-green-200">
            You've arranged the colors in the correct rainbow order!
          </p>
          <button
            onClick={handleReset}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
