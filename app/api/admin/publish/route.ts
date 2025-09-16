import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';
import { getCurrentUser, isAdmin } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const userIsAdmin = await isAdmin();
    
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    if (!userIsAdmin) {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { eventId, status } = body;

    if (!eventId || !status || !['published', 'draft'].includes(status)) {
      return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('events')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', eventId);

    if (error) {
      console.error('Error updating event status:', error);
      return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Event status updated successfully' });
  } catch (error) {
    console.error('Error in publish route:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
