'use client';

import { useState, useEffect } from 'react';
import { markPuzzleSolved } from '@/lib/progress';

const GRID_SIZE = 5;

type Grid = boolean[][];

function createEmptyGrid(): Grid {
  return Array(GRID_SIZE)
    .fill(null)
    .map(() => Array(GRID_SIZE).fill(false));
}

function createPuzzleGrid(): Grid {
  const grid = createEmptyGrid();
  const moves = Math.floor(Math.random() * 8) + 5;
  
  for (let i = 0; i < moves; i++) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const col = Math.floor(Math.random() * GRID_SIZE);
    toggleCell(grid, row, col);
  }
  
  return grid;
}

function toggleCell(grid: Grid, row: number, col: number): void {
  const directions = [
    [0, 0],
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  
  directions.forEach(([dr, dc]) => {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
      grid[newRow][newCol] = !grid[newRow][newCol];
    }
  });
}

function isGridSolved(grid: Grid): boolean {
  return grid.every(row => row.every(cell => !cell));
}

export default function LightsOutPuzzle() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid());
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    setGrid(createPuzzleGrid());
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (solved) return;

    const newGrid = grid.map(r => [...r]);
    toggleCell(newGrid, row, col);
    setGrid(newGrid);
    setMoves(moves + 1);

    if (isGridSolved(newGrid)) {
      setSolved(true);
      markPuzzleSolved('lights-out');
    }
  };

  const handleReset = () => {
    setGrid(createPuzzleGrid());
    setMoves(0);
    setSolved(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Goal:</strong> Turn off all the lights! When you click a light, it toggles along
          with its adjacent neighbors (up, down, left, right). Find the right sequence to turn them
          all off.
        </p>
      </div>

      <div className="flex justify-center items-center">
        <div className="inline-block bg-gray-800 p-4 rounded-xl">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
            {grid.map((row, rowIndex) =>
              row.map((isOn, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg transition-all duration-200 ${
                    isOn
                      ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  disabled={solved}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold">
          Moves: <span className="text-blue-600 dark:text-blue-400">{moves}</span>
        </p>
      </div>

      {solved && (
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
            Lights Out!
          </h3>
          <p className="text-green-800 dark:text-green-200">
            You've turned off all the lights in {moves} moves!
          </p>
          <button
            onClick={handleReset}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            New Puzzle
          </button>
        </div>
      )}
    </div>
  );
}
