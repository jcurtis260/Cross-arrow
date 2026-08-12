import { create } from 'zustand';
import { GameState, Level, Direction, Move, LevelStats } from '@/types/game';
import { initializeLevel, moveLineInDirection, checkWinCondition, getCompletedLevels, saveCompletedLevel } from '@/lib/game-engine';
import { canLineSlide } from '@/lib/collision-detector';
import { calculateScore, calculateStars } from '@/lib/score-calculator';

interface GameStore extends GameState {
  startLevel: (level: Level) => void;
  makeMove: (lineId: number, direction: Direction) => boolean;
  undoMove: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  completeLevel: () => LevelStats | null;
  resetLevel: () => void;
  incrementTimer: () => void;
  useHint: () => void;
  loadProgress: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentLevel: null,
  grid: null,
  lines: [],
  moveCount: 0,
  timer: 0,
  gameStatus: 'idle',
  moveHistory: [],
  hintsRemaining: 3,
  completedLevels: [],
  currentLevelId: 0,

  startLevel: (level: Level) => {
    const { grid, lines } = initializeLevel(level);
    set({
      currentLevel: level,
      grid,
      lines,
      moveCount: 0,
      timer: 0,
      gameStatus: 'playing',
      moveHistory: [],
      hintsRemaining: level.hintsAvailable,
      currentLevelId: level.levelId,
    });
  },

  makeMove: (lineId: number, direction: Direction) => {
    const state = get();
    
    if (state.gameStatus !== 'playing' || !state.grid) {
      return false;
    }

    const line = state.lines.find(l => l.id === lineId);
    if (!line) return false;

    if (!canLineSlide(line, direction, state.grid)) {
      return false;
    }

    const { grid: newGrid, lines: newLines, lineRemoved } = moveLineInDirection(
      lineId,
      direction,
      state.grid,
      state.lines
    );

    const move: Move = {
      lineId,
      direction,
      timestamp: Date.now()
    };

    set({
      grid: newGrid,
      lines: newLines,
      moveCount: state.moveCount + 1,
      moveHistory: [...state.moveHistory, move],
    });

    if (checkWinCondition(newLines)) {
      set({ gameStatus: 'completed' });
    }

    return true;
  },

  undoMove: () => {
    const state = get();
    
    if (state.moveHistory.length === 0 || !state.currentLevel) {
      return;
    }

    const { grid, lines } = initializeLevel(state.currentLevel);
    const newMoveHistory = state.moveHistory.slice(0, -1);

    let currentGrid = grid;
    let currentLines = lines;

    for (const move of newMoveHistory) {
      const result = moveLineInDirection(move.lineId, move.direction, currentGrid, currentLines);
      currentGrid = result.grid;
      currentLines = result.lines;
    }

    set({
      grid: currentGrid,
      lines: currentLines,
      moveCount: newMoveHistory.length,
      moveHistory: newMoveHistory,
      gameStatus: 'playing',
    });
  },

  pauseGame: () => {
    set({ gameStatus: 'paused' });
  },

  resumeGame: () => {
    set({ gameStatus: 'playing' });
  },

  completeLevel: () => {
    const state = get();
    
    if (!state.currentLevel) return null;

    const stats: LevelStats = {
      levelId: state.currentLevel.levelId,
      moves: state.moveCount,
      timeSeconds: state.timer,
      stars: calculateStars(state.moveCount, state.currentLevel.parMoves),
      score: calculateScore(state.moveCount, state.timer),
    };

    saveCompletedLevel(state.currentLevel.levelId);

    return stats;
  },

  resetLevel: () => {
    const state = get();
    
    if (state.currentLevel) {
      const { grid, lines } = initializeLevel(state.currentLevel);
      set({
        grid,
        lines,
        moveCount: 0,
        timer: 0,
        gameStatus: 'playing',
        moveHistory: [],
        hintsRemaining: state.currentLevel.hintsAvailable,
      });
    }
  },

  incrementTimer: () => {
    const state = get();
    if (state.gameStatus === 'playing') {
      set({ timer: state.timer + 1 });
    }
  },

  useHint: () => {
    const state = get();
    if (state.hintsRemaining > 0) {
      set({ hintsRemaining: state.hintsRemaining - 1 });
    }
  },

  loadProgress: () => {
    const completedLevels = getCompletedLevels();
    set({ completedLevels });
  },
}));
