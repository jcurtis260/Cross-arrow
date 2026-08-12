import { Level, Grid, Cell, Line, Direction, GameState } from '@/types/game';
import { getLineCells } from './collision-detector';

export function createGrid(size: number): Grid {
  const cells: Cell[][] = [];
  
  for (let y = 0; y < size; y++) {
    const row: Cell[] = [];
    for (let x = 0; x < size; x++) {
      row.push({
        x,
        y,
        occupied: false,
        lineId: null
      });
    }
    cells.push(row);
  }
  
  return {
    size,
    cells
  };
}

export function initializeLevel(level: Level): { grid: Grid; lines: Line[] } {
  const grid = createGrid(level.gridSize);
  const lines = [...level.lines];
  
  for (const line of lines) {
    const lineCells = getLineCells(line);
    for (const cell of lineCells) {
      if (grid.cells[cell.y] && grid.cells[cell.y][cell.x]) {
        grid.cells[cell.y][cell.x].occupied = true;
        grid.cells[cell.y][cell.x].lineId = line.id;
      }
    }
  }
  
  return { grid, lines };
}

export function moveLineInDirection(
  lineId: number,
  direction: Direction,
  grid: Grid,
  lines: Line[]
): { grid: Grid; lines: Line[]; lineRemoved: boolean } {
  const line = lines.find(l => l.id === lineId);
  
  if (!line) {
    return { grid, lines, lineRemoved: false };
  }
  
  const lineCells = getLineCells(line);
  for (const cell of lineCells) {
    if (grid.cells[cell.y] && grid.cells[cell.y][cell.x]) {
      grid.cells[cell.y][cell.x].occupied = false;
      grid.cells[cell.y][cell.x].lineId = null;
    }
  }

  // A valid tap sends the complete arrow out of the board in one motion.
  // The renderer owns the exit animation; the game state removes it afterward.
  return {
    grid,
    lines: lines.filter(l => l.id !== lineId),
    lineRemoved: true
  };
}

export function checkWinCondition(lines: Line[]): boolean {
  return lines.length === 0;
}

export function calculateScore(moves: number, timeSeconds: number): number {
  return moves * 10 + timeSeconds;
}

export function calculateStars(moves: number, parMoves: number): number {
  if (moves <= parMoves) return 3;
  if (moves <= parMoves + 2) return 2;
  return 1;
}

export function getCompletedLevels(): number[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem('completedLevels');
  return stored ? JSON.parse(stored) : [];
}

export function saveCompletedLevel(levelId: number): void {
  if (typeof window === 'undefined') return;
  
  const completed = getCompletedLevels();
  if (!completed.includes(levelId)) {
    completed.push(levelId);
    localStorage.setItem('completedLevels', JSON.stringify(completed));
  }
}

export function getUsername(): string | null {
  if (typeof window === 'undefined') return null;
  
  return localStorage.getItem('username');
}

export function saveUsername(username: string): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('username', username);
}
