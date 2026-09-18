export type PuzzleDifficulty = 'easy' | 'medium' | 'hard';

export interface Puzzle {
  id: string;
  title: string;
  description: string;
  difficulty: PuzzleDifficulty;
  type: 'sequence' | 'pattern' | 'logic' | 'adventure';
}

export const puzzles: Puzzle[] = [
  {
    id: 'secret-door',
    title: 'Тайная дверь',
    description: 'Найдите правильную последовательность рун, чтобы открыть секретный проход в пещере.',
    difficulty: 'medium',
    type: 'adventure',
  },
  {
    id: 'color-sequence',
    title: 'Цветовая последовательность',
    description: 'Расположите цвета в правильном порядке радуги от красного до фиолетового.',
    difficulty: 'easy',
    type: 'sequence',
  },
  {
    id: 'number-pairs',
    title: 'Числовые пары',
    description: 'Сопоставьте числа с соответствующими словами.',
    difficulty: 'medium',
    type: 'pattern',
  },
  {
    id: 'lights-out',
    title: 'Огни',
    description: 'Выключите все огни, стратегически переключая их.',
    difficulty: 'hard',
    type: 'logic',
  },
];

export function getPuzzleById(id: string): Puzzle | undefined {
  return puzzles.find(p => p.id === id);
}
