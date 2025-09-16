import type { Event } from '@shared/schema';
import Link from 'next/link';

interface EventCardProps {
  event: Pick<Event, 'id' | 'name' | 'event_date'>;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link 
      href={`/event/${event.id}`}
      className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow cursor-pointer block"
      data-testid={`card-event-${event.id}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="status-badge status-published">פורסם</span>
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
    </Link>
  );
}
