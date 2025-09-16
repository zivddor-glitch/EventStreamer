import { createClient } from './supabaseServer';

export async function getCurrentUser() {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  if (!user) return false;
  
  const supabase = createClient();
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();
    
  return profile?.role === 'admin';
}
