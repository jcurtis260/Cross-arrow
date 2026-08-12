'use client';

import React from 'react';
import { Line } from './Line';
import { useGameStore } from '@/store/game-store';
import { getValidDirectionsForLine } from '@/lib/collision-detector';
import { AnimatePresence } from 'framer-motion';

interface GridProps {
  cellSize?: number;
}

export function Grid({ cellSize = 60 }: GridProps) {
  const { grid, lines, makeMove } = useGameStore();
  
  const gridSize = grid ? grid.size * cellSize : 0;
  
  if (!grid) return null;
  
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="relative overflow-hidden bg-white"
        style={{
          width: gridSize,
          height: gridSize,
        }}
      >
        <AnimatePresence>
          {lines.map((line) => {
            const validDirections = getValidDirectionsForLine(line, grid);
            
            // Get the first valid direction (or empty if none)
            const primaryDirection = validDirections[0];
            
            return (
              <Line
                key={line.id}
                line={line}
                cellSize={cellSize}
                gridSize={grid.size}
                validDirections={validDirections}
                onClick={() => {
                  if (primaryDirection) {
                    makeMove(line.id, primaryDirection);
                  }
                }}
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
