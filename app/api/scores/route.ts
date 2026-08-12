import { NextRequest, NextResponse } from 'next/server';
import { submitScore } from '@/lib/db';
import { validateScore } from '@/lib/score-calculator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, levelId, moves, timeSeconds, score, gridSize } = body;
    
    if (!username || !levelId || !moves || !timeSeconds || score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (username.length < 2 || username.length > 50) {
      return NextResponse.json(
        { error: 'Username must be between 2 and 50 characters' },
        { status: 400 }
      );
    }
    
    if (!validateScore(moves, timeSeconds, gridSize || 7)) {
      return NextResponse.json(
        { error: 'Invalid score data' },
        { status: 400 }
      );
    }
    
    const result = await submitScore(username, levelId, moves, timeSeconds, score);
    
    return NextResponse.json({
      success: true,
      score: result
    });
  } catch (error) {
    console.error('Error in POST /api/scores:', error);
    return NextResponse.json(
      { error: 'Failed to submit score' },
      { status: 500 }
    );
  }
}
