'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  const [username, setUsername] = useState('');

  useEffect(() => {
    setUsername(localStorage.getItem('username') || '');
  }, []);

  const startGame = () => {
    const savedName = username.trim();
    if (savedName.length < 2) return;
    localStorage.setItem('username', savedName);
    window.location.assign(`/game?random=1&seed=${Date.now()}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl font-bold mb-2">Snake Out</h1>
        <p className="text-xl text-gray-600 mb-8">Clear the maze</p>
        
        <div className="mb-8">
          <div className="text-5xl mb-4">↪</div>
          <p className="text-gray-700">
            Find a clear route, tap its arrow, and let the whole snake slide away.
            Clear every route to finish the board.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="rounded-lg bg-white p-4 text-left shadow-md">
            <label htmlFor="player-name" className="mb-1 block text-sm font-medium text-gray-700">
              Player name
            </label>
            <input
              id="player-name"
              value={username}
              onChange={(event) => setUsername(event.target.value.slice(0, 50))}
              placeholder="Name for the leaderboard"
              minLength={2}
              maxLength={50}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-accent focus:outline-none"
            />
            <p className="mt-2 text-xs text-gray-500">Saved on this device and used for every score.</p>
          </div>

          <Button
            onClick={startGame}
            disabled={username.trim().length < 2}
            size="lg"
            className="w-full"
          >
            Start Game
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
      </div>
    </div>
  );
}
