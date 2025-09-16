import { useQuery } from '@tanstack/react-query';
import type { Event } from '@shared/schema';

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer block">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          פורסם
        </span>
        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      
      <div className="w-full h-48 bg-muted rounded-md mb-4 flex items-center justify-center">
        <svg className="w-16 h-16 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-card-foreground mb-2" data-testid={`text-event-name-${event.id}`}>
        {event.name}
      </h3>
      <p className="text-muted-foreground mb-4" data-testid={`text-event-date-${event.id}`}>
        {new Date(event.event_date).toLocaleDateString('he-IL')}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          רוכבים משתתפים
        </span>
        <span className="text-sm text-primary font-medium">צפה בפרטים ←</span>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: events = [], isLoading, error } = useQuery<Event[]>({
    queryKey: ['/api/events'],
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">טוען אירועים...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-destructive text-lg">שגיאה בטעינת האירועים</p>
        </div>
      </div>
    );
  }

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