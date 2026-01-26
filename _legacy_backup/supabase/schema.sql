-- =============================================
-- MACS DTU CP Guild Platform - Supabase Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  cf_username TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin', 'head_admin')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved')),
  cf_rating INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. DAILY PROBLEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS daily_problems (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  date DATE UNIQUE NOT NULL,
  cf_contest_id INTEGER NOT NULL,
  cf_index TEXT NOT NULL,
  name TEXT NOT NULL,
  rating INTEGER,
  tags TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 3. USER SOLVES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS user_solves (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  problem_id UUID REFERENCES daily_problems(id) ON DELETE CASCADE,
  solved_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, problem_id)
);

-- =============================================
-- 4. ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_solves ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
-- Public read access for leaderboard
CREATE POLICY "Public read profiles" 
  ON profiles FOR SELECT 
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile on signup
CREATE POLICY "Users insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Head admin can update any profile (for approvals and role changes)
CREATE POLICY "Head admin manage all profiles" 
  ON profiles FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'head_admin'
    )
  );

-- DAILY PROBLEMS POLICIES
-- Approved users can view problems
CREATE POLICY "Approved users view problems" 
  ON daily_problems FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

-- Admins and head admins can insert problems
CREATE POLICY "Admins insert problems" 
  ON daily_problems FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'head_admin')
    )
  );

-- Admins and head admins can delete problems
CREATE POLICY "Admins delete problems" 
  ON daily_problems FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('admin', 'head_admin')
    )
  );

-- USER SOLVES POLICIES
-- Approved users can view all solves
CREATE POLICY "Approved users view solves" 
  ON user_solves FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND status = 'approved'
    )
  );

-- Users can insert their own solves
CREATE POLICY "Users insert own solves" 
  ON user_solves FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 5. INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_daily_problems_date ON daily_problems(date DESC);
CREATE INDEX IF NOT EXISTS idx_user_solves_user_id ON user_solves(user_id);
CREATE INDEX IF NOT EXISTS idx_user_solves_problem_id ON user_solves(problem_id);

-- =============================================
-- 6. TRIGGER: Auto-create profile on signup
-- =============================================
-- Note: Profile creation is handled in the frontend during signup
-- This is an optional trigger if you want server-side handling

-- =============================================
-- HEAD ADMIN CLAIM SCRIPT
-- Run this AFTER signing up with your account to claim head_admin role
-- Replace 'YOUR_CF_USERNAME' with your actual Codeforces username
-- =============================================
-- UPDATE profiles 
-- SET role = 'head_admin', status = 'approved' 
-- WHERE cf_username = 'YOUR_CF_USERNAME';
