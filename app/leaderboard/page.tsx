'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { LeaderboardTabs } from '@/components/leaderboard/LeaderboardTabs';
import { LeaderboardTable } from '@/components/leaderboard/LeaderboardTable';
import { getUsername } from '@/lib/game-engine';

export default function LeaderboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('global');
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  
  useEffect(() => {
    const username = getUsername();
    setCurrentUsername(username);
  }, []);
  
  useEffect(() => {
    fetchLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedLevel]);
  
  const fetchLeaderboard = async () => {
    setLoading(true);
    
    try {
      let url = '/api/leaderboard/global';
      
      switch (activeTab) {
        case 'global':
          url = '/api/leaderboard/global';
          break;
        case 'level':
          url = `/api/leaderboard/level/${selectedLevel}`;
          break;
        case 'daily':
          url = '/api/leaderboard/daily';
          break;
        case 'weekly':
          url = '/api/leaderboard/weekly';
          break;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setLeaderboardData(data.leaderboard);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getColumns = () => {
    switch (activeTab) {
      case 'global':
        return [
          { key: 'rank', label: 'Rank' },
          { key: 'username', label: 'Player' },
          { key: 'levelsCompleted', label: 'Levels' },
          { key: 'bestScore', label: 'Best Score' },
        ];
      case 'level':
        return [
          { key: 'rank', label: 'Rank' },
          { key: 'username', label: 'Player' },
          { key: 'score', label: 'Score' },
          { key: 'moves', label: 'Moves' },
          { 
            key: 'timeSeconds', 
            label: 'Time',
            render: (value: number) => `${value}s`
          },
        ];
      case 'daily':
        return [
          { key: 'rank', label: 'Rank' },
          { key: 'username', label: 'Player' },
          { key: 'levelId', label: 'Level' },
          { key: 'score', label: 'Score' },
          { key: 'moves', label: 'Moves' },
        ];
      case 'weekly':
        return [
          { key: 'rank', label: 'Rank' },
          { key: 'username', label: 'Player' },
          { key: 'completions', label: 'Completions' },
          { key: 'totalScore', label: 'Total Score' },
        ];
      default:
        return [];
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
          
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          
          <div className="w-20"></div>
        </div>
        
        <LeaderboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        
        {activeTab === 'level' && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((level) => (
                <option key={level} value={level}>
                  Level {level}
                </option>
              ))}
            </select>
          </div>
        )}
        
        {loading ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <LeaderboardTable
            data={leaderboardData}
            columns={getColumns()}
            currentUsername={currentUsername}
          />
        )}
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Complete levels to appear on the leaderboard!
          </p>
        </div>
      </div>
    </div>
  );
}
