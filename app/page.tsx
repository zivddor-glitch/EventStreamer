import { createClient } from '@/lib/supabaseServer';
import EventCard from '@/components/EventCard';
import type { Event } from '@shared/schema';

// Type for the actual data we fetch (without updated_at)
type PublishedEvent = Pick<Event, 'id' | 'name' | 'event_date' | 'status' | 'created_at'>;

async function getPublishedEvents(): Promise<PublishedEvent[]> {
  const supabase = await createClient();
  
  const { data: events, error } = await supabase
    .from('events')
    .select('id, name, event_date, status, created_at')
    .eq('status', 'published')
    .order('event_date', { ascending: false });
    
  if (error) {
    console.error('Error fetching events:', error);
    return [];
  }
  
  return events || [];
}

export default async function HomePage() {
  const events = await getPublishedEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">אירועי רכיבה פומביים</h2>
        <p className="text-muted-foreground">רשימת אירועי הרכיבה הפעילים והקרובים</p>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">אין אירועים פורסמו כרגע</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
