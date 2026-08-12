'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Line as LineType, Direction } from '@/types/game';

interface LineProps {
  line: LineType;
  cellSize: number;
  gridSize: number;
  validDirections: Direction[];
  onClick: () => void;
}

export function Line({ line, cellSize, gridSize, validDirections, onClick }: LineProps) {
  const x = line.startX * cellSize;
  const y = line.startY * cellSize;
  const width = line.orientation === 'horizontal' ? line.length * cellSize : cellSize;
  const height = line.orientation === 'vertical' ? line.length * cellSize : cellSize;
  
  const lineThickness = cellSize * 0.6;
  const offset = (cellSize - lineThickness) / 2;
  
  const canMove = validDirections.length > 0;
  
  // Arrow size
  const arrowSize = cellSize * 0.5;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
      onClick={canMove ? onClick : undefined}
      className={`absolute bg-black rounded-full ${canMove ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
      style={{
        left: line.orientation === 'horizontal' ? x : x + offset,
        top: line.orientation === 'vertical' ? y : y + offset,
        width: line.orientation === 'horizontal' ? width : lineThickness,
        height: line.orientation === 'vertical' ? height : lineThickness,
      }}
    >
      {/* Draw arrows at the ends of lines showing valid directions */}
      {canMove && validDirections.map((direction) => {
        let arrowX = 0;
        let arrowY = 0;
        let rotation = 0;
        
        if (line.orientation === 'horizontal') {
          // Horizontal line - arrows on top or bottom center
          arrowX = (width / 2) - (arrowSize / 2);
          if (direction === 'up') {
            arrowY = -(arrowSize * 0.7);
            rotation = 0;
          } else if (direction === 'down') {
            arrowY = lineThickness - (arrowSize * 0.3);
            rotation = 180;
          }
        } else {
          // Vertical line - arrows on left or right center
          arrowY = (height / 2) - (arrowSize / 2);
          if (direction === 'left') {
            arrowX = -(arrowSize * 0.7);
            rotation = -90;
          } else if (direction === 'right') {
            arrowX = lineThickness - (arrowSize * 0.3);
            rotation = 90;
          }
        }
        
        return (
          <div
            key={direction}
            className="absolute flex items-center justify-center pointer-events-none"
            style={{
              left: arrowX,
              top: arrowY,
              width: arrowSize,
              height: arrowSize,
            }}
          >
            <svg
              width={arrowSize * 0.8}
              height={arrowSize * 0.8}
              viewBox="0 0 24 24"
              fill="white"
              style={{
                transform: `rotate(${rotation}deg)`,
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
            >
              <path d="M12 2l-10 10h7v10h6V12h7z" />
            </svg>
          </div>
        );
      })}
    </motion.div>
  );
}
