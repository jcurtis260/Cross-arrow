import { NextResponse } from 'next/server';
import { getWeeklyLeaderboard } from '@/lib/db';

export async function GET() {
  try {
    const leaderboard = await getWeeklyLeaderboard(100);
    
    return NextResponse.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Error in GET /api/leaderboard/weekly:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
