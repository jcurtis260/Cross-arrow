'use client';

import React, { useMemo } from 'react';
import { Line } from './Line';
import { ArrowButton } from './ArrowButton';
import { useGameStore } from '@/store/game-store';
import { getValidDirectionsForLine } from '@/lib/collision-detector';
import { AnimatePresence } from 'framer-motion';

interface GridProps {
  cellSize?: number;
}

export function Grid({ cellSize = 60 }: GridProps) {
  const { grid, lines, makeMove } = useGameStore();
  
  const gridSize = grid ? grid.size * cellSize : 0;
  
  const gridLines = useMemo(() => {
    if (!grid) return [];
    
    const lines = [];
    for (let i = 0; i <= grid.size; i++) {
      lines.push(
        <div
          key={`h-${i}`}
          className="absolute bg-gray-300"
          style={{
            left: 0,
            top: i * cellSize,
            width: gridSize,
            height: 1,
          }}
        />,
        <div
          key={`v-${i}`}
          className="absolute bg-gray-300"
          style={{
            left: i * cellSize,
            top: 0,
            width: 1,
            height: gridSize,
          }}
        />
      );
    }
    return lines;
  }, [grid, cellSize, gridSize]);
  
  if (!grid) return null;
  
  return (
    <div className="relative flex items-center justify-center">
      <div
        className="relative bg-white rounded-lg shadow-lg"
        style={{
          width: gridSize,
          height: gridSize,
        }}
      >
        {gridLines}
        
        <AnimatePresence>
          {lines.map((line) => (
            <Line
              key={line.id}
              line={line}
              cellSize={cellSize}
              gridSize={grid.size}
            />
          ))}
        </AnimatePresence>
        
        {lines.map((line) => {
          const validDirections = getValidDirectionsForLine(line, grid);
          
          return validDirections.map((direction) => {
            let posX = line.startX * cellSize;
            let posY = line.startY * cellSize;
            
            if (line.orientation === 'horizontal') {
              posX += (line.length * cellSize) / 2 - cellSize / 2;
            } else {
              posY += (line.length * cellSize) / 2 - cellSize / 2;
            }
            
            return (
              <ArrowButton
                key={`${line.id}-${direction}`}
                direction={direction}
                onClick={() => makeMove(line.id, direction)}
                cellSize={cellSize}
                position={{ x: posX, y: posY }}
              />
            );
          });
        })}
      </div>
    </div>
  );
}
