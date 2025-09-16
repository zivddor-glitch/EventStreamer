-- Event Management System Schema for Supabase
-- Run this in your Supabase Dashboard → SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  event_date TIMESTAMP NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create riders table
CREATE TABLE IF NOT EXISTS riders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

-- Create horses table  
CREATE TABLE IF NOT EXISTS horses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

-- Create pairs table
CREATE TABLE IF NOT EXISTS pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID NOT NULL REFERENCES riders(id),
  horse_id UUID NOT NULL REFERENCES horses(id)
);

-- Create classes table
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  name TEXT NOT NULL,
  level TEXT NOT NULL
);

-- Create results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id),
  class_id UUID NOT NULL REFERENCES classes(id),
  pair_id UUID NOT NULL REFERENCES pairs(id),
  final_score_pct DECIMAL(5,2) NOT NULL,
  eligible BOOLEAN NOT NULL DEFAULT true
);

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id UUID PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'user',
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE horses ENABLE ROW LEVEL SECURITY;
ALTER TABLE pairs ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public viewing of published events
CREATE POLICY "Allow public read of published events" ON events
  FOR SELECT USING (status = 'published');

CREATE POLICY "Allow public read of classes for published events" ON classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = classes.event_id 
      AND e.status = 'published'
    )
  );

CREATE POLICY "Allow public read of results for published events" ON results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events e 
      WHERE e.id = results.event_id 
      AND e.status = 'published'
    )
  );

CREATE POLICY "Allow public read of riders in published events" ON riders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pairs p
      JOIN results r ON r.pair_id = p.id
      JOIN events e ON e.id = r.event_id
      WHERE p.rider_id = riders.id 
      AND e.status = 'published'
    )
  );

CREATE POLICY "Allow public read of horses in published events" ON horses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM pairs p
      JOIN results r ON r.pair_id = p.id
      JOIN events e ON e.id = r.event_id
      WHERE p.horse_id = horses.id 
      AND e.status = 'published'
    )
  );

CREATE POLICY "Allow public read of pairs in published events" ON pairs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM results r
      JOIN events e ON e.id = r.event_id
      WHERE r.pair_id = pairs.id 
      AND e.status = 'published'
    )
  );

-- Insert sample data
INSERT INTO events (name, event_date, status) VALUES
  ('Spring Classic Dressage', '2025-05-15 10:00:00', 'published'),
  ('Summer Championship', '2025-07-20 09:00:00', 'draft'),
  ('Winter Indoor Series', '2025-12-10 14:00:00', 'published')
ON CONFLICT DO NOTHING;

-- Insert sample riders and horses
INSERT INTO riders (name) VALUES
  ('Sarah Johnson'),
  ('Mike Wilson'),
  ('Emma Davis')
ON CONFLICT DO NOTHING;

INSERT INTO horses (name) VALUES
  ('Thunder'),
  ('Moonlight'),
  ('Stardust')
ON CONFLICT DO NOTHING;