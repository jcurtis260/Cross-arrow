'use client';

import React from 'react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  [key: string]: any;
}

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, entry: LeaderboardEntry) => React.ReactNode;
  }[];
  currentUsername?: string | null;
}

export function LeaderboardTable({ data, columns, currentUsername }: LeaderboardTableProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <p className="text-gray-500">No data available yet. Be the first to compete!</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-600"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => {
              const isCurrentUser = currentUsername && entry.username === currentUsername;
              
              return (
                <tr
                  key={index}
                  className={`border-b last:border-b-0 ${
                    isCurrentUser ? 'bg-blue-50 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 text-sm">
                      {column.render
                        ? column.render(entry[column.key], entry)
                        : entry[column.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
