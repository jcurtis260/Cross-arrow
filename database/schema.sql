-- Players table
CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Scores table
CREATE TABLE IF NOT EXISTS scores (
  id SERIAL PRIMARY KEY,
  player_id INTEGER REFERENCES players(id) ON DELETE CASCADE,
  level_id INTEGER NOT NULL,
  moves INTEGER NOT NULL,
  time_seconds INTEGER NOT NULL,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_scores_level_score ON scores(level_id, score);
CREATE INDEX IF NOT EXISTS idx_scores_player_level ON scores(player_id, level_id);
CREATE INDEX IF NOT EXISTS idx_scores_completed_at ON scores(completed_at);
CREATE INDEX IF NOT EXISTS idx_scores_score ON scores(score);
