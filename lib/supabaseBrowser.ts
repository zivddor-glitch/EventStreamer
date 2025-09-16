import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export function createClient() {
  return createClientComponentClient();
}

// Export default client for backward compatibility
export const supabase = createClient();
