'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAllLevels } from '@/lib/level-loader';
import { useGameStore } from '@/store/game-store';

export default function LevelsPage() {
  const router = useRouter();
  const { completedLevels, loadProgress } = useGameStore();
  
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);
  
  const allLevels = getAllLevels();
  
  const isLevelUnlocked = (levelId: number) => {
    if (levelId === 1) return true;
    return completedLevels.includes(levelId - 1);
  };
  
  const isLevelCompleted = (levelId: number) => {
    return completedLevels.includes(levelId);
  };
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            size="sm"
          >
            ← Back
          </Button>
          
          <h1 className="text-3xl font-bold">Level Select</h1>
          
          <div className="w-20"></div>
        </div>
        
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md text-center">
          <p className="text-gray-600">Progress</p>
          <p className="text-2xl font-bold text-accent">
            {completedLevels.length} / {allLevels.length} Levels
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {allLevels.map((level) => {
            const unlocked = isLevelUnlocked(level.levelId);
            const completed = isLevelCompleted(level.levelId);
            
            return (
              <Card
                key={level.levelId}
                onClick={() => unlocked && router.push(`/game?level=${level.levelId}`)}
                className={`relative ${!unlocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-2">
                    {unlocked ? level.levelId : '🔒'}
                  </div>
                  
                  {unlocked && (
                    <>
                      <div className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(level.difficulty)} mb-2`}>
                        {level.difficulty}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Par: {level.parMoves}
                      </div>
                      
                      {completed && (
                        <div className="mt-2 text-xl">
                          ✅
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
