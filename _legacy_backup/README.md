# MACS DTU CP Guild Platform

A comprehensive Competitive Programming platform for the MACS DTU college society, featuring user management, problem tracking, solve verification, and leaderboards.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan) ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)

## Features

- 🏠 **Landing Page** - Modern dark-mode aesthetic with MACS branding
- 🔐 **Authentication** - Sign up, login, and pending approval system
- 📋 **Problem Sheet** - Daily problems with CF API integration
- ✅ **Auto Verification** - One-click solve verification via Codeforces API
- 🏆 **Leaderboard** - Rankings with streaks and statistics
- 📊 **Profile** - GitHub-style contribution heatmap
- ⚙️ **Admin Dashboard** - Problem management and user approvals

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS v3
- **Animation**: Framer Motion
- **State/Cache**: TanStack Query (React Query)
- **Auth & Database**: Supabase
- **External API**: Codeforces API

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env` and add your credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the schema SQL in Supabase SQL Editor:
   - Go to SQL Editor in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Run the SQL to create tables and policies

### 3. Claim Head Admin

After signing up with your account:

```sql
UPDATE profiles 
SET role = 'head_admin', status = 'approved' 
WHERE cf_username = 'YOUR_CF_USERNAME';
```

Replace `YOUR_CF_USERNAME` with your Codeforces handle.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
src/
├── components/          # Reusable UI components
├── context/             # React contexts (Auth)
├── hooks/               # Custom React hooks
├── lib/                 # External service clients
├── pages/               # Route pages
│   └── admin/           # Admin-only pages
└── utils/               # Utility functions
```

## User Roles

| Role | Permissions |
|------|-------------|
| Member | View sheet, verify solves, view leaderboard |
| Admin | + Add/delete problems |
| Head Admin | + Approve users, manage roles |

## API Rate Limiting

The app handles Codeforces API rate limiting (max 5 req/sec) with built-in delays between requests.

## License

MIT
