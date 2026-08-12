# Cross-Arrow - Sliding Line Puzzle Game

A minimalist sliding line puzzle game built with Next.js 15, TypeScript, and Tailwind CSS. Clear the board by pushing lines off the grid with strategic moves!

## Features

- 🎮 **30 Handcrafted Levels** across 3 difficulty levels (Easy, Medium, Hard)
- 🎯 **Strategic Gameplay** - Lines can only slide if the path is clear
- ⏱️ **Time & Move Tracking** - Compete for the best scores
- 💧 **Hint System** - Get help when stuck with 3 hints per level
- ↶ **Undo Functionality** - Reverse your moves
- 🏆 **Global Leaderboard** - Compete with players worldwide
- 📊 **Multiple Leaderboard Types** - Global, Per-Level, Daily, and Weekly
- 📱 **Responsive Design** - Play on mobile, tablet, or desktop
- ✨ **Smooth Animations** - Powered by Framer Motion

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Database**: Vercel Postgres (or any PostgreSQL database)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Vercel Postgres recommended)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cross-arrow
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
POSTGRES_URL="your_postgres_connection_string"
POSTGRES_PRISMA_URL="your_prisma_connection_string"
POSTGRES_URL_NON_POOLING="your_non_pooling_connection_string"
```

4. Initialize the database:

Run the SQL schema from `database/schema.sql` in your PostgreSQL database:
```bash
psql -h your-host -U your-user -d your-database -f database/schema.sql
```

Or use the Vercel Postgres Query interface if using Vercel.

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game!

## Deployment to Vercel

### Step 1: Create Vercel Account

1. Sign up at [vercel.com](https://vercel.com)
2. Connect your GitHub account

### Step 2: Set Up Vercel Postgres

1. In your Vercel dashboard, go to **Storage**
2. Click **Create Database** → **Postgres**
3. Name your database (e.g., "cross-arrow-db")
4. Select a region close to your users
5. Click **Create**

### Step 3: Deploy the Application

**The database will automatically initialize on first use!** 

You don't need to manually run any SQL - the app will create the tables automatically when you first access the leaderboard or submit a score.

### Step 4: Deploy via Vercel Dashboard

#### Option A: Deploy via Vercel Dashboard

1. Go to your Vercel dashboard
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. In **Environment Variables**, your Postgres credentials are automatically added
6. Click **Deploy**

#### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts to link your project
```

### Step 5: Verify Deployment

1. Visit your deployed URL (e.g., `https://cross-arrow.vercel.app`)
2. Test gameplay and level completion
3. Submit a test score - this will automatically create the database tables!
4. Check the leaderboard to verify everything works
5. Check the Vercel Logs for any errors

**Note:** The first API call might take a moment as it initializes the database. Subsequent calls will be fast.

### Step 6: Manual Database Initialization (Optional)

If you prefer to manually initialize the database before first use, you can:

**Option A:** Visit `https://your-app.vercel.app/api/init-db` in your browser

**Option B:** Use the Vercel Postgres Query interface:
1. Go to your database → Query tab
2. Copy contents of `database/schema.sql`
3. Execute the SQL

### Step 7: Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Wait for DNS propagation (can take up to 48 hours)

## Environment Variables

Required environment variables (automatically set by Vercel if using Vercel Postgres):

- `POSTGRES_URL` - Connection string for pooled connections
- `POSTGRES_PRISMA_URL` - Connection string for Prisma
- `POSTGRES_URL_NON_POOLING` - Direct connection string

## Project Structure

```
cross-arrow/
├── app/                      # Next.js App Router pages
│   ├── page.tsx             # Home screen
│   ├── game/page.tsx        # Game screen
│   ├── levels/page.tsx      # Level selection
│   ├── leaderboard/page.tsx # Leaderboard
│   └── api/                 # API routes
│       ├── scores/          # Score submission
│       └── leaderboard/     # Leaderboard endpoints
├── components/              # React components
│   ├── game/               # Game-specific components
│   ├── ui/                 # Reusable UI components
│   └── leaderboard/        # Leaderboard components
├── lib/                    # Core game logic
│   ├── game-engine.ts      # Game mechanics
│   ├── collision-detector.ts # Movement validation
│   ├── level-loader.ts     # Level data loading
│   └── db.ts              # Database functions
├── store/                  # Zustand state management
├── types/                  # TypeScript type definitions
├── data/levels/           # Level definitions (JSON)
└── database/              # Database schema
```

## Game Rules

1. **Objective**: Clear all lines from the grid
2. **Movement**: Tap arrow buttons to push lines
3. **Constraint**: Lines can only move perpendicular to their orientation
4. **Blocking**: Lines cannot move if another line blocks the path
5. **Winning**: Successfully push all lines off the grid edge

## Leaderboard System

- **Global**: Ranked by total levels completed
- **Per-Level**: Best scores for each individual level
- **Daily**: Best performances in the last 24 hours
- **Weekly**: Most completions in the last 7 days

Scoring formula: `score = (moves × 10) + time_seconds` (lower is better)

## Development

### Run tests (if you add them):
```bash
npm run test
```

### Build for production:
```bash
npm run build
npm run start
```

### Lint code:
```bash
npm run lint
```

## Troubleshooting

### Database connection issues
- Verify environment variables are set correctly
- Check Vercel Postgres is running and accessible
- Ensure database schema has been initialized

### Deployment failures
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version compatibility (18+)

### Leaderboard not working
- Verify database tables exist (run schema.sql)
- Check API routes are accessible
- Look for errors in Vercel Function Logs

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for learning or building your own games!

## Acknowledgments

- Inspired by [Amaze GO!](https://apps.apple.com/gb/app/amaze-go/id6758326278)
- Built with Next.js, React, and Tailwind CSS
- Animations powered by Framer Motion

## Support

For issues or questions, please open an issue on GitHub.

---

**Enjoy playing Cross-Arrow! 🎮**
