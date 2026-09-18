'use client';

const STORAGE_KEY = 'puzzle-progress';

export interface PuzzleProgress {
  [puzzleId: string]: {
    solved: boolean;
    solvedAt?: string;
  };
}

export function getProgress(): PuzzleProgress {
  if (typeof window === 'undefined') return {};
  
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

export function markPuzzleSolved(puzzleId: string): void {
  if (typeof window === 'undefined') return;
  
  const progress = getProgress();
  progress[puzzleId] = {
    solved: true,
    solvedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function isPuzzleSolved(puzzleId: string): boolean {
  const progress = getProgress();
  return progress[puzzleId]?.solved || false;
}

export function getSolvedCount(): number {
  const progress = getProgress();
  return Object.values(progress).filter(p => p.solved).length;
}
