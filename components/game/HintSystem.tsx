'use client';

import React, { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { getValidDirectionsForLine } from '@/lib/collision-detector';
import { Button } from '@/components/ui/Button';

export function HintSystem() {
  const gameStore = useGameStore();
  const { grid, lines, hintsRemaining } = gameStore;
  const [showingHint, setShowingHint] = useState(false);
  
  const handleShowHint = () => {
    if (hintsRemaining > 0 && grid) {
      gameStore.useHint();
      setShowingHint(true);
      
      setTimeout(() => {
        setShowingHint(false);
      }, 3000);
    }
  };
  
  if (!grid || lines.length === 0) return null;
  
  return (
    <div className="mt-4">
      <Button
        onClick={handleShowHint}
        disabled={hintsRemaining === 0 || showingHint}
        variant="outline"
        size="sm"
      >
        Use Hint ({hintsRemaining} left)
      </Button>
      
      {showingHint && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800 font-medium">Hint:</p>
          <ul className="text-sm text-blue-700 mt-1">
            {lines.map((line) => {
              const validDirections = getValidDirectionsForLine(line, grid);
              if (validDirections.length > 0) {
                return (
                  <li key={line.id}>
                    Line {line.id} can move: {validDirections.join(', ')}
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
