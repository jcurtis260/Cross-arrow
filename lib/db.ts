import { sql } from '@vercel/postgres';
import { ensureDbInitialized } from './init-db';

export async function createOrGetPlayer(username: string) {
  await ensureDbInitialized();
  
  try {
    const result = await sql`
      INSERT INTO players (username)
      VALUES (${username})
      ON CONFLICT (username)
      DO UPDATE SET username = ${username}
      RETURNING id, username, created_at
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error('Error creating/getting player:', error);
    throw error;
  }
}

export async function submitScore(
  username: string,
  levelId: number,
  moves: number,
  timeSeconds: number,
  score: number
) {
  await ensureDbInitialized();
  
  try {
    const player = await createOrGetPlayer(username);
    
    const result = await sql`
      INSERT INTO scores (player_id, level_id, moves, time_seconds, score)
      VALUES (${player.id}, ${levelId}, ${moves}, ${timeSeconds}, ${score})
      RETURNING *
    `;
    
    return result.rows[0];
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}

export async function getGlobalLeaderboard(limit = 100) {
  await ensureDbInitialized();
  
  try {
    const result = await sql`
      SELECT 
        p.username,
        COUNT(DISTINCT s.level_id) as levels_completed,
        MIN(s.score) as best_score,
        MIN(s.completed_at) as first_completed
      FROM players p
      JOIN scores s ON p.id = s.player_id
      GROUP BY p.id, p.username
      ORDER BY levels_completed DESC, best_score ASC
      LIMIT ${limit}
    `;
    
    return result.rows.map((row, index) => ({
      rank: index + 1,
      username: row.username,
      levelsCompleted: row.levels_completed,
      bestScore: row.best_score,
    }));
  } catch (error) {
    console.error('Error getting global leaderboard:', error);
    return [];
  }
}

export async function getLevelLeaderboard(levelId: number, limit = 50) {
  await ensureDbInitialized();
  
  try {
    const result = await sql`
      SELECT 
        p.username,
        s.score,
        s.moves,
        s.time_seconds,
        s.completed_at
      FROM scores s
      JOIN players p ON s.player_id = p.id
      WHERE s.level_id = ${levelId}
      ORDER BY s.score ASC, s.completed_at ASC
      LIMIT ${limit}
    `;
    
    return result.rows.map((row, index) => ({
      rank: index + 1,
      username: row.username,
      score: row.score,
      moves: row.moves,
      timeSeconds: row.time_seconds,
      completedAt: row.completed_at,
    }));
  } catch (error) {
    console.error('Error getting level leaderboard:', error);
    return [];
  }
}

export async function getDailyLeaderboard(limit = 100) {
  await ensureDbInitialized();
  
  try {
    const result = await sql`
      SELECT 
        p.username,
        s.score,
        s.moves,
        s.time_seconds,
        s.level_id,
        s.completed_at
      FROM scores s
      JOIN players p ON s.player_id = p.id
      WHERE s.completed_at >= NOW() - INTERVAL '24 hours'
      ORDER BY s.score ASC, s.completed_at ASC
      LIMIT ${limit}
    `;
    
    return result.rows.map((row, index) => ({
      rank: index + 1,
      username: row.username,
      score: row.score,
      moves: row.moves,
      timeSeconds: row.time_seconds,
      levelId: row.level_id,
      completedAt: row.completed_at,
    }));
  } catch (error) {
    console.error('Error getting daily leaderboard:', error);
    return [];
  }
}

export async function getWeeklyLeaderboard(limit = 100) {
  await ensureDbInitialized();
  
  try {
    const result = await sql`
      SELECT 
        p.username,
        COUNT(*) as completions,
        SUM(s.score) as total_score,
        MIN(s.completed_at) as first_completion
      FROM scores s
      JOIN players p ON s.player_id = p.id
      WHERE s.completed_at >= NOW() - INTERVAL '7 days'
      GROUP BY p.id, p.username
      ORDER BY completions DESC, total_score ASC
      LIMIT ${limit}
    `;
    
    return result.rows.map((row, index) => ({
      rank: index + 1,
      username: row.username,
      completions: row.completions,
      totalScore: row.total_score,
    }));
  } catch (error) {
    console.error('Error getting weekly leaderboard:', error);
    return [];
  }
}
