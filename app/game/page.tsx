'use client';

import React, { useEffect, useRef, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Grid } from '@/components/game/Grid';
import { GameHUD } from '@/components/game/GameHUD';
import { HintSystem } from '@/components/game/HintSystem';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useGameStore } from '@/store/game-store';
import { loadLevel } from '@/lib/level-loader';
import { createRandomChallenge } from '@/lib/random-level-generator';
import { LevelStats } from '@/types/game';

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const generatedSeed = useRef(Date.now());
  const levelId = parseInt(searchParams.get('level') || '1');
  const isRandomChallenge = searchParams.get('random') === '1';
  const randomSeed = isRandomChallenge ? parseInt(searchParams.get('seed') || `${generatedSeed.current}`) : 0;
  
  const { 
    startLevel, 
    gameStatus, 
    completeLevel, 
    resetLevel, 
    pauseGame, 
    resumeGame,
    undoMove,
    currentLevel,
  } = useGameStore();
  
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [levelStats, setLevelStats] = useState<LevelStats | null>(null);
  const [username, setUsername] = useState('');
  const [scoreStatus, setScoreStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle');
  
  useEffect(() => {
    const level = isRandomChallenge ? createRandomChallenge(randomSeed) : loadLevel(levelId);
    if (level) {
      startLevel(level);
    } else {
      router.push('/');
    }
  }, [isRandomChallenge, levelId, randomSeed, startLevel, router]);
  
  useEffect(() => {
    if (gameStatus === 'completed' && !showCompleteModal) {
      const stats = completeLevel();
      setLevelStats(stats);
      setUsername(localStorage.getItem('username') || '');
      setScoreStatus('idle');
      setShowCompleteModal(true);
    }
  }, [gameStatus, completeLevel, showCompleteModal]);
  
  const handlePause = () => {
    pauseGame();
    setShowPauseMenu(true);
  };
  
  const handleResume = () => {
    resumeGame();
    setShowPauseMenu(false);
  };
  
  const handleRestart = () => {
    resetLevel();
    setShowPauseMenu(false);
  };
  
  const handleNextLevel = () => {
    setShowCompleteModal(false);
    if (isRandomChallenge) {
      router.push(`/game?random=1&seed=${Date.now()}`);
      return;
    }

    const nextLevelId = levelId + 1;
    if (nextLevelId <= 30) {
      router.push(`/game?level=${nextLevelId}`);
    } else {
      router.push('/levels');
    }
  };
  
  const handleReplay = () => {
    setShowCompleteModal(false);
    resetLevel();
  };

  const submitCompletedScore = async () => {
    if (!levelStats || !currentLevel || username.trim().length < 2) return;

    setScoreStatus('submitting');
    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          levelId: currentLevel.levelId,
          moves: levelStats.moves,
          timeSeconds: levelStats.timeSeconds,
          score: levelStats.score,
          gridSize: currentLevel.gridSize,
        }),
      });

      if (!response.ok) throw new Error('Score submission failed');
      localStorage.setItem('username', username.trim());
      setScoreStatus('submitted');
    } catch {
      setScoreStatus('error');
    }
  };

  useEffect(() => {
    if (
      showCompleteModal &&
      levelStats &&
      username.trim().length >= 2 &&
      scoreStatus === 'idle'
    ) {
      submitCompletedScore();
    }
    // submitCompletedScore intentionally reads the current completion state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showCompleteModal, levelStats, username, scoreStatus]);
  
  const getStarDisplay = (stars: number) => {
    return Array.from({ length: 3 }).map((_, i) => (
      <span key={i} className={i < stars ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };
  
  if (!currentLevel) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-md mb-4 flex items-center justify-between">
        <Button
          onClick={() => router.push('/')}
          variant="outline"
          size="sm"
        >
          ← Home
        </Button>
        
        <Button
          onClick={handlePause}
          variant="outline"
          size="sm"
        >
          ⏸ Pause
        </Button>
      </div>
      
      <GameHUD />
      
      <div className="mb-4">
        <Grid cellSize={60} />
      </div>
      
      <div className="flex gap-3">
        <Button
          onClick={undoMove}
          variant="secondary"
          size="sm"
        >
          ↶ Undo
        </Button>
        
        <Button
          onClick={handleRestart}
          variant="secondary"
          size="sm"
        >
          ⟳ Restart
        </Button>
      </div>
      
      <HintSystem />
      
      <Modal
        isOpen={showPauseMenu}
        onClose={handleResume}
        title="Paused"
      >
        <div className="space-y-4">
          <Button onClick={handleResume} className="w-full">
            Resume
          </Button>
          <Button onClick={handleRestart} variant="secondary" className="w-full">
            Restart Level
          </Button>
          <Button onClick={() => router.push('/')} variant="outline" className="w-full">
            Main Menu
          </Button>
        </div>
      </Modal>
      
      <Modal
        isOpen={showCompleteModal}
        onClose={() => {}}
        title="Level Complete!"
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">
            {levelStats && getStarDisplay(levelStats.stars)}
          </div>
          
          {levelStats && (
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Moves:</span>
                <span className="font-bold">{levelStats.moves}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Time:</span>
                <span className="font-bold">{levelStats.timeSeconds}s</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Score:</span>
                <span className="font-bold">{levelStats.score}</span>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 p-3 text-left">
            {scoreStatus === 'submitted' ? (
              <p className="text-center text-sm font-medium text-green-700">Score submitted to the leaderboard.</p>
            ) : (
              <>
                <label htmlFor="player-name" className="mb-1 block text-sm font-medium text-gray-700">
                  Leaderboard name
                </label>
                <div className="flex gap-2">
                  <input
                    id="player-name"
                    value={username}
                    onChange={(event) => setUsername(event.target.value.slice(0, 50))}
                    placeholder="Enter a name"
                    minLength={2}
                    maxLength={50}
                    className="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-accent focus:outline-none"
                  />
                  <Button
                    onClick={submitCompletedScore}
                    size="sm"
                    disabled={username.trim().length < 2 || scoreStatus === 'submitting'}
                  >
                    {scoreStatus === 'submitting' ? 'Saving...' : 'Submit'}
                  </Button>
                </div>
                {scoreStatus === 'error' && (
                  <p className="mt-2 text-xs text-red-600">Could not submit the score. Please try again.</p>
                )}
              </>
            )}
          </div>
          
          <div className="space-y-3 pt-4">
            <Button onClick={handleNextLevel} className="w-full">
              New Challenge →
            </Button>
            <Button onClick={handleReplay} variant="secondary" className="w-full">
              Replay
            </Button>
            <Button onClick={() => router.push('/leaderboard')} variant="outline" className="w-full">
              View Leaderboard
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}
