'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/store/game-store';

export function GameHUD() {
  const { currentLevel, moveCount, timer, hintsRemaining, gameStatus, incrementTimer } = useGameStore();
  
  useEffect(() => {
    if (gameStatus === 'playing') {
      const interval = setInterval(() => {
        incrementTimer();
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [gameStatus, incrementTimer]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  if (!currentLevel) return null;
  
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="text-center">
          <div className="text-sm text-gray-600">Level</div>
          <div className="text-xl font-bold">{currentLevel.levelId}</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">Moves</div>
          <div className="text-xl font-bold">{moveCount}</div>
          <div className="text-xs text-gray-500">Par: {currentLevel.parMoves}</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">Time</div>
          <div className="text-xl font-bold">{formatTime(timer)}</div>
        </div>
        
        <div className="text-center">
          <div className="text-sm text-gray-600">Hints</div>
          <div className="text-xl font-bold flex gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={i < hintsRemaining ? 'text-accent' : 'text-gray-300'}>
                💧
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
