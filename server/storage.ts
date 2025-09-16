import { type Event, type InsertEvent } from "@shared/schema";
import { neon } from "@neondatabase/serverless";

// PostgreSQL client using the DATABASE_URL
const sql = neon(process.env.DATABASE_URL!);

export interface IStorage {
  getPublishedEvents(): Promise<Event[]>;
  getAllEvents(): Promise<Event[]>;
  getEventById(id: string): Promise<Event | undefined>;
  updateEventStatus(id: string, status: string): Promise<void>;
}

export class PostgresStorage implements IStorage {
  async getPublishedEvents(): Promise<Event[]> {
    const events = await sql`
      SELECT id, name, event_date, status, created_at, updated_at 
      FROM events 
      WHERE status = 'published' 
      ORDER BY event_date DESC
    `;
    return events as Event[];
  }

  async getAllEvents(): Promise<Event[]> {
    const events = await sql`
      SELECT id, name, event_date, status, created_at, updated_at 
      FROM events 
      ORDER BY event_date DESC
    `;
    return events as Event[];
  }

  async getEventById(id: string): Promise<Event | undefined> {
    const events = await sql`
      SELECT id, name, event_date, status, created_at, updated_at 
      FROM events 
      WHERE id = ${id}
    `;
    return events[0] as Event | undefined;
  }

  async updateEventStatus(id: string, status: string): Promise<void> {
    await sql`
      UPDATE events 
      SET status = ${status}, updated_at = now() 
      WHERE id = ${id}
    `;
  }
}

export const storage = new PostgresStorage();
