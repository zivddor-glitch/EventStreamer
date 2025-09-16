import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setupDatabase() {
  console.log('Setting up database schema...');

  // Enable UUID extension
  const { error: uuidError } = await supabase.rpc('create_extension_if_not_exists', {
    extension_name: 'uuid-ossp'
  });
  
  if (uuidError && !uuidError.message.includes('already exists')) {
    console.log('UUID extension setup (may already exist):', uuidError.message);
  }

  // Create tables using raw SQL
  const sql = `
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

  const { error } = await supabase.rpc('exec_sql', { sql });

  if (error) {
    console.error('Error creating tables:', error);
    // Try alternative approach - execute statements one by one
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        const { error: stmtError } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' });
        if (stmtError) {
          console.log('Statement result:', statement.substring(0, 50) + '...', stmtError.message);
        }
      }
    }
  }

  console.log('Database schema setup completed!');
}

// Execute the setup
setupDatabase().catch(console.error);