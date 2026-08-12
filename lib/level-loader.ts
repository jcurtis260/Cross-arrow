import { Level } from '@/types/game';
import easyLevelsData from '@/data/levels/easy.json';
import mediumLevelsData from '@/data/levels/medium.json';
import hardLevelsData from '@/data/levels/hard.json';

const easyLevels: Level[] = easyLevelsData as Level[];
const mediumLevels: Level[] = mediumLevelsData as Level[];
const hardLevels: Level[] = hardLevelsData as Level[];

export function loadLevel(levelId: number): Level | null {
  const allLevels = getAllLevels();
  return allLevels.find(l => l.levelId === levelId) || null;
}

export function getAllLevels(): Level[] {
  return [...easyLevels, ...mediumLevels, ...hardLevels];
}

export function getLevelsByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Level[] {
  switch (difficulty) {
    case 'easy':
      return easyLevels;
    case 'medium':
      return mediumLevels;
    case 'hard':
      return hardLevels;
    default:
      return [];
  }
}
