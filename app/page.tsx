'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/game-store';
import { getCompletedLevels } from '@/lib/game-engine';

export default function Home() {
  const router = useRouter();
  const { loadProgress, completedLevels } = useGameStore();
  
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);
  
  const handlePlay = () => {
    const completed = getCompletedLevels();
    const nextLevel = completed.length > 0 ? Math.max(...completed) + 1 : 1;
    
    if (nextLevel <= 30) {
      router.push(`/game?level=${nextLevel}`);
    } else {
      router.push('/game?level=1');
    }
  };
  
  const handleContinue = () => {
    const completed = getCompletedLevels();
    const nextLevel = completed.length > 0 ? Math.max(...completed) + 1 : 1;
    router.push(`/game?level=${nextLevel}`);
  };
  
  const hasProgress = completedLevels.length > 0;
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl font-bold mb-2">Cross-Arrow</h1>
        <p className="text-xl text-gray-600 mb-8">Sliding Line Puzzle</p>
        
        <div className="mb-8">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-gray-700">
            Push lines off the grid by tapping arrows. 
            Lines can only move if the path is clear.
            Clear all lines to win!
          </p>
        </div>
        
        <div className="space-y-4">
          <Button
            onClick={handlePlay}
            size="lg"
            className="w-full"
          >
            {hasProgress ? 'New Game' : 'Start Playing'}
          </Button>
          
          {hasProgress && (
            <Button
              onClick={handleContinue}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Continue (Level {Math.max(...completedLevels) + 1})
            </Button>
          )}
          
          <Button
            onClick={() => router.push('/levels')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Level Select
          </Button>
          
          <Button
            onClick={() => router.push('/leaderboard')}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Leaderboard
          </Button>
        </div>
        
        {hasProgress && (
          <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-2xl font-bold text-accent">
              {completedLevels.length} / 30 Levels
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
