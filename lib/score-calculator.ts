export function calculateScore(moves: number, timeSeconds: number): number {
  return moves * 10 + timeSeconds;
}

export function calculateStars(moves: number, parMoves: number): number {
  if (moves <= parMoves) return 3;
  if (moves <= parMoves + 2) return 2;
  return 1;
}

export function validateScore(moves: number, timeSeconds: number, gridSize: number): boolean {
  if (moves < 1) return false;
  if (timeSeconds < 1) return false;
  if (moves > gridSize * 20) return false;
  if (timeSeconds > 3600) return false;
  
  return true;
}
