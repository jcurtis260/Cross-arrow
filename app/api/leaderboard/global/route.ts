import { NextResponse } from 'next/server';
import { getGlobalLeaderboard } from '@/lib/db';

export async function GET() {
  try {
    const leaderboard = await getGlobalLeaderboard(100);
    
    return NextResponse.json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Error in GET /api/leaderboard/global:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
