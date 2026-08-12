export type Orientation = 'horizontal' | 'vertical';
export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameStatus = 'playing' | 'paused' | 'completed' | 'idle';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Position {
  x: number;
  y: number;
}

export interface Line {
  id: number;
  startX: number;
  startY: number;
  length: number;
  orientation: Orientation;
  direction?: Direction;
  path?: Position[];
}

export interface Level {
  levelId: number;
  gridSize: number;
  lines: Line[];
  difficulty: Difficulty;
  parMoves: number;
  hintsAvailable: number;
}

export interface Cell {
  x: number;
  y: number;
  occupied: boolean;
  lineId: number | null;
}

export interface Grid {
  size: number;
  cells: Cell[][];
}

export interface Move {
  lineId: number;
  direction: Direction;
  timestamp: number;
}

export interface GameState {
  currentLevel: Level | null;
  grid: Grid | null;
  lines: Line[];
  moveCount: number;
  timer: number;
  gameStatus: GameStatus;
  moveHistory: Move[];
  hintsRemaining: number;
  completedLevels: number[];
  currentLevelId: number;
}

export interface LevelStats {
  levelId: number;
  moves: number;
  timeSeconds: number;
  stars: number;
  score: number;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  moves: number;
  timeSeconds: number;
  completedAt: Date;
}

export interface Player {
  id: number;
  username: string;
  createdAt: Date;
}

export interface Score {
  id: number;
  playerId: number;
  levelId: number;
  moves: number;
  timeSeconds: number;
  score: number;
  completedAt: Date;
}
