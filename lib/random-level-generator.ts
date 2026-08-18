import { Direction, Level, Line, Position } from '@/types/game';

const COLORS = ['#a855f7', '#38bdf8', '#f97316', '#84cc16', '#facc15', '#f472b6', '#2563eb', '#ef4444'];
const VECTORS: Array<{ direction: Direction; x: number; y: number }> = [
  { direction: 'up', x: 0, y: -1 },
  { direction: 'down', x: 0, y: 1 },
  { direction: 'left', x: -1, y: 0 },
  { direction: 'right', x: 1, y: 0 },
];

export function createRandomChallenge(seed = Date.now()): Level {
  const random = mulberry32(seed);

  for (let attempt = 0; attempt < 240; attempt++) {
    const gridSize = 8;
    const targetRoutes = 10 + Math.floor(random() * 4);
    const occupied = new Set<string>();
    const lines: Line[] = [];

    for (let id = 1; id <= targetRoutes; id++) {
      const route = createRoute(gridSize, occupied, random, 3 + Math.floor(random() * 4));
      if (!route) continue;

      route.forEach((point) => occupied.add(key(point)));
      const direction = getRouteDirection(route);
      lines.push({
        id,
        startX: route[0].x,
        startY: route[0].y,
        length: route.length,
        orientation: direction === 'left' || direction === 'right' ? 'horizontal' : 'vertical',
        direction,
        path: compressRoute(route),
        color: COLORS[(id + Math.floor(seed % COLORS.length)) % COLORS.length],
      });
    }

    const solution = findSolution(lines, gridSize);
    const openingMoves = lines.filter((line) => canExit(line, lines, gridSize)).length;

    if (solution && lines.length >= 8 && openingMoves >= 1 && openingMoves <= 3) {
      return {
        levelId: 100000 + (seed % 900000),
        gridSize,
        lines,
        difficulty: 'hard',
        parMoves: lines.length,
        hintsAvailable: 1,
      };
    }
  }

  // This fallback is intentionally sparse but always playable if a device
  // exhausts generation attempts.
  return createFallbackChallenge(seed);
}

function createRoute(
  gridSize: number,
  occupied: Set<string>,
  random: () => number,
  minimumLength: number,
): Position[] | null {
  const available = allCells(gridSize).filter((point) => !occupied.has(key(point)));
  if (available.length === 0) return null;

  const route = [available[Math.floor(random() * available.length)]];
  const desiredLength = minimumLength + Math.floor(random() * 3);

  while (route.length < desiredLength) {
    const current = route.at(-1)!;
    const choices = shuffle(VECTORS, random)
      .map(({ x, y }) => ({ x: current.x + x, y: current.y + y }))
      .filter((point) => isInside(point, gridSize))
      .filter((point) => !occupied.has(key(point)))
      .filter((point) => !route.some((routePoint) => key(routePoint) === key(point)));

    if (choices.length === 0) break;
    route.push(choices[0]);
  }

  return route.length >= minimumLength ? route : null;
}

function compressRoute(route: Position[]): Position[] {
  if (route.length < 3) return route;
  const points = [route[0]];

  for (let index = 1; index < route.length - 1; index++) {
    const previous = route[index - 1];
    const current = route[index];
    const next = route[index + 1];
    const previousVector = { x: current.x - previous.x, y: current.y - previous.y };
    const nextVector = { x: next.x - current.x, y: next.y - current.y };

    if (previousVector.x !== nextVector.x || previousVector.y !== nextVector.y) {
      points.push(current);
    }
  }

  points.push(route.at(-1)!);
  return points;
}

function getRouteDirection(route: Position[]): Direction {
  const end = route.at(-1)!;
  const beforeEnd = route.at(-2)!;
  if (end.x !== beforeEnd.x) return end.x > beforeEnd.x ? 'right' : 'left';
  return end.y > beforeEnd.y ? 'down' : 'up';
}

function findSolution(lines: Line[], gridSize: number): number[] | null {
  if (lines.length === 0) return [];

  for (const line of lines) {
    if (!canExit(line, lines, gridSize)) continue;
    const rest = findSolution(lines.filter((candidate) => candidate.id !== line.id), gridSize);
    if (rest) return [line.id, ...rest];
  }

  return null;
}

function canExit(line: Line, lines: Line[], gridSize: number): boolean {
  const direction = line.direction!;
  const head = line.path!.at(-1)!;
  const vector = VECTORS.find((candidate) => candidate.direction === direction)!;

  for (let x = head.x + vector.x, y = head.y + vector.y; isInside({ x, y }, gridSize); x += vector.x, y += vector.y) {
    if (lines.some((candidate) => candidate.id !== line.id && getRouteCells(candidate).some((point) => point.x === x && point.y === y))) {
      return false;
    }
  }

  return true;
}

function getRouteCells(line: Line): Position[] {
  const cells: Position[] = [];
  const points = line.path!;

  for (let index = 1; index < points.length; index++) {
    const start = points[index - 1];
    const end = points[index];
    const stepX = Math.sign(end.x - start.x);
    const stepY = Math.sign(end.y - start.y);
    const count = Math.max(Math.abs(end.x - start.x), Math.abs(end.y - start.y));

    for (let step = 0; step <= count; step++) {
      const point = { x: start.x + step * stepX, y: start.y + step * stepY };
      if (!cells.some((cell) => cell.x === point.x && cell.y === point.y)) cells.push(point);
    }
  }

  return cells;
}

function createFallbackChallenge(seed: number): Level {
  const lines: Line[] = [
    { id: 1, startX: 0, startY: 1, length: 5, orientation: 'horizontal', direction: 'right', path: [{ x: 0, y: 1 }, { x: 4, y: 1 }], color: COLORS[0] },
    { id: 2, startX: 1, startY: 3, length: 5, orientation: 'horizontal', direction: 'left', path: [{ x: 5, y: 3 }, { x: 1, y: 3 }], color: COLORS[1] },
    { id: 3, startX: 6, startY: 0, length: 4, orientation: 'vertical', direction: 'down', path: [{ x: 6, y: 0 }, { x: 6, y: 3 }], color: COLORS[2] },
    { id: 4, startX: 2, startY: 5, length: 4, orientation: 'horizontal', direction: 'right', path: [{ x: 2, y: 5 }, { x: 5, y: 5 }], color: COLORS[3] },
  ];

  return { levelId: 100000 + (seed % 900000), gridSize: 8, lines, difficulty: 'hard', parMoves: lines.length, hintsAvailable: 1 };
}

function allCells(gridSize: number): Position[] {
  return Array.from({ length: gridSize * gridSize }, (_, index) => ({ x: index % gridSize, y: Math.floor(index / gridSize) }));
}

function isInside(point: Position, gridSize: number): boolean {
  return point.x >= 0 && point.x < gridSize && point.y >= 0 && point.y < gridSize;
}

function key(point: Position): string {
  return `${point.x},${point.y}`;
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const replacement = Math.floor(random() * (index + 1));
    [copy[index], copy[replacement]] = [copy[replacement], copy[index]];
  }
  return copy;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6D2B79F5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}
