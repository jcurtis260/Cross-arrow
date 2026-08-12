import { Line, Direction, Grid, Cell } from '@/types/game';

export function getLineCells(line: Line): Cell[] {
  const cells: Cell[] = [];
  
  if (line.orientation === 'horizontal') {
    for (let i = 0; i < line.length; i++) {
      cells.push({
        x: line.startX + i,
        y: line.startY,
        occupied: true,
        lineId: line.id
      });
    }
  } else {
    for (let i = 0; i < line.length; i++) {
      cells.push({
        x: line.startX,
        y: line.startY + i,
        occupied: true,
        lineId: line.id
      });
    }
  }
  
  return cells;
}

export function canLineSlide(line: Line, direction: Direction, grid: Grid): boolean {
  const lineCells = getLineCells(line);
  
  for (const cell of lineCells) {
    const pathCells = getRayCast(cell, direction, grid.size);
    
    for (const pathCell of pathCells) {
      const gridCell = grid.cells[pathCell.y]?.[pathCell.x];
      
      if (!gridCell) continue;
      
      if (gridCell.occupied && gridCell.lineId !== line.id) {
        return false;
      }
    }
  }
  
  return canLineMoveInDirection(line, direction);
}

function canLineMoveInDirection(line: Line, direction: Direction): boolean {
  if (line.orientation === 'horizontal') {
    return direction === 'up' || direction === 'down';
  } else {
    return direction === 'left' || direction === 'right';
  }
}

function getRayCast(start: Cell, direction: Direction, gridSize: number): Cell[] {
  const cells: Cell[] = [];
  let x = start.x;
  let y = start.y;
  
  switch (direction) {
    case 'up':
      for (let i = y - 1; i >= 0; i--) {
        cells.push({ x, y: i, occupied: false, lineId: null });
      }
      break;
    case 'down':
      for (let i = y + 1; i < gridSize; i++) {
        cells.push({ x, y: i, occupied: false, lineId: null });
      }
      break;
    case 'left':
      for (let i = x - 1; i >= 0; i--) {
        cells.push({ x: i, y, occupied: false, lineId: null });
      }
      break;
    case 'right':
      for (let i = x + 1; i < gridSize; i++) {
        cells.push({ x: i, y, occupied: false, lineId: null });
      }
      break;
  }
  
  return cells;
}

export function getValidDirectionsForLine(line: Line, grid: Grid): Direction[] {
  const validDirections: Direction[] = [];
  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  
  for (const direction of directions) {
    // Check if line can move in this direction (perpendicular to orientation)
    if (!canLineMoveInDirection(line, direction)) {
      continue;
    }
    
    // Check if path is clear
    if (canLineSlide(line, direction, grid)) {
      validDirections.push(direction);
    }
  }
  
  return validDirections;
}
