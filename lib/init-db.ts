import { sql } from '@vercel/postgres';

let dbInitialized = false;
let initializationError: string | null = null;

export async function initializeDatabase() {
  if (dbInitialized) {
    if (initializationError) {
      return { success: false, error: initializationError };
    }
    return { success: true, message: 'Database already initialized' };
  }

  try {
    console.log('Checking and initializing database...');

    // Create players table
    await sql`
      CREATE TABLE IF NOT EXISTS players (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create scores table
    await sql`
      CREATE TABLE IF NOT EXISTS scores (
        id SERIAL PRIMARY KEY,
        player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
        level_id INTEGER NOT NULL,
        moves INTEGER NOT NULL,
        time_seconds INTEGER NOT NULL,
        score INTEGER NOT NULL,
        completed_at TIMESTAMP DEFAULT NOW()
      )
    `;

    // Create indexes for better query performance
    await sql`
      CREATE INDEX IF NOT EXISTS idx_scores_level_score ON scores(level_id, score)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_scores_player_level ON scores(player_id, level_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_scores_completed_at ON scores(completed_at)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score)
    `;

    dbInitialized = true;
    console.log('Database initialized successfully');

    return { success: true, message: 'Database initialized successfully' };
  } catch (error) {
    console.error('Error initializing database:', error);
    
    initializationError = 'Leaderboard database is not connected.';
    dbInitialized = true;
    
    return { success: false, error: initializationError };
  }
}

// Helper function to ensure DB is initialized before operations
export async function ensureDbInitialized() {
  if (!dbInitialized) {
    const result = await initializeDatabase();
    if (!result.success) {
      throw new Error('Leaderboard database is not connected.');
    }
  }
}
