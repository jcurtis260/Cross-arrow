'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Line as LineType } from '@/types/game';

interface LineProps {
  line: LineType;
  cellSize: number;
  gridSize: number;
}

export function Line({ line, cellSize, gridSize }: LineProps) {
  const x = line.startX * cellSize;
  const y = line.startY * cellSize;
  const width = line.orientation === 'horizontal' ? line.length * cellSize : cellSize;
  const height = line.orientation === 'vertical' ? line.length * cellSize : cellSize;
  
  const lineThickness = cellSize * 0.6;
  const offset = (cellSize - lineThickness) / 2;
  
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
      className="absolute bg-black rounded-full"
      style={{
        left: line.orientation === 'horizontal' ? x : x + offset,
        top: line.orientation === 'vertical' ? y : y + offset,
        width: line.orientation === 'horizontal' ? width : lineThickness,
        height: line.orientation === 'vertical' ? height : lineThickness,
      }}
    />
  );
}
