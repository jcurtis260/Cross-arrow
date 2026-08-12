'use client';

import React from 'react';

interface LeaderboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function LeaderboardTabs({ activeTab, onTabChange }: LeaderboardTabsProps) {
  const tabs = [
    { id: 'global', label: 'Global' },
    { id: 'level', label: 'Level' },
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
  ];
  
  return (
    <div className="flex gap-2 mb-6 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all whitespace-nowrap
            ${activeTab === tab.id
              ? 'bg-accent text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
