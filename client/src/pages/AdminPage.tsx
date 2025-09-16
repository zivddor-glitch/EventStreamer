import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useLocation } from 'wouter';
import type { Event } from '@shared/schema';

export default function AdminPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [, navigate] = useLocation();

  // Check if user is authenticated as admin
  const { data: authStatus, isLoading: authLoading, error: authError } = useQuery({
    queryKey: ['/api/admin/me'],
    retry: false,
  });

  const { data: events = [], isLoading } = useQuery<Event[]>({
    queryKey: ['/api/admin/events'],
    enabled: !!authStatus?.isAdmin, // Only fetch events if authenticated
  });

  // Redirect to login if not authenticated
  if (authError || (authStatus && !authStatus.isAdmin)) {
    navigate('/admin/login');
    return null;
  }

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">בודק הרשאות...</p>
        </div>
      </div>
    );
  }

  const publishMutation = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status: string }) => {
      return apiRequest('/api/admin/publish', {
        method: 'POST',
        body: JSON.stringify({ eventId, status }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
    },
  });

  const handlePublishToggle = async (eventId: string, currentStatus: string) => {
    setLoading(eventId);
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    
    try {
      await publishMutation.mutateAsync({ eventId, status: newStatus });
    } catch (error) {
      console.error('Error updating event:', error);
      alert('שגיאה בעדכון סטטוס האירוע');
    } finally {
      setLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">טוען...</p>
        </div>
      </div>
    );
  }

  const publishedCount = events.filter(e => e.status === 'published').length;
  const draftCount = events.filter(e => e.status === 'draft').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">לוח בקרת מנהל</h2>
          <p className="text-muted-foreground">ניהול אירועי רכיבה ופרסום תוצאות</p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <span className="text-sm text-muted-foreground">מחובר כמנהל</span>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <h3 className="text-xl font-semibold text-card-foreground mb-6">ניהול אירועים</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">שם האירוע</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">תאריך</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">סטטוס</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event.id} className="border-b border-border hover:bg-muted/50" data-testid={`row-event-${index}`}>
                  <td className="py-3 px-4 font-medium" data-testid={`text-event-name-${index}`}>
                    {event.name}
                  </td>
                  <td className="py-3 px-4" data-testid={`text-event-date-${index}`}>
                    {new Date(event.event_date).toLocaleDateString('he-IL')}
                  </td>
                  <td className="py-3 px-4">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        event.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                      data-testid={`text-event-status-${index}`}
                    >
                      {event.status === 'published' ? 'פורסם' : 'טיוטה'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handlePublishToggle(event.id, event.status)}
                      disabled={loading === event.id}
                      className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                        event.status === 'published'
                          ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                          : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                      } disabled:opacity-50`}
                      data-testid={`button-toggle-${index}`}
                    >
                      {loading === event.id ? 'מעדכן...' : (
                        event.status === 'published' ? 'בטל פרסום' : 'פרסם'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-muted-foreground">סה"כ אירועים</p>
              <p className="text-2xl font-bold text-card-foreground" data-testid="text-total-events">
                {events.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-muted-foreground">אירועים פורסמו</p>
              <p className="text-2xl font-bold text-card-foreground" data-testid="text-published-events">
                {publishedCount}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div className="mr-4">
              <p className="text-sm font-medium text-muted-foreground">טיוטות</p>
              <p className="text-2xl font-bold text-card-foreground" data-testid="text-draft-events">
                {draftCount}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}