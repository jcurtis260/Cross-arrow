import { NextRequest, NextResponse } from 'next/server';
import { getLevelLeaderboard } from '@/lib/db';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params;
    const levelId = parseInt(params.id);
    
    if (isNaN(levelId)) {
      return NextResponse.json(
        { error: 'Invalid level ID' },
        { status: 400 }
      );
    }
    
    const leaderboard = await getLevelLeaderboard(levelId, 50);
    
    return NextResponse.json({
      success: true,
      levelId,
      leaderboard
    });
  } catch (error) {
    console.error('Error in GET /api/leaderboard/level/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    );
  }
}
