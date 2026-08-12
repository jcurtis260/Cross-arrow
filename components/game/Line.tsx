'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Line as LineType, Direction } from '@/types/game';
import { getLineDirection } from '@/lib/collision-detector';

interface LineProps {
  line: LineType;
  cellSize: number;
  gridSize: number;
  validDirections: Direction[];
  onClick: () => void;
}

export function Line({ line, cellSize, gridSize, validDirections, onClick }: LineProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const direction = getLineDirection(line);
  const canLeave = validDirections.length > 0;
  const lengthPx = line.length * cellSize;
  const x = line.startX * cellSize;
  const y = line.startY * cellSize;
  const isHorizontal = line.orientation === 'horizontal';
  const canvasWidth = isHorizontal ? lengthPx : cellSize;
  const canvasHeight = isHorizontal ? cellSize : lengthPx;
  const boardDistance = gridSize * cellSize + lengthPx + cellSize;

  const exitOffset = direction === 'left'
    ? { x: -boardDistance, y: 0 }
    : direction === 'right'
      ? { x: boardDistance, y: 0 }
      : direction === 'up'
        ? { x: 0, y: -boardDistance }
        : { x: 0, y: boardDistance };

  const arrow = isHorizontal
    ? direction === 'right'
      ? `${canvasWidth - 1},${cellSize / 2} ${canvasWidth - 12},${cellSize / 2 - 7} ${canvasWidth - 12},${cellSize / 2 + 7}`
      : `1,${cellSize / 2} 12,${cellSize / 2 - 7} 12,${cellSize / 2 + 7}`
    : direction === 'down'
      ? `${cellSize / 2},${canvasHeight - 1} ${cellSize / 2 - 7},${canvasHeight - 12} ${cellSize / 2 + 7},${canvasHeight - 12}`
      : `${cellSize / 2},1 ${cellSize / 2 - 7},12 ${cellSize / 2 + 7},12`;

  const lineStart = isHorizontal
    ? { x1: direction === 'right' ? 0 : 10, y1: cellSize / 2, x2: direction === 'right' ? canvasWidth - 9 : canvasWidth, y2: cellSize / 2 }
    : { x1: cellSize / 2, y1: direction === 'down' ? 0 : 10, x2: cellSize / 2, y2: direction === 'down' ? canvasHeight - 9 : canvasHeight };

  return (
    <motion.button
      type="button"
      aria-label={`Arrow pointing ${direction}`}
      disabled={!canLeave || isLeaving}
      initial={{ opacity: 0 }}
      animate={isLeaving ? { ...exitOffset, opacity: 0 } : { x: 0, y: 0, opacity: canLeave ? 1 : 0.35 }}
      transition={isLeaving ? { duration: 0.48, ease: 'easeIn' } : { duration: 0.15 }}
      onClick={() => canLeave && setIsLeaving(true)}
      onAnimationComplete={() => {
        if (isLeaving) onClick();
      }}
      className={`absolute z-10 touch-manipulation bg-transparent p-0 ${canLeave ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      style={{ left: x, top: y, width: canvasWidth, height: canvasHeight }}
    >
      <svg width={canvasWidth} height={canvasHeight} className="overflow-visible" aria-hidden="true">
        <line {...lineStart} stroke="black" strokeWidth="4" strokeLinecap="square" />
        <polygon points={arrow} fill="black" />
      </svg>
    </motion.button>
  );
}
