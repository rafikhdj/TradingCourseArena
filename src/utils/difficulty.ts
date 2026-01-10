import { Difficulty } from '../types';

export const difficultyLevels: Record<Difficulty, { label: string; multiplier: number; min: number; max: number }> = {
  easy: { label: 'Easy', multiplier: 1, min: 1, max: 2 },
  medium: { label: 'Medium', multiplier: 2, min: 2, max: 4 },
  hard: { label: 'Hard', multiplier: 3, min: 4, max: 5 },
};

export const getDifficultyFromNumber = (num: number): Difficulty => {
  if (num <= 2) return 'easy';
  if (num <= 4) return 'medium';
  return 'hard';
};

