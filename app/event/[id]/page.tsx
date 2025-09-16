import { createClient } from '@/lib/supabaseServer';
import ResultsTable from '@/components/ResultsTable';
import type { Event, Result } from '@shared/schema';

interface EventDetailPageProps {
  params: { id: string };
}

async function getEvent(id: string): Promise<Event | null> {
  const supabase = await createClient();
  
  const { data: event, error } = await supabase
    .from('events')
    .select('id, name, event_date, status')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }
  
  return event;
}

async function getEventResults(eventId: string) {
  const supabase = await createClient();
  
  const { data: results, error } = await supabase
    .from('results')
    .select(`
      id,
      final_score_pct,
      eligible,
      classes:class_id (
        id,
        name,
        level
      ),
      pairs:pair_id (
        id,
        riders:rider_id (
          id,
          name
        ),
        horses:horse_id (
          id,
          name
        )
      )
    `)
    .eq('event_id', eventId);
    
  if (error) {
    console.error('Error fetching results:', error);
    return [];
  }
  
  return results || [];
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEvent(id);
  const results = await getEventResults(id);

  if (!event) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">אירוע לא נמצא</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <a href="/" className="flex items-center text-muted-foreground hover:text-foreground">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
          חזרה לעמוד הבית
        </a>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="status-badge status-published">פורסם</span>
          <span className="text-sm text-muted-foreground">
            {new Date(event.event_date).toLocaleDateString('he-IL')}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-card-foreground mb-2">{event.name}</h1>
        <p className="text-muted-foreground">תחרות רכיבה רשמית עם מגוון רמות ומחלקות</p>
      </div>

      <div className="bg-card rounded-lg border border-border p-6">
        <h2 className="text-2xl font-semibold text-card-foreground mb-6">מחלקות ותוצאות</h2>
        <ResultsTable results={results} />
      </div>
    </div>
  );
}
