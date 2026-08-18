import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/init-db';

export async function GET() {
  try {
    const result = await initializeDatabase();
    
    return NextResponse.json({
      success: result.success,
      message: result.success ? result.message : 'Leaderboard database is not connected.',
    });
  } catch (error) {
    console.error('Error in GET /api/init-db:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
