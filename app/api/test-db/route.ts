import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabaseAdmin
      .from('information_schema.tables')
      .select('table_name')
      .limit(5);

    if (error) {
      console.error('Supabase connection error:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    console.log('Supabase connection successful!');
    return NextResponse.json({ 
      success: true, 
      message: 'Supabase connection working',
      tables: data 
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to connect to database' 
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    console.log('Setting up database schema...');

    // Create tables
    const createTablesSQL = `
      -- Enable UUID extension
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      -- Create events table
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        event_date TIMESTAMP NOT NULL,
        status TEXT NOT NULL DEFAULT 'draft',
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
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

      -- Create user_profiles table
      CREATE TABLE IF NOT EXISTS user_profiles (
        user_id UUID PRIMARY KEY,
        role TEXT NOT NULL DEFAULT 'user',
        email TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      -- Create classes table (depends on events)
      CREATE TABLE IF NOT EXISTS classes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES events(id),
        name TEXT NOT NULL,
        level TEXT NOT NULL
      );

      -- Create pairs table (depends on riders and horses)
      CREATE TABLE IF NOT EXISTS pairs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        rider_id UUID NOT NULL REFERENCES riders(id),
        horse_id UUID NOT NULL REFERENCES horses(id)
      );

      -- Create results table (depends on events, classes, and pairs)
      CREATE TABLE IF NOT EXISTS results (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES events(id),
        class_id UUID NOT NULL REFERENCES classes(id),
        pair_id UUID NOT NULL REFERENCES pairs(id),
        final_score_pct DECIMAL(5,2) NOT NULL,
        eligible BOOLEAN NOT NULL DEFAULT true
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
      CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
      CREATE INDEX IF NOT EXISTS idx_classes_event_id ON classes(event_id);
      CREATE INDEX IF NOT EXISTS idx_results_event_id ON results(event_id);
      CREATE INDEX IF NOT EXISTS idx_results_class_id ON results(class_id);
      CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
    `;

    // Execute the SQL using Supabase client
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql: createTablesSQL });

    if (error) {
      console.error('Error creating tables:', error);
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 });
    }

    console.log('Database schema created successfully!');
    return NextResponse.json({ 
      success: true, 
      message: 'Database schema created successfully' 
    });
  } catch (error) {
    console.error('Schema setup error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to set up database schema' 
    }, { status: 500 });
  }
}