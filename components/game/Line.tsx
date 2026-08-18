'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
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
  const [pathLength, setPathLength] = useState(0);
  const pathRef = useRef<SVGPathElement>(null);
  const direction = getLineDirection(line);
  const canLeave = validDirections.length > 0;
  const boardSize = gridSize * cellSize;
  const boardDistance = boardSize + cellSize * 2;
  const pathPoints = line.path?.length
    ? line.path
    : line.orientation === 'horizontal'
      ? [
          { x: line.startX, y: line.startY },
          { x: line.startX + line.length - 1, y: line.startY },
        ]
      : [
          { x: line.startX, y: line.startY },
          { x: line.startX, y: line.startY + line.length - 1 },
        ];

  const svgPoints = pathPoints.map((point) => ({
    x: point.x * cellSize + cellSize / 2,
    y: point.y * cellSize + cellSize / 2,
  }));
  const pathData = svgPoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
  const arrowTip = svgPoints.at(-1)!;
  const arrow = getArrowHead(arrowTip.x, arrowTip.y, direction);

  const exitOffset = direction === 'left'
    ? { x: -boardDistance, y: 0 }
    : direction === 'right'
      ? { x: boardDistance, y: 0 }
      : direction === 'up'
        ? { x: 0, y: -boardDistance }
        : { x: 0, y: boardDistance };

  useLayoutEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pathData]);

  return (
    <motion.svg
      aria-label={`Arrow pointing ${direction}`}
      role="button"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 z-10 overflow-visible"
      style={{ width: boardSize, height: boardSize, pointerEvents: 'none' }}
    >
      <motion.path
        ref={pathRef}
        d={pathData}
        fill="none"
        stroke="black"
        strokeLinecap="square"
        strokeWidth="4"
        animate={isLeaving && pathLength > 0 ? { strokeDashoffset: -pathLength } : { strokeDashoffset: 0 }}
        transition={{ duration: 0.72, ease: [0.16, 0.84, 0.28, 1] }}
        pointerEvents={canLeave && !isLeaving ? 'stroke' : 'none'}
        onClick={() => setIsLeaving(true)}
        style={{
          cursor: canLeave ? 'pointer' : 'default',
          strokeDasharray: pathLength > 0 ? `${pathLength} ${pathLength}` : undefined,
        }}
      />
      <motion.polygon
        points={arrow}
        fill="black"
        pointerEvents="none"
        animate={isLeaving ? { ...exitOffset, opacity: [1, 1, 0] } : { x: 0, y: 0, opacity: 1 }}
        transition={{ duration: 0.72, ease: [0.16, 0.84, 0.28, 1] }}
        onAnimationComplete={() => {
          if (isLeaving) onClick();
        }}
      />
    </motion.svg>
  );
}

function getArrowHead(x: number, y: number, direction: Direction): string {
  if (direction === 'right') return `${x + 9},${y} ${x - 4},${y - 7} ${x - 4},${y + 7}`;
  if (direction === 'left') return `${x - 9},${y} ${x + 4},${y - 7} ${x + 4},${y + 7}`;
  if (direction === 'down') return `${x},${y + 9} ${x - 7},${y - 4} ${x + 7},${y - 4}`;
  return `${x},${y - 9} ${x - 7},${y + 4} ${x + 7},${y + 4}`;
}
