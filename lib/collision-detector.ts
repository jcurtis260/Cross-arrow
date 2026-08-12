import { Line, Direction, Grid, Cell } from '@/types/game';

export function getLineCells(line: Line): Cell[] {
  if (line.path && line.path.length > 0) {
    return getPathCells(line);
  }

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

function getPathCells(line: Line): Cell[] {
  const occupied = new Map<string, Cell>();
  const points = line.path ?? [];

  for (let index = 0; index < points.length - 1; index++) {
    const start = points[index];
    const end = points[index + 1];

    if (start.x !== end.x && start.y !== end.y) {
      throw new Error(`Arrow ${line.id} contains a diagonal path segment.`);
    }

    const stepX = Math.sign(end.x - start.x);
    const stepY = Math.sign(end.y - start.y);
    const length = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));

    for (let step = 0; step <= length; step++) {
      const x = start.x + step * stepX;
      const y = start.y + step * stepY;
      occupied.set(`${x},${y}`, { x, y, occupied: true, lineId: line.id });
    }
  }

  return [...occupied.values()];
}

export function getLineDirection(line: Line): Direction {
  if (line.direction) return line.direction;

  // Existing level data predates directional arrows. This gives those levels
  // deterministic directions while allowing every authored line to override it.
  if (line.orientation === 'horizontal') {
    return line.id % 2 === 0 ? 'left' : 'right';
  }

  return line.id % 2 === 0 ? 'up' : 'down';
}

export function canLineSlide(line: Line, direction: Direction, grid: Grid): boolean {
  if (direction !== getLineDirection(line)) return false;

  const cells = getLineCells(line);
  const leadingCell = getLeadingCell(cells, direction);

  for (const pathCell of getForwardPath(leadingCell, direction, grid.size)) {
    const gridCell = grid.cells[pathCell.y]?.[pathCell.x];
    if (gridCell?.occupied && gridCell.lineId !== line.id) return false;
  }

  return true;
}

function getLeadingCell(cells: Cell[], direction: Direction): Cell {
  return cells.reduce((leading, cell) => {
    if (direction === 'right') return cell.x > leading.x ? cell : leading;
    if (direction === 'left') return cell.x < leading.x ? cell : leading;
    if (direction === 'down') return cell.y > leading.y ? cell : leading;
    return cell.y < leading.y ? cell : leading;
  });
}

function getForwardPath(start: Cell, direction: Direction, gridSize: number): Cell[] {
  const cells: Cell[] = [];

  if (direction === 'up') {
    for (let y = start.y - 1; y >= 0; y--) cells.push({ x: start.x, y, occupied: false, lineId: null });
  } else if (direction === 'down') {
    for (let y = start.y + 1; y < gridSize; y++) cells.push({ x: start.x, y, occupied: false, lineId: null });
  } else if (direction === 'left') {
    for (let x = start.x - 1; x >= 0; x--) cells.push({ x, y: start.y, occupied: false, lineId: null });
  } else {
    for (let x = start.x + 1; x < gridSize; x++) cells.push({ x, y: start.y, occupied: false, lineId: null });
  }

  return cells;
}

export function getValidDirectionsForLine(line: Line, grid: Grid): Direction[] {
  const direction = getLineDirection(line);
  return canLineSlide(line, direction, grid) ? [direction] : [];
}
