'use client';

import React, { useState } from 'react';
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
  const [isAnimating, setIsAnimating] = useState(false);
  
  const x = line.startX * cellSize;
  const y = line.startY * cellSize;
  const width = line.orientation === 'horizontal' ? line.length * cellSize : cellSize;
  const height = line.orientation === 'vertical' ? line.length * cellSize : cellSize;
  
  const lineThickness = cellSize * 0.6;
  const offset = (cellSize - lineThickness) / 2;
  
  const canMove = validDirections.length > 0;
  const primaryDirection = validDirections[0];
  
  // Calculate exit animation
  let exitX = line.orientation === 'horizontal' ? x : x + offset;
  let exitY = line.orientation === 'vertical' ? y : y + offset;
  
  if (isAnimating && primaryDirection) {
    const distance = gridSize * cellSize + cellSize * 2;
    switch (primaryDirection) {
      case 'up':
        exitY = -distance;
        break;
      case 'down':
        exitY = distance;
        break;
      case 'left':
        exitX = -distance;
        break;
      case 'right':
        exitX = distance;
        break;
    }
  }
  
  const handleClick = () => {
    if (canMove && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        onClick();
      }, 400);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isAnimating ? 0 : 1,
        scale: 1,
        left: exitX,
        top: exitY,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{
        type: isAnimating ? 'tween' : 'spring',
        duration: isAnimating ? 0.4 : 0.3,
        ease: isAnimating ? 'easeInOut' : 'easeOut',
      }}
      onClick={handleClick}
      className={`absolute bg-black rounded-full ${canMove ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed opacity-50'}`}
      style={{
        left: line.orientation === 'horizontal' ? x : x + offset,
        top: line.orientation === 'vertical' ? y : y + offset,
        width: line.orientation === 'horizontal' ? width : lineThickness,
        height: line.orientation === 'vertical' ? height : lineThickness,
      }}
    >
      {/* Draw clear arrows at the ends */}
      {canMove && validDirections.map((direction) => {
        let arrowStyle: React.CSSProperties = {};
        let arrowPath = '';
        
        if (line.orientation === 'horizontal') {
          // Horizontal line - arrows on top or bottom
          if (direction === 'up') {
            arrowStyle = {
              position: 'absolute',
              left: '50%',
              top: '-12px',
              transform: 'translateX(-50%)',
            };
            arrowPath = 'M12 4L8 8h3v8h2V8h3z';
          } else if (direction === 'down') {
            arrowStyle = {
              position: 'absolute',
              left: '50%',
              bottom: '-12px',
              transform: 'translateX(-50%) rotate(180deg)',
            };
            arrowPath = 'M12 4L8 8h3v8h2V8h3z';
          }
        } else {
          // Vertical line - arrows on left or right
          if (direction === 'left') {
            arrowStyle = {
              position: 'absolute',
              top: '50%',
              left: '-12px',
              transform: 'translateY(-50%) rotate(-90deg)',
            };
            arrowPath = 'M12 4L8 8h3v8h2V8h3z';
          } else if (direction === 'right') {
            arrowStyle = {
              position: 'absolute',
              top: '50%',
              right: '-12px',
              transform: 'translateY(-50%) rotate(90deg)',
            };
            arrowPath = 'M12 4L8 8h3v8h2V8h3z';
          }
        }
        
        return (
          <svg
            key={direction}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="white"
            style={{
              ...arrowStyle,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
              pointerEvents: 'none',
            }}
          >
            <path d={arrowPath} />
          </svg>
        );
      })}
    </motion.div>
  );
}
