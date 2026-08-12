'use client';

import React from 'react';
import { Direction } from '@/types/game';

interface ArrowButtonProps {
  direction: Direction;
  onClick: () => void;
  cellSize: number;
  position: { x: number; y: number };
}

export function ArrowButton({ direction, onClick, cellSize, position }: ArrowButtonProps) {
  const buttonSize = cellSize * 0.8;
  const offset = (cellSize - buttonSize) / 2;
  
  let arrowRotation = 0;
  let buttonX = position.x;
  let buttonY = position.y;
  
  switch (direction) {
    case 'up':
      arrowRotation = 0;
      buttonY -= cellSize;
      break;
    case 'down':
      arrowRotation = 180;
      buttonY += cellSize;
      break;
    case 'left':
      arrowRotation = -90;
      buttonX -= cellSize;
      break;
    case 'right':
      arrowRotation = 90;
      buttonX += cellSize;
      break;
  }
  
  return (
    <button
      onClick={onClick}
      className="absolute bg-accent text-white rounded-full flex items-center justify-center 
                 tap-highlight-none transition-all active:scale-90 hover:bg-blue-600 shadow-md"
      style={{
        left: buttonX + offset,
        top: buttonY + offset,
        width: buttonSize,
        height: buttonSize,
      }}
    >
      <svg
        width={buttonSize * 0.5}
        height={buttonSize * 0.5}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transform: `rotate(${arrowRotation}deg)` }}
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
