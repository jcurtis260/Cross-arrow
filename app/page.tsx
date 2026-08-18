'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const router = useRouter();
  
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
          <Button
            onClick={() => window.location.assign(`/game?random=1&seed=${Date.now()}`)}
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
