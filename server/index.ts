import { spawn } from 'child_process';

console.log('Starting Next.js development server...');

// Ensure all Supabase environment variables are available
const requiredEnvVars = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  PORT: process.env.PORT || '5000'
};

console.log('Environment variables check:');
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  console.log(`${key}: ${value ? 'Set' : 'NOT SET'}`);
});

// Spawn Next.js as a child process with explicit environment variables
const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000', '-H', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    ...requiredEnvVars
  }
});

// Handle process events
nextProcess.on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});

nextProcess.on('exit', (code, signal) => {
  if (code !== null) {
    console.log(`Next.js process exited with code ${code}`);
  } else if (signal !== null) {
    console.log(`Next.js process killed with signal ${signal}`);
  }
  process.exit(code || 0);
});

// Keep the parent process alive
process.on('SIGINT', () => {
  console.log('Shutting down Next.js...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down Next.js...');
  nextProcess.kill('SIGTERM');
});

console.log('Next.js wrapper started successfully');
