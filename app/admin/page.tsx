import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabaseServer';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import AdminDashboard from '@/components/AdminDashboard';
import type { Event } from '@shared/schema';

async function getAllEvents(): Promise<Event[]> {
  const supabase = await createClient();
  
  const { data: events, error } = await supabase
    .from('events')
    .select('id, name, event_date, status, created_at, updated_at')
    .order('event_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return events || [];
}

export default async function AdminPage() {
  const user = await getCurrentUser();
  const userIsAdmin = await isAdmin();

  if (!user || !userIsAdmin) {
    redirect('/admin/sign-in');
  }

  const events = await getAllEvents();

  return <AdminDashboard events={events} />;
}
