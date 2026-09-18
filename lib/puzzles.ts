export type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  difficulty: PuzzleDifficulty;
  type: 'sequence' | 'pattern' | 'logic';
}

export const puzzles: Puzzle[] = [
  {
    id: 'color-sequence',
    title: 'Color Sequence',
    description: 'Arrange the colors in rainbow order from red to violet.',
    difficulty: 'easy',
    type: 'sequence',
  },
  {
    id: 'number-pairs',
    title: 'Number Pairs',
    description: 'Match numbers with their corresponding words.',
    difficulty: 'medium',
    type: 'pattern',
  },
  {
    id: 'lights-out',
    title: 'Lights Out',
    description: 'Turn all lights off by toggling them strategically.',
    difficulty: 'hard',
    type: 'logic',
  },
];

export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find(p => p.id === id);
}
