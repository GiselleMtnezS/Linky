-- Run this in Supabase SQL editor after creating the project
-- 1. Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  -- Auth0 sub (e.g. "google-oauth2|123")
  name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  -- Cloudinary URL, nullable
  scheduled_at TIMESTAMPTZ,
  -- nullable
  position INTEGER NOT NULL DEFAULT 0,
  is_public BOOLEAN DEFAULT FALSE,
  -- for v3 gallery feature
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 3. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- 4. RLS Policies — users table
CREATE POLICY "Users see own record" ON users FOR
SELECT USING (id = (auth.jwt()->>'sub'));
CREATE POLICY "Users insert own record" ON users FOR
INSERT WITH CHECK (id = (auth.jwt()->>'sub'));
CREATE POLICY "Users update own record" ON users FOR
UPDATE USING (id = (auth.jwt()->>'sub'));
-- 5. RLS Policies — posts table
CREATE POLICY "Users see own posts" ON posts FOR
SELECT USING (user_id = (auth.jwt()->>'sub'));
CREATE POLICY "Users insert own posts" ON posts FOR
INSERT WITH CHECK (user_id = (auth.jwt()->>'sub'));
CREATE POLICY "Users update own posts" ON posts FOR
UPDATE USING (user_id = (auth.jwt()->>'sub'));
CREATE POLICY "Users delete own posts" ON posts FOR DELETE USING (user_id = (auth.jwt()->>'sub'));